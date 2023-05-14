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

	if request.Email == "" || request.Password == "" {
		controller.serveError(w, http.StatusBadRequest, AuthError.New("did not enter email address or password"))
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

//// AddFavouriteLot is an endpoint that creates user favourite lot.
//func (controller *Users) AddFavouriteLot(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Content-Type", "application/json")
//	ctx := r.Context()
//
//	claimsMap, err := goauth.GetClaims(ctx)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	claims, err := userauth.GetStructClaims(&claimsMap)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	type CreateFavouriteLot struct {
//		LotID uuid.UUID         `json:"lotId"`
//		Place marketplace.Place `json:"place"`
//	}
//
//	var createFavouriteLot CreateFavouriteLot
//
//	if err = json.NewDecoder(r.Body).Decode(&createFavouriteLot); err != nil {
//		controller.serveError(w, http.StatusBadRequest, ErrUsers.Wrap(err))
//		return
//	}
//
//	if !createFavouriteLot.Place.IsValid() {
//		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid place"))
//		return
//	}
//
//	favouriteLot := marketplace.FavouriteLot{
//		UserID: claims.UserID,
//		Place:  createFavouriteLot.Place,
//	}
//
//	favouriteLot.Lot.CardID = createFavouriteLot.LotID
//
//	err = controller.marketplace.AddFavouriteLot(ctx, favouriteLot)
//	if err != nil {
//		controller.log.Error(fmt.Sprintf("could not create favourite lot for user %v and card %v", favouriteLot.UserID, favouriteLot.Lot.CardID), ErrUsers.Wrap(err))
//		controller.serveError(w, http.StatusInternalServerError, ErrUsers.Wrap(err))
//		return
//	}
//}
//
//// ListFavouriteLots is an endpoint that returns all user favourite lots.
//func (controller *Users) ListFavouriteLots(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Content-Type", "application/json")
//	ctx := r.Context()
//	vars := mux.Vars(r)
//	urlQuery := r.URL.Query()
//	name := urlQuery.Get("name")
//	orderByASC := cards.SortFilter(urlQuery.Get("sort_by_asc"))
//	if !orderByASC.IsValid() {
//		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("filter sort by asc is not valid"))
//		return
//	}
//	orderByDESC := cards.SortFilter(urlQuery.Get("sort_by_desc"))
//	if !orderByDESC.IsValid() {
//		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("filter sort by desc is not valid"))
//		return
//	}
//
//	var (
//		favouriteLots marketplace.FavouriteLotPage
//		limit         int
//		page          int
//	)
//
//	claimsMap, err := goauth.GetClaims(ctx)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	claims, err := userauth.GetStructClaims(&claimsMap)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	limitQuery := urlQuery.Get("limit")
//	if limitQuery != "" {
//		if limit, err = strconv.Atoi(limitQuery); err != nil {
//			controller.serveError(w, http.StatusBadRequest, ErrUsers.Wrap(err))
//			return
//		}
//	}
//
//	pageQuery := urlQuery.Get("page")
//	if pageQuery != "" {
//		if page, err = strconv.Atoi(pageQuery); err != nil {
//			controller.serveError(w, http.StatusBadRequest, ErrUsers.Wrap(err))
//			return
//		}
//	}
//
//	cursor := pagination.Cursor{
//		Limit: limit,
//		Page:  page,
//	}
//
//	place := marketplace.Place(vars["place"])
//	if !place.IsValid() {
//		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid place"))
//		return
//	}
//
//	favouriteLots, err = controller.marketplace.ListFavouriteLots(ctx, claims.UserID, name, orderByASC, orderByDESC, place, cursor)
//	if err != nil {
//		controller.log.Error(fmt.Sprintf("could not list user %x favourite lots", claims.UserID), ErrUsers.Wrap(err))
//		controller.serveError(w, http.StatusInternalServerError, ErrUsers.Wrap(err))
//		return
//	}
//
//	type ResponseFavouriteLot struct {
//		UserID uuid.UUID `json:"userId"`
//		marketplace.ResponseDetailedLot
//	}
//
//	type response struct {
//		FavouriteLots []ResponseFavouriteLot `json:"favouriteLots"`
//		Page          pagination.Page        `json:"page"`
//	}
//	var res response
//
//	for _, lot := range favouriteLots.Lots {
//		favouriteLot := ResponseFavouriteLot{
//			lot.UserID,
//			marketplace.ResponseDetailedLot{
//				OwnerName:    lot.OwnerName,
//				ArtistName:   lot.ArtistName,
//				ArtistID:     lot.ArtistID,
//				BidsCount:    lot.BidsCount,
//				CardID:       lot.CardID,
//				EndTime:      lot.EndTime,
//				IsFavourite:  lot.IsFavourite,
//				CurrentPrice: evmsignature.WeiBigToEthereumFloat(&lot.CurrentPrice),
//				Card:         lot.Card,
//			},
//		}
//
//		res.FavouriteLots = append(res.FavouriteLots, favouriteLot)
//	}
//	res.Page = favouriteLots.Page
//
//	if err = json.NewEncoder(w).Encode(res); err != nil {
//		controller.log.Error("failed to write json response", ErrUsers.Wrap(err))
//		return
//	}
//}
//
//// DeleteFavouriteLot is an endpoint that deletes user favourite lot.
//func (controller *Users) DeleteFavouriteLot(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Content-Type", "application/json")
//	ctx := r.Context()
//
//	claimsMap, err := goauth.GetClaims(ctx)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	claims, err := userauth.GetStructClaims(&claimsMap)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	type DeleteFavouriteLot struct {
//		LotID uuid.UUID `json:"lotId"`
//	}
//
//	var deleteFavouriteLot DeleteFavouriteLot
//	if err = json.NewDecoder(r.Body).Decode(&deleteFavouriteLot); err != nil {
//		controller.serveError(w, http.StatusBadRequest, ErrUsers.Wrap(err))
//		return
//	}
//
//	err = controller.marketplace.DeleteFavouriteLot(ctx, claims.UserID, deleteFavouriteLot.LotID)
//	if err != nil {
//		if users.ErrNoUser.Has(err) {
//			controller.serveError(w, http.StatusNotFound, ErrUsers.Wrap(err))
//			return
//		}
//
//		controller.log.Error(fmt.Sprintf("could not deletes user %v favourite lot %v", claims.UserID, deleteFavouriteLot.LotID), ErrUsers.Wrap(err))
//		controller.serveError(w, http.StatusInternalServerError, ErrUsers.Wrap(err))
//		return
//	}
//}
//
//// UpdateName is an endpoint that updates user name.
//func (controller *Users) UpdateName(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Content-Type", "application/json")
//	ctx := r.Context()
//
//	claimsMap, err := goauth.GetClaims(ctx)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	claims, err := userauth.GetStructClaims(claimsMap)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	type Request struct {
//		Name string `json:"name"`
//	}
//
//	var request Request
//	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
//		controller.serveError(w, http.StatusBadRequest, ErrUsers.Wrap(err))
//		return
//	}
//
//	err = controller.users.UpdateName(ctx, claims.UserID, request.Name)
//	if err != nil {
//		switch {
//		case users.ErrNoUser.Has(err):
//			controller.serveError(w, http.StatusNotFound, ErrUsers.Wrap(err))
//			return
//		case users.ErrNonUniqueName.Has(err):
//			controller.serveError(w, http.StatusBadRequest, ErrUsers.Wrap(err))
//			return
//		default:
//			controller.log.Error(fmt.Sprintf("could not update user %x name %s", claims.UserID, request.Name), ErrUsers.Wrap(err))
//			controller.serveError(w, http.StatusInternalServerError, ErrUsers.Wrap(err))
//			return
//		}
//	}
//}
//
//// UpdateProfileImage is an endpoint that updates profile image of user.
//func (controller *Users) UpdateProfileImage(w http.ResponseWriter, r *http.Request) {
//	w.Header().Set("Content-Type", "application/json")
//	ctx := r.Context()
//
//	claimsMap, err := goauth.GetClaims(ctx)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	claims, err := userauth.GetStructClaims(&claimsMap)
//	if err != nil {
//		controller.serveError(w, http.StatusUnauthorized, ErrUsers.Wrap(err))
//		return
//	}
//
//	type request struct {
//		Image string `json:"image"`
//	}
//
//	var req request
//	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
//		controller.serveError(w, http.StatusBadRequest, ErrUsers.Wrap(err))
//		return
//	}
//
//	err = controller.users.UpdateProfileImage(ctx, claims.UserID, req.Image)
//	if err != nil {
//		if users.ErrTooLargeFile.Has(err) {
//			controller.serveError(w, http.StatusBadRequest, ErrUsers.Wrap(err))
//			return
//		}
//
//		controller.log.Error(fmt.Sprintf("could not update user %x profile image", claims.UserID), ErrUsers.Wrap(err))
//		controller.serveError(w, http.StatusInternalServerError, ErrUsers.Wrap(err))
//		return
//	}
//}

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
