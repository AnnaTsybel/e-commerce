package documentize

import (
	"context"
	"errors"
	"github.com/BoostyLabs/goauth"
	"github.com/zeebo/errs"
	"golang.org/x/sync/errgroup"
	"graduate_work/categories"
	"graduate_work/console"
	"graduate_work/pkg/store"
	"graduate_work/products"
	"graduate_work/users"
	"graduate_work/users/userauth"
	"net"
)

type DB interface {
	CreateSchema(ctx context.Context) error

	Users() users.DB
	Products() products.DB
	Categories() categories.DB

	Close() error
}

type Config struct {
	DatabaseURL     string `env:"DATABASE_URL,notEmpty"`
	ServerAddress   string `env:"SERVER_ADDRESS,notEmpty"`
	StaticDir       string `env:"STATIC_DIR,notEmpty"`
	OutputPath      string `env:"OUTPUT_PATH,notEmpty"`
	TokenAuthSecret string `env:"TOKEN_AUTH_SECRET,notEmpty"`
}

type Documentize struct {
	config *Config

	users      *users.Service
	store      *store.Store
	auth       *userauth.Service
	products   *products.Service
	categories *categories.Service

	server *console.Server
}

func New(config *Config, db DB) (*Documentize, error) {
	app := &Documentize{
		config: config,
	}

	{
		cfg := store.Config{
			OutputPath: config.OutputPath,
		}

		app.store = store.NewStore(cfg)
	}

	{
		app.users = users.New(db.Users(), app.store)
	}

	{
		app.auth = userauth.NewService(
			db.Users(),
			app.users,
			goauth.TokenSigner{
				Secret: []byte(config.TokenAuthSecret),
			},
		)
	}

	{
		app.products = products.New(db.Products(), app.store, app.users)
	}

	{
		app.categories = categories.New(db.Categories(), app.store)
	}

	{
		listener, err := net.Listen("tcp", config.ServerAddress)
		if err != nil {
			return nil, err
		}

		cfg := console.Config{
			Address:    config.ServerAddress,
			StaticDir:  config.StaticDir,
			PhotosDir:  config.OutputPath,
			CookieName: "name_here",
			Path:       "/",
		}

		app.server = console.NewServer(
			cfg,
			listener,
			app.auth,
			app.users,
			app.products,
			app.categories,
		)
	}

	return app, nil
}

func (documentize *Documentize) Run(ctx context.Context) error {
	group, ctx := errgroup.WithContext(ctx)
	group.Go(func() error {
		return ignoreCancel(documentize.server.Run(ctx))
	})
	return group.Wait()
}

// Close closes all the resources.
func (documentize *Documentize) Close() error {
	var errlist errs.Group
	errlist.Add(documentize.server.Close())
	return errlist.Err()
}

// we ignore cancellation and stopping errors since they are expected.
func ignoreCancel(err error) error {
	if errors.Is(err, context.Canceled) {
		return nil
	}

	return err
}
