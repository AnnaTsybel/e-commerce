package users

import (
	"context"
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

func (service *Service) Create(ctx context.Context, user User) error {
	return service.db.Create(ctx, user)
}

func (service *Service) Get(ctx context.Context, id uuid.UUID) (User, error) {
	return service.db.Get(ctx, id)
}

func (service *Service) CreateAvatar(ctx context.Context, userID uuid.UUID, reader io.Reader) error {
	pathFromRoot := filepath.Join("users", userID.String()+".png")

	return service.store.Create(ctx, pathFromRoot, reader)
}

func (service *Service) DeleteAvatar(ctx context.Context, userID uuid.UUID, reader io.Reader) error {
	pathFromRoot := filepath.Join("users", userID.String()+".png")

	return service.store.Delete(ctx, pathFromRoot, reader)
}

func (service *Service) UpdateUser(ctx context.Context, id uuid.UUID, updatedUser CreateUserFields) error {
	return service.db.UpdateUser(ctx, id, updatedUser)
}
