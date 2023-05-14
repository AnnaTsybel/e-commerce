package products

import (
	"context"
	"github.com/google/uuid"
	"graduate_work/pkg/store"
)

type Service struct {
	db DB

	store *store.Store
}

func New(db DB, store *store.Store) *Service {
	return &Service{
		db:    db,
		store: store,
	}
}

func (service *Service) Create(ctx context.Context, product Product) error {
	product.ID = uuid.New()

	err := service.db.Create(ctx, product)
	if err != nil {
		return err
	}

	for _, color := range product.Colors {
		err := service.db.CreateProductColor(ctx, product.ID, color)
		if err != nil {
			return err
		}
	}

	return nil
}

func (service *Service) Get(ctx context.Context, userID, productID uuid.UUID) (Product, error) {
	product, err := service.db.Get(ctx, productID)
	if err != nil {
		return Product{}, err
	}

	colors, err := service.db.ListProductColors(ctx, product.ID)
	if err != nil {
		return Product{}, err
	}

	product.Colors = colors
	product.IsLiked, _ = service.db.GetLikedUserProduct(ctx, product.ID, userID)

	return product, nil
}

func (service *Service) List(ctx context.Context, userID uuid.UUID) ([]Product, error) {
	allProducts, err := service.db.List(ctx)
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(allProducts); i++ {
		colors, err := service.db.ListProductColors(ctx, allProducts[i].ID)
		if err != nil {
			return nil, err
		}

		allProducts[i].Colors = colors
		allProducts[i].IsLiked, _ = service.db.GetLikedUserProduct(ctx, allProducts[i].ID, userID)

	}

	return allProducts, nil
}

func (service *Service) Update(ctx context.Context, product Product) error {
	return service.db.Update(ctx, product)
}

func (service *Service) Delete(ctx context.Context, id uuid.UUID) error {
	return service.db.Delete(ctx, id)
}

func (service *Service) DeleteColor(ctx context.Context, id uuid.UUID, color string) error {
	return service.db.DeleteProductColor(ctx, id, color)
}

func (service *Service) LikeProduct(ctx context.Context, userID, productID uuid.UUID) error {
	return service.db.LikeProduct(ctx, productID, userID)
}

func (service *Service) UnlikeProduct(ctx context.Context, userID, productID uuid.UUID) error {
	return service.db.UnlikeProduct(ctx, productID, userID)
}
