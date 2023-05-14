package store

import (
	"context"
	"github.com/zeebo/errs"
	"io"
	"os"
	"path/filepath"
)

// ErrFileStore indicates that there was an error in the file store.
var ErrFileStore = errs.Class("FileStore repository error")

// Config defines configurable variables of Store.
type Config struct {
	OutputPath string `json:"outputPath"`
}

// Store describes layer storage in file system.
type Store struct {
	config Config
}

// NewStore is constructor for file system store.
func NewStore(cfg Config) *Store {
	return &Store{
		config: cfg,
	}
}

// MakeDirectory creates directory in the file system by specific path.
func (store *Store) MakeDirectory(ctx context.Context, path string) error {
	outputPath := filepath.Join(store.config.OutputPath, path)

	return ErrFileStore.Wrap(os.MkdirAll(outputPath, os.ModePerm))
}

func (store *Store) Create(ctx context.Context, filename string, reader io.Reader) error {
	err := os.MkdirAll(filepath.Join(store.config.OutputPath, filename), os.ModePerm)
	if err != nil {
		return ErrFileStore.Wrap(err)
	}

	file, err := os.Create(filepath.Join(store.config.OutputPath, filename))
	if err != nil {
		return ErrFileStore.Wrap(err)
	}

	defer func() {
		err = ErrFileStore.Wrap(file.Close())
	}()

	_, err = io.Copy(file, reader)

	return ErrFileStore.Wrap(err)
}

func (store *Store) Delete(ctx context.Context, filename string, reader io.Reader) error {
	outputPath := filepath.Join(store.config.OutputPath, filename)

	return ErrFileStore.Wrap(os.Remove(outputPath))
}
