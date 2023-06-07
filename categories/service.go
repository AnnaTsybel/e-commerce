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
