package products

import (
	"context"
	"github.com/google/uuid"
)

type DB interface {
	Create(ctx context.Context, product Product) error
	Get(ctx context.Context, id uuid.UUID) (Product, error)
	List(ctx context.Context) ([]Product, error)
	Update(ctx context.Context, product Product) error
	Delete(ctx context.Context, id uuid.UUID) error
	LikeProduct(ctx context.Context, productID, userID uuid.UUID) error
	UnlikeProduct(ctx context.Context, productID, userID uuid.UUID) error
	GetLikedUserProduct(ctx context.Context, productID, userID uuid.UUID) (bool, error)
	ListLikedProducts(ctx context.Context, userID uuid.UUID) ([]uuid.UUID, error)
	ListBySubSubCategoryID(ctx context.Context, id uuid.UUID) ([]Product, error)
}

type Product struct {
	ID               uuid.UUID `json:"id"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	Price            float32   `json:"price"`
	Color            string    `json:"color"`
	Brand            string    `json:"brand"`
	IsLiked          bool      `json:"isLiked"`
	IsAvailable      bool      `json:"isAvailable"`
	Images           []string  `json:"images"`
	NumOfImages      int       `json:"numOfImages"`
	SubsubcategoryID uuid.UUID `json:"subsubcategoryId"`
}
