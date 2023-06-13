package controllers

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/zeebo/errs"
	"graduate_work/categories"
	"log"
	"net/http"
)

var (
	// ErrCategories is an internal error type for categories controller.
	ErrCategories = errs.Class("categories controller error")
)

// Categories is a mvc controller that handles all categories related views.
type Categories struct {
	categories *categories.Service
}

// NewCategories is a constructor for categories controller.
func NewCategories(categories *categories.Service) *Categories {
	usersController := &Categories{
		categories: categories,
	}

	return usersController
}

func (controller *Categories) CreateCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var err error
	var request categories.Category
	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrCategories.Wrap(err))
		return
	}

	err = controller.categories.CreateCategory(ctx, request)
	if err != nil {
		log.Println("Unable to create category", ErrCategories.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrCategories.Wrap(err))
		return
	}
}

func (controller *Categories) ListCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	categories, err := controller.categories.ListCategories(ctx)
	if err != nil {
		log.Println("could not list categories", ErrCategories.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrCategories.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(categories); err != nil {
		log.Println("failed to write json response", ErrCategories.Wrap(err))
		return
	}
}

func (controller *Categories) CreateSubCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var err error
	var request categories.Subcategory
	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrCategories.Wrap(err))
		return
	}

	err = controller.categories.CreateSubcategory(ctx, request)
	if err != nil {
		log.Println("Unable to create subcategory", ErrCategories.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrCategories.Wrap(err))
		return
	}
}

func (controller *Categories) ListSubCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrCategories.New("invalid id"))
		return
	}

	subcategories, err := controller.categories.ListSubcategoriesByID(ctx, id)
	if err != nil {
		log.Println("could not list subcategories", ErrCategories.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrCategories.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(subcategories); err != nil {
		log.Println("failed to write json response", ErrCategories.Wrap(err))
		return
	}
}

func (controller *Categories) CreateSubSubCategory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	var err error
	var request categories.Subsubcategory
	if err = json.NewDecoder(r.Body).Decode(&request); err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrCategories.Wrap(err))
		return
	}

	err = controller.categories.CreateSubsubcategory(ctx, request)
	if err != nil {
		log.Println("Unable to create subsubcategory", ErrCategories.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrCategories.Wrap(err))
		return
	}
}

func (controller *Categories) ListSubSubCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		controller.serveError(w, http.StatusBadRequest, ErrCategories.New("invalid id"))
		return
	}

	subcategories, err := controller.categories.ListSubsubcategoriesByID(ctx, id)
	if err != nil {
		log.Println("could not list subcategories", ErrCategories.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrCategories.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(subcategories); err != nil {
		log.Println("failed to write json response", ErrCategories.Wrap(err))
		return
	}
}

func (controller *Categories) ListCategoriesWithChildren(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	subcategories, err := controller.categories.ListCategoryWithChildren(ctx)
	if err != nil {
		log.Println("could not ListCategoryWithChildren", ErrCategories.Wrap(err))
		controller.serveError(w, http.StatusInternalServerError, ErrCategories.Wrap(err))
		return
	}

	if err = json.NewEncoder(w).Encode(subcategories); err != nil {
		log.Println("failed to write json response", ErrCategories.Wrap(err))
		return
	}
}

// serveError replies to request with specific code and error.
func (controller *Categories) serveError(w http.ResponseWriter, status int, err error) {
	w.WriteHeader(status)

	var response struct {
		Error string `json:"error"`
	}

	response.Error = err.Error()

	if err = json.NewEncoder(w).Encode(response); err != nil {
		log.Println("failed to write json error response", ErrCategories.Wrap(err))
	}
}
