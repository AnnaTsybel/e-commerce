package products

import (
	"bytes"
	"context"
	"encoding/base64"
	"github.com/google/uuid"
	"graduate_work/pkg/store"
	"io"
	"path/filepath"
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

	for _, imageWithName := range product.ImagesWithName {
		img, err := base64.StdEncoding.DecodeString(imageWithName.Image)
		if err != nil {
			return err
		}

		err = service.CreateProductImage(ctx, product.ID, imageWithName.Name, bytes.NewBuffer(img))
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

	product.IsLiked, _ = service.db.GetLikedUserProduct(ctx, product.ID, userID)
	product.NumOfImages, _ = service.CountImages(ctx, productID)

	return product, nil
}

func (service *Service) List(ctx context.Context, userID uuid.UUID) ([]Product, error) {
	allProducts, err := service.db.List(ctx)
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(allProducts); i++ {
		allProducts[i].IsLiked, _ = service.db.GetLikedUserProduct(ctx, allProducts[i].ID, userID)
		allProducts[i].NumOfImages, _ = service.CountImages(ctx, allProducts[i].ID)
	}

	return allProducts, nil
}

func (service *Service) Update(ctx context.Context, product Product) error {
	relatedPath := filepath.Join("products", product.ID.String())
	err := service.store.DeleteFolder(ctx, relatedPath)
	if err != nil {
		return err
	}

	for _, imageWithName := range product.ImagesWithName {
		img, err := base64.StdEncoding.DecodeString(imageWithName.Image)
		if err != nil {
			return err
		}

		err = service.CreateProductImage(ctx, product.ID, imageWithName.Name, bytes.NewBuffer(img))
		if err != nil {
			return err
		}
	}

	return service.db.Update(ctx, product)
}

func (service *Service) Delete(ctx context.Context, id uuid.UUID) error {
	relatedPath := filepath.Join("products", id.String())
	err := service.store.DeleteFolder(ctx, relatedPath)
	if err != nil {
		return err
	}

	return service.db.Delete(ctx, id)
}

func (service *Service) LikeProduct(ctx context.Context, userID, productID uuid.UUID) error {
	return service.db.LikeProduct(ctx, productID, userID)
}

func (service *Service) UnlikeProduct(ctx context.Context, userID, productID uuid.UUID) error {
	return service.db.UnlikeProduct(ctx, productID, userID)
}

func (service *Service) CreateProductImage(ctx context.Context, productID uuid.UUID, imageName string, reader io.Reader) error {
	pathFromRoot := filepath.Join("products", productID.String(), imageName)

	return service.store.Create(ctx, pathFromRoot, reader)
}

func (service *Service) CountImages(ctx context.Context, productID uuid.UUID) (int, error) {
	pathFromRoot := filepath.Join("products", productID.String())
	return service.store.Count(ctx, pathFromRoot)
}
