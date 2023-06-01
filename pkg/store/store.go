package store

import (
	"context"
	"errors"
	"github.com/zeebo/errs"
	"io"
	"io/ioutil"
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
	relatedPath, fileName := filepath.Split(filename)
	if fileName == "" {
		return errs.New("file name is empty")
	}

	path := filepath.Join(store.config.OutputPath, relatedPath)
	err := os.MkdirAll(path, os.ModePerm)
	if err != nil {
		return err
	}

	file, err := os.Create(filepath.Join(path, fileName))
	if err != nil {
		return err
	}

	_, err = io.Copy(file, reader)

	return errs.Combine(err, file.Close())
}

func (store *Store) Delete(ctx context.Context, filename string) error {
	outputPath := filepath.Join(store.config.OutputPath, filename)

	return ErrFileStore.Wrap(os.Remove(outputPath))
}

// Count returns count of files from local file system store.
func (store *Store) Count(ctx context.Context, relatedPath string) (int, error) {
	path := filepath.Join(store.config.OutputPath, relatedPath)
	files, err := ioutil.ReadDir(path)
	if err != nil {
		if os.IsNotExist(err) {
			return 0, errors.New("folder does not exists")
		}
		return 0, err
	}

	return len(files), nil
}

func (store *Store) Stat(ctx context.Context, relatedPath string) bool {
	path := filepath.Join(store.config.OutputPath, relatedPath)
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}
	return true
}

// DeleteFolder deletes folder from local file system store.
func (store *Store) DeleteFolder(ctx context.Context, relatedPath string) error {
	path := filepath.Join(store.config.OutputPath, relatedPath)

	if err := os.RemoveAll(path); err != nil {
		if os.IsNotExist(err) {
			return errors.New("folder does not exists")
		}
		return err
	}

	return nil
}
