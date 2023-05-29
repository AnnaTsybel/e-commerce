package controllers

import (
	"encoding/json"
	"fmt"
	"graduate_work/users/userauth"
	"log"
	"net/http"
	_ "strconv"
	_ "time"

	"github.com/BoostyLabs/goauth"
	_ "github.com/google/uuid"
	_ "github.com/gorilla/mux"
	"github.com/zeebo/errs"

	"graduate_work/users"
)

var (
	// ErrUsers is an internal error type for users controller.
	ErrUsers = errs.Class("users controller error")
)

// Users is a mvc controller that handles all users related views.
type Users struct {
	users *users.Service
}

// NewUsers is a constructor for users controller.
func NewUsers(users *users.Service) *Users {
	usersController := &Users{
		users: users,
	}

	return usersController
}

// GetProfile is an endpoint that returns the current user profile with all relevant information.
func (controller *Users) GetProfile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
		return
	}

	profile, err := controller.users.Get(ctx, claims.UserID)
	if err != nil {
		log.Println(fmt.Sprintf("could not get profile %x", claims.UserID), ErrUsers.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrUsers.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(profile); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

// UpdateUser change users params.
func (controller *Users) UpdateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var err error
	var request users.CreateUserFields
	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		controller.serveError(w, http.StatusBadRequest, AuthError.Wrap(err))
		return
	}

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, AuthError.New("StatusUnauthorized"))
		return
	}

	log.Println("claimsMap", claimsMap)

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, AuthError.New("StatusUnauthorized"))
		return
	}

	err = controller.users.UpdateUser(ctx, claims.UserID, request)
	if err != nil {
		log.Println("Unable to confirm address", AuthError.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, AuthError.Wrap(err))
		return
	}
}

// serveError replies to request with specific code and error.
func (controller *Users) serveError(w http.ResponseWriter, status int, err error) {
	w.WriteHeader(status)

	var response struct {
		Error string `json:"error"`
	}

	response.Error = err.Error()

	if err = json.NewEncoder(w).Encode(response); err != nil {
		log.Println("failed to write json error response", ErrUsers.Wrap(err))
	}
}
