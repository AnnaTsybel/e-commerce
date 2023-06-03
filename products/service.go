package products

import (
	"bytes"
	"context"
	"encoding/base64"
	"graduate_work/pkg/store"
	"graduate_work/users"
	"io"
	"path/filepath"
	"strconv"

	"github.com/google/uuid"
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

		product.IsLiked = true
		product.NumOfImages, _ = service.CountImages(ctx, product.ID)
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

	products := service.SearchSimilarProducts(likedProducts, product)

	switch {
	case len(products) < 8:
		all, err := service.List(ctx, userID)
		if err != nil {
			return nil, err
		}

		products = service.SearchSimilarProductsExceptGiven(all, products, product)
	case len(products) > 8:
		products = products[:8]
	}

	return products, nil
}

func (service *Service) ListHomeRecommendation(ctx context.Context, userID uuid.UUID) ([]Product, error) {
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

		for i := 0; i < len(liked); i++ {
			liked[i].IsLiked, _ = service.db.GetLikedUserProduct(ctx, liked[i].ID, userID)
		}

		likedProducts = append(likedProducts, liked...)
	}

	if len(likedProducts) < 8 {
		products, err := service.List(ctx, userID)
		if err != nil {
			return nil, err
		}

		likedProducts = ExceptGivenFromSlice(products, likedProducts)
	}

	if len(likedProducts) > 8 {
		likedProducts = likedProducts[:8]
	}

	return likedProducts, nil
}

func (service *Service) SearchSimilarProductsExceptGiven(productsToAnalyze, given []Product, product Product) []Product {
	sortedProducts := service.SearchSimilarProducts(productsToAnalyze, product)

	result := make([]Product, 0, len(sortedProducts))

	for _, sortedProduct := range sortedProducts {
		if !contains(given, sortedProduct) {
			result = append(result, sortedProduct)
		}
	}

	return sortedProducts
}

func ExceptGivenFromSlice(all, given []Product) []Product {
	result := make([]Product, 0, len(all))

	for _, sortedProduct := range all {
		if !contains(given, sortedProduct) {
			result = append(result, sortedProduct)
		}
	}

	return result
}

func contains(s []Product, str Product) bool {
	for _, v := range s {
		if v.ID == str.ID {
			return true
		}
	}

	return false
}

func (service *Service) SearchSimilarProducts(productsToAnalyze []Product, product Product) []Product {
	priceFrom := product.Price - 3000
	priceTo := product.Price + 3000

	recommendedProducts := make([]Product, 0, 8)

	for _, productToAnalyze := range productsToAnalyze {
		price := productToAnalyze.Price
		if price > priceFrom && price < priceTo && product.ID != productToAnalyze.ID {
			recommendedProducts = append(recommendedProducts, productToAnalyze)
		}
	}

	if len(recommendedProducts) > 8 {
		recommendedProducts = recommendedProducts[:8]
	}

	return recommendedProducts
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
