package console

import (
	"context"
	"errors"
	"graduate_work/console/controllers"
	"graduate_work/products"
	"graduate_work/users"
	"graduate_work/users/userauth"
	"html/template"
	"log"
	"net"
	"net/http"
	"path/filepath"

	"github.com/BoostyLabs/goauth"
	"github.com/gorilla/mux"
	"github.com/zeebo/errs"
	"golang.org/x/sync/errgroup"
)

var (
	// Error is an error class that indicates internal http server error.
	Error = errs.Class("console web server error")
)

// Config contains configuration for console web server.
type Config struct {
	Address    string `json:"address"`
	StaticDir  string `json:"staticDir"`
	PhotosDir  string `json:"photosDir"`
	CookieName string `json:"cookieName"`
	Path       string `json:"path"`
}

// Server represents console web server.
//
// architecture: Endpoint
type Server struct {
	config Config

	listener net.Listener
	server   http.Server

	authService *userauth.Service
	cookieAuth  *goauth.CookieAuth

	templates struct {
		index *template.Template
	}
}

// NewServer is a constructor for console web server.
func NewServer(config Config, listener net.Listener, userAuth *userauth.Service, users *users.Service, products *products.Service) *Server {
	server := &Server{
		config:      config,
		listener:    listener,
		authService: userAuth,
		cookieAuth: goauth.NewCookieAuth(goauth.CookieSettings{
			Name: config.CookieName,
			Path: config.Path,
		}),
	}

	err := server.initializeTemplates()
	if err != nil {
		return nil
	}

	usersController := controllers.NewUsers(users)
	authController := controllers.NewAuth(userAuth, server.cookieAuth)
	productsController := controllers.NewProducts(products)

	router := mux.NewRouter()
	apiRouter := router.PathPrefix("/api/v0").Subrouter()

	authRouter := apiRouter.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/register", authController.Register).Methods(http.MethodPost)
	authRouter.HandleFunc("/login", authController.Login).Methods(http.MethodPost)
	authRouter.HandleFunc("/logout", authController.Logout).Methods(http.MethodPost)
	authRouter.Handle("/password", server.withAuth(http.HandlerFunc(authController.ChangePassword))).Methods(http.MethodPut)
	authRouter.Handle("/email", server.withAuth(http.HandlerFunc(authController.ChangeEmail))).Methods(http.MethodPut)

	userRouter := apiRouter.PathPrefix("/users").Subrouter()
	userRouter.Use(server.withAuth)
	userRouter.HandleFunc("", usersController.GetProfile).Methods(http.MethodGet)
	userRouter.HandleFunc("/liked", productsController.ListLikedProducts).Methods(http.MethodGet)
	userRouter.HandleFunc("", usersController.UpdateUser).Methods(http.MethodPut)

	productsRouter := apiRouter.PathPrefix("/products").Subrouter()
	productsRouter.Use(server.withAuth)
	productsRouter.HandleFunc("", productsController.Create).Methods(http.MethodPost)
	productsRouter.HandleFunc("/{id}", productsController.Get).Methods(http.MethodGet)
	productsRouter.HandleFunc("/{id}/recommendation", productsController.Get).Methods(http.MethodGet)
	productsRouter.HandleFunc("", productsController.List).Methods(http.MethodGet)
	productsRouter.HandleFunc("/{id}", productsController.Update).Methods(http.MethodPut)
	productsRouter.HandleFunc("/{id}", productsController.Delete).Methods(http.MethodDelete)
	productsRouter.HandleFunc("/{id}/like", productsController.LikeProduct).Methods(http.MethodPost)
	productsRouter.HandleFunc("/{id}/like", productsController.UnlikeProduct).Methods(http.MethodDelete)

	imagesServer := http.FileServer(http.Dir(server.config.PhotosDir))
	router.PathPrefix("/images/").Handler(http.StripPrefix("/images/", imagesServer))

	fs := http.FileServer(http.Dir(server.config.StaticDir))
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static", fs))
	router.PathPrefix("/").HandlerFunc(server.appHandler)

	server.server = http.Server{
		Handler: router,
	}

	return server
}

// Run starts the server that host webapp and api endpoint.
func (server *Server) Run(ctx context.Context) (err error) {
	err = server.initializeTemplates()
	if err != nil {
		return Error.Wrap(err)
	}

	ctx, cancel := context.WithCancel(ctx)
	var group errgroup.Group
	group.Go(func() error {
		<-ctx.Done()
		return Error.Wrap(server.server.Shutdown(context.Background()))
	})
	group.Go(func() error {
		defer cancel()
		err := server.server.Serve(server.listener)
		isCancelled := errs.IsFunc(err, func(err error) bool { return errors.Is(err, context.Canceled) })
		if isCancelled || errors.Is(err, http.ErrServerClosed) {
			err = nil
		}
		return Error.Wrap(err)
	})

	return Error.Wrap(group.Wait())
}

// Close closes server and underlying listener.
func (server *Server) Close() error {
	return Error.Wrap(server.server.Close())
}

// appHandler is web app http handler function.
func (server *Server) appHandler(w http.ResponseWriter, r *http.Request) {
	header := w.Header()

	header.Set("Content-Type", "text/html; charset=UTF-8")
	// header.Set("X-Content-Type-Options", "nosniff").
	header.Set("Referrer-Policy", "same-origin")

	if server.templates.index == nil {
		log.Println("index template is not set", nil)
		return
	}

	if err := server.templates.index.Execute(w, nil); err != nil {
		log.Println("index template could not be executed", err)
		return
	}
}

// withAuth performs initial authorization before every request.
func (server *Server) withAuth(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		token, err := server.cookieAuth.GetToken(r)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		claims, err := server.authService.Authorize(ctx, token)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		ctx = goauth.SetClaims(ctx, claims)

		handler.ServeHTTP(w, r.Clone(ctx))
	})
}

// initializeTemplates is used to initialize all templates.
func (server *Server) initializeTemplates() (err error) {
	server.templates.index, err = template.ParseFiles(filepath.Join(server.config.StaticDir, "dist", "index.html"))
	if err != nil {
		log.Println("dist folder is not generated. use 'npm run build' command", err)
		return err
	}
	log.Println("initialized")

	return nil
}
