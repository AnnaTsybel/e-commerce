package categories

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

func (service *Service) CreateCategory(ctx context.Context, category Category) error {
	category.ID = uuid.New()
	err := service.db.CreateCategory(ctx, category)
	if err != nil {
		return err
	}

	img, err := base64.StdEncoding.DecodeString(category.Image)
	if err != nil {
		return err
	}

	return service.CreateImage(ctx, category.ID, bytes.NewBuffer(img))
}

func (service *Service) ListCategories(ctx context.Context) ([]Category, error) {
	return service.db.ListCategories(ctx)
}

func (service *Service) CreateSubcategory(ctx context.Context, category Subcategory) error {
	category.ID = uuid.New()

	err := service.db.CreateSubcategory(ctx, category)
	if err != nil {
		return err
	}

	img, err := base64.StdEncoding.DecodeString(category.Image)
	if err != nil {
		return err
	}

	return service.CreateImage(ctx, category.ID, bytes.NewBuffer(img))
}

func (service *Service) ListSubcategoriesByID(ctx context.Context, id uuid.UUID) ([]Subcategory, error) {
	return service.db.ListSubcategoriesByID(ctx, id)
}

func (service *Service) ListSubSubcategories(ctx context.Context) ([]Subsubcategory, error) {
	return service.db.ListSubSubcategories(ctx)
}

func (service *Service) ListSubcategoriesByIDWithChild(ctx context.Context, id uuid.UUID) ([]SubcategoryWithChild, error) {
	subcategories, err := service.db.ListSubcategoriesByID(ctx, id)
	if err != nil {
		return nil, err
	}

	resp := make([]SubcategoryWithChild, 0, len(subcategories))

	for _, subcategory := range subcategories {
		subsubcategories, err := service.ListSubsubcategoriesByID(ctx, subcategory.ID)
		if err != nil {
			return nil, err
		}

		subcategoryWithChild := SubcategoryWithChild{
			Subcategory:    subcategory,
			Subsubcategory: subsubcategories,
		}

		resp = append(resp, subcategoryWithChild)
	}

	return resp, nil
}

func (service *Service) CreateSubsubcategory(ctx context.Context, category Subsubcategory) error {
	category.ID = uuid.New()

	err := service.db.CreateSubsubcategory(ctx, category)
	if err != nil {
		return err
	}

	img, err := base64.StdEncoding.DecodeString(category.Image)
	if err != nil {
		return err
	}

	return service.CreateImage(ctx, category.ID, bytes.NewBuffer(img))
}

func (service *Service) ListSubsubcategoriesByID(ctx context.Context, id uuid.UUID) ([]Subsubcategory, error) {
	return service.db.ListSubsubcategoriesByID(ctx, id)
}

func (service *Service) CreateImage(ctx context.Context, categoryID uuid.UUID, reader io.Reader) error {
	pathFromRoot := filepath.Join("categories", categoryID.String()+".png")

	return service.store.Create(ctx, pathFromRoot, reader)
}

func (service *Service) ListCategoryWithChildren(ctx context.Context) ([]CategoryWithChild, error) {
	categories, err := service.ListCategories(ctx)
	if err != nil {
		return nil, err
	}

	resp := make([]CategoryWithChild, 0, len(categories))

	for _, category := range categories {
		subcategories, err := service.ListSubcategoriesByID(ctx, category.ID)
		if err != nil {
			return nil, err
		}

		categoryWithChild := CategoryWithChild{
			Category:    category,
			Subcategory: make([]SubcategoryWithChild, 0, 100),
		}

		for _, subcategory := range subcategories {
			subsubcategories, err := service.ListSubsubcategoriesByID(ctx, subcategory.ID)
			if err != nil {
				return nil, err
			}

			subCategoryWithChild := SubcategoryWithChild{
				Subcategory:    subcategory,
				Subsubcategory: subsubcategories,
			}

			categoryWithChild.Subcategory = append(categoryWithChild.Subcategory, subCategoryWithChild)
		}

		resp = append(resp, categoryWithChild)
	}

	return resp, nil
}
