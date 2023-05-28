package products

import (
	"bytes"
	"context"
	"encoding/base64"
	"github.com/google/uuid"
	"graduate_work/pkg/store"
	"graduate_work/users"
	"io"
	"path/filepath"
	"strconv"
)

type Service struct {
	db DB

	store *store.Store
	users *users.Service
}

func New(db DB, store *store.Store, users *users.Service) *Service {
	return &Service{
		db:    db,
		store: store,
		users: users,
	}
}

func (service *Service) Create(ctx context.Context, product Product) error {
	product.ID = uuid.New()
	product.IsAvailable = true

	err := service.db.Create(ctx, product)
	if err != nil {
		return err
	}

	for i, image := range product.Images {
		img, err := base64.StdEncoding.DecodeString(image)
		if err != nil {
			return err
		}

		name := strconv.Itoa(i) + ".png"

		err = service.CreateProductImage(ctx, product.ID, name, bytes.NewBuffer(img))
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

func (service *Service) ListLikedProducts(ctx context.Context, userID uuid.UUID) ([]Product, error) {
	productIDs, err := service.db.ListLikedProducts(ctx, userID)
	if err != nil {
		return nil, err
	}

	products := make([]Product, 0, len(productIDs))

	for _, productID := range productIDs {
		product, err := service.db.Get(ctx, productID)
		if err != nil {
			return nil, err
		}

		products = append(products, product)
	}

	return products, nil
}

func (service *Service) ListRecommendation(ctx context.Context, userID, productID uuid.UUID) ([]Product, error) {
	similarUsers, err := service.users.SearchSimilarUsers(ctx, userID)
	if err != nil {
		return nil, err
	}

	likedProducts := make([]Product, 0, 100)
	for _, user := range similarUsers {
		liked, err := service.ListLikedProducts(ctx, user.ID)
		if err != nil {
			return nil, err
		}

		likedProducts = append(likedProducts, liked...)
	}

	product, err := service.db.Get(ctx, productID)
	if err != nil {
		return nil, err
	}

	return service.SearchSimilarProducts(ctx, likedProducts, product)
}

func (service *Service) SearchSimilarProducts(ctx context.Context, productsToAnalyze []Product, product Product) ([]Product, error) {
	return nil, nil
}

func (service *Service) Update(ctx context.Context, product Product) error {
	relatedPath := filepath.Join("products", product.ID.String())
	err := service.store.DeleteFolder(ctx, relatedPath)
	if err != nil {
		return err
	}

	for i, image := range product.Images {
		img, err := base64.StdEncoding.DecodeString(image)
		if err != nil {
			return err
		}

		name := strconv.Itoa(i) + ".png"

		err = service.CreateProductImage(ctx, product.ID, name, bytes.NewBuffer(img))
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
