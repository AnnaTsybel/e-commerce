package users

import (
	"bytes"
	"context"
	"encoding/base64"
	"github.com/google/uuid"
	"graduate_work/pkg/store"
	"io"
	"path/filepath"
	"time"
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

func (service *Service) Create(ctx context.Context, user User, avatar string) error {
	return service.db.Create(ctx, user)
}

func (service *Service) Get(ctx context.Context, id uuid.UUID) (User, error) {
	user, err := service.db.Get(ctx, id)
	if err != nil {
		return User{}, err
	}

	relatedPath := filepath.Join("users", user.ID.String())
	user.IsAvatarExists = service.store.Stat(ctx, relatedPath)
	return user, err
}

func (service *Service) CreateAvatar(ctx context.Context, userID uuid.UUID, reader io.Reader) error {
	pathFromRoot := filepath.Join("users", userID.String()+".png")

	return service.store.Create(ctx, pathFromRoot, reader)
}

func (service *Service) DeleteAvatar(ctx context.Context, userID uuid.UUID) error {
	pathFromRoot := filepath.Join("users", userID.String()+".png")

	return service.store.Delete(ctx, pathFromRoot)
}

func (service *Service) UpdateUser(ctx context.Context, id uuid.UUID, updatedUser CreateUserFields) error {
	err := service.db.UpdateUser(ctx, id, updatedUser)
	if err != nil {
		return err
	}

	_ = service.DeleteAvatar(ctx, id)

	img, err := base64.StdEncoding.DecodeString(updatedUser.Avatar)
	if err != nil {
		return err
	}

	return service.CreateAvatar(ctx, id, bytes.NewBuffer(img))
}

func (service *Service) SearchSimilarUsers(ctx context.Context, id uuid.UUID) ([]User, error) {
	user, err := service.db.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	year, month, day := user.DateOfBirth.Date()
	from := time.Date(year-5, month, day, 0, 0, 0, 0, time.UTC)
	to := time.Date(year+5, month, day, 0, 0, 0, 0, time.UTC)

	return service.db.SearchSimilarUsers(ctx, from, to, user.Gender)
}
