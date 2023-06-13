package controllers

import (
	"encoding/json"
	"github.com/BoostyLabs/goauth"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/zeebo/errs"
	"graduate_work/products"
	"graduate_work/users/userauth"
	"log"
	"net/http"
	"strconv"
)

var (
	// ErrProducts is an internal error type for products controller.
	ErrProducts = errs.Class("products controller error")
)

// Products is a mvc controller that handles all products related views.
type Products struct {
	products *products.Service
}

// NewProducts is a constructor for products controller.
func NewProducts(products *products.Service) *Products {
	productsController := &Products{
		products: products,
	}

	return productsController
}

func (controller *Products) Create(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	//claimsMap, err := goauth.GetClaims(ctx)
	//if err != nil {
	//	controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
	//	return
	//}
	//
	//claims, err := userauth.GetStructClaims(claimsMap)
	//if err != nil {
	//	controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
	//	return
	//}

	var err error
	var request products.ProductWithCategoryName

	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrProducts.Wrap(err))
		return
	}

	err = controller.products.Create(ctx, request)
	if err != nil {
		log.Println("Unable to create product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}
}

func (controller *Products) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid id"))
		return
	}

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	product, err := controller.products.Get(ctx, claims.UserID, id)
	if err != nil {
		log.Println("Unable to create product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(product); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

func (controller *Products) ListRecommendations(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid id"))
		return
	}

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	product, err := controller.products.ListRecommendation(ctx, claims.UserID, id)
	if err != nil {
		log.Println("Unable to list recommendation product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(product); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

func (controller *Products) ListHomeRecommendations(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	product, err := controller.products.ListHomeRecommendation(ctx, claims.UserID)
	if err != nil {
		log.Println("Unable to list home recommendation product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(product); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

func (controller *Products) List(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	allProducts, err := controller.products.List(ctx, claims.UserID)
	if err != nil {
		log.Println("Unable to create product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(allProducts); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

func (controller *Products) ListBySubSubCategoryID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["categoryId"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid id"))
		return
	}

	urlQuery := r.URL.Query()
	color := urlQuery.Get("color")
	priceFromStr := urlQuery.Get("priceFrom")
	priceToStr := urlQuery.Get("priceTo")

	var (
		priceFrom float64
		priceTo   float64
	)
	if priceFromStr != "" {
		priceFrom, err = strconv.ParseFloat(priceFromStr, 64)
		if err != nil {
			controller.serveError(w, http.StatusBadRequest, err)
			return
		}
	}

	if priceToStr != "" {
		priceTo, err = strconv.ParseFloat(priceToStr, 64)
		if err != nil {
			controller.serveError(w, http.StatusBadRequest, err)
			return
		}
	}

	allProducts, err := controller.products.ListBySubSubCategoryID(ctx, claims.UserID, id, color, float32(priceFrom), float32(priceTo))
	if err != nil {
		log.Println("Unable to create product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(allProducts); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

func (controller *Products) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid id"))
		return
	}

	var request products.Product

	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrProducts.Wrap(err))
		return
	}
	request.ID = id

	err = controller.products.Update(ctx, request)
	if err != nil {
		log.Println("Unable to update product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}
}

func (controller *Products) LikeProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid id"))
		return
	}

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	err = controller.products.LikeProduct(ctx, claims.UserID, id)
	if err != nil {
		log.Println("Unable to like product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}
}

func (controller *Products) ListLikedProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	allProducts, err := controller.products.ListLikedProducts(ctx, claims.UserID)
	if err != nil {
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(allProducts); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

func (controller *Products) CountLikedProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	allProducts, err := controller.products.ListLikedProducts(ctx, claims.UserID)
	if err != nil {
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(len(allProducts)); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

func (controller *Products) SearchByTitle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	urlQuery := r.URL.Query()
	title := urlQuery.Get("title")

	allProducts, err := controller.products.SearchByTitle(ctx, claims.UserID, title)
	if err != nil {
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(allProducts); err != nil {
		log.Println("failed to write json response", ErrUsers.Wrap(err))
		return
	}
}

func (controller *Products) UnlikeProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid id"))
		return
	}

	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	claims, err := userauth.GetStructClaims(claimsMap)
	if err != nil {
		controller.serveError(w, http.StatusUnauthorized, ErrProducts.Wrap(err))
		return
	}

	err = controller.products.UnlikeProduct(ctx, claims.UserID, id)
	if err != nil {
		log.Println("Unable to unlike product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}
}

func (controller *Products) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrUsers.New("invalid id"))
		return
	}

	err = controller.products.Delete(ctx, id)
	if err != nil {
		log.Println("Unable to delete product", ErrProducts.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrProducts.Wrap(err))
		return
	}
}

// serveError replies to request with specific code and error.
func (controller *Products) serveError(w http.ResponseWriter, status int, err error) {
	w.WriteHeader(status)

	var response struct {
		Error string `json:"error"`
	}

	response.Error = err.Error()

	if err = json.NewEncoder(w).Encode(response); err != nil {
		log.Println("failed to write json error response", ErrUsers.Wrap(err))
	}
}
