// Copyright (C) 2021-2022 Amuzed GmbH finn@amuzed.io.
// This file is part of the project AMUZED.
// AMUZED can not be copied and/or distributed without the express.
// permission of Amuzed GmbH.

package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/BoostyLabs/goauth"
	"github.com/zeebo/errs"

	"graduate_work/users"
	"graduate_work/users/userauth"
)

// AuthError is a internal error for auth controller.
var AuthError = errs.Class("auth controller error")

// Auth is an authentication controller that exposes users authentication functionality.
type Auth struct {
	userAuth *userauth.Service
	cookie   *goauth.CookieAuth
}

// NewAuth returns new instance of Auth.
func NewAuth(userAuth *userauth.Service, authCookie *goauth.CookieAuth) *Auth {
	return &Auth{
		userAuth: userAuth,
		cookie:   authCookie,
	}
}

// Register creates a new user account.
func (auth *Auth) Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var err error
	var request users.CreateUserFields

	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		auth.serveError(w, http.StatusBadRequest, AuthError.Wrap(err))
		return
	}

	token, err := auth.userAuth.Register(ctx, request.Email, request.Password, request.Name)
	if err != nil {
		log.Println("unable to register new user", AuthError.Wrap(err))
		auth.serveError(w, http.StatusInternalServerError, AuthError.Wrap(err))
		return
	}

	auth.cookie.SetTokenCookie(w, token)
}

// Login is an endpoint to authorize user and set auth cookie in browser.
func (auth *Auth) Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var err error
	var request users.CreateUserFields
	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		auth.serveError(w, http.StatusBadRequest, AuthError.Wrap(err))
		return
	}

	if request.Email == "" || request.Password == "" {
		auth.serveError(w, http.StatusBadRequest, AuthError.New("did not enter email address or password"))
		return
	}

	authToken, err := auth.userAuth.LoginToken(ctx, request.Email, request.Password)
	if err != nil {
		switch {
		case userauth.ErrUnauthenticated.Has(err):
			auth.serveError(w, http.StatusUnauthorized, AuthError.Wrap(err))
		default:
			log.Println("could not get auth token", AuthError.Wrap(err))
			auth.serveError(w, http.StatusInternalServerError, AuthError.Wrap(err))
		}

		return
	}

	auth.cookie.SetTokenCookie(w, authToken)
}

// ChangePassword change users password.
func (auth *Auth) ChangePassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var err error
	var request users.Password

	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		auth.serveError(w, http.StatusBadRequest, AuthError.Wrap(err))
		return
	}

	err = auth.userAuth.ChangePassword(ctx, request.Password, request.NewPassword)
	if err != nil {
		log.Println("Unable to change password", AuthError.Wrap(err))
		switch {
		case userauth.ErrUnauthenticated.Has(err):
			auth.serveError(w, http.StatusUnauthorized, AuthError.Wrap(err))
		default:
			auth.serveError(w, http.StatusInternalServerError, AuthError.Wrap(err))
		}

		return
	}

	if err = json.NewEncoder(w).Encode("success"); err != nil {
		log.Println("failed to write json response", AuthError.Wrap(err))
		return
	}
}

// ChangeEmail change users email.
func (auth *Auth) ChangeEmail(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var err error
	var request users.Email

	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		auth.serveError(w, http.StatusBadRequest, AuthError.Wrap(err))
		return
	}

	if request.Email == "" {
		auth.serveError(w, http.StatusBadRequest, AuthError.New("you did not enter recovery code"))
		return
	}

	err = auth.userAuth.ChangeEmail(ctx, request.Email)
	if err != nil {
		log.Println("Unable to confirm address", AuthError.Wrap(err))
		auth.serveError(w, http.StatusInternalServerError, AuthError.Wrap(err))
		return
	}
}

// Logout is an endpoint to log out and remove auth cookie from browser.
func (auth *Auth) Logout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	auth.cookie.RemoveTokenCookie(w)
}

// serveError replies to request with specific code and error.
func (auth *Auth) serveError(w http.ResponseWriter, status int, err error) {
	w.WriteHeader(status)

	var response struct {
		Error string `json:"error"`
	}

	response.Error = err.Error()

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Println("failed to write json error response", AuthError.Wrap(err))
	}
}
