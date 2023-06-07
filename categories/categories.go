package categories

import (
	"context"
	"github.com/google/uuid"
)

type DB interface {
	CreateCategory(ctx context.Context, category Category) error
	ListCategories(ctx context.Context) ([]Category, error)
	CreateSubcategory(ctx context.Context, category Subcategory) error
	ListSubcategoriesByID(ctx context.Context, id uuid.UUID) ([]Subcategory, error)
	CreateSubsubcategory(ctx context.Context, category Subsubcategory) error
	ListSubsubcategoriesByID(ctx context.Context, id uuid.UUID) ([]Subsubcategory, error)
}

type Category struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Image string    `json:"image"`
}

type Subcategory struct {
	ID         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	CategoryID uuid.UUID `json:"categoryId"`
	Image      string    `json:"image"`
}

type Subsubcategory struct {
	ID            uuid.UUID `json:"id"`
	Name          string    `json:"name"`
	SubcategoryID uuid.UUID `json:"categoryId"`
	Image         string    `json:"image"`
}
