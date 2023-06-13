package database

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
	"github.com/zeebo/errs"
	"graduate_work/categories"
)

var _ categories.DB = (*categoriesDB)(nil)

type categoriesDB struct {
	conn *sql.DB
}

func (categoriesDB *categoriesDB) CreateCategory(ctx context.Context, category categories.Category) error {
	query := `INSERT INTO categories(
                  id, 
                  name 
               ) VALUES (
                   $1,
                   $2
               )`

	_, err := categoriesDB.conn.ExecContext(ctx, query, category.ID, category.Name)
	return err
}

func (categoriesDB *categoriesDB) ListCategories(ctx context.Context) ([]categories.Category, error) {
	rows, err := categoriesDB.conn.QueryContext(ctx, "SELECT id, name FROM categories")
	if err != nil {
		return nil, err
	}

	defer func() {
		err = errs.Combine(err, rows.Close())
	}()

	var data []categories.Category
	for rows.Next() {
		var category categories.Category
		err = rows.Scan(&category.ID, &category.Name)
		if err != nil {
			return nil, err
		}

		data = append(data, category)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return data, nil

}

func (categoriesDB *categoriesDB) CreateSubcategory(ctx context.Context, category categories.Subcategory) error {
	query := `INSERT INTO subcategories(
                  id, 
                  name,
                  category_id
               ) VALUES (
                   $1,
                   $2,
                   $3
               )`

	_, err := categoriesDB.conn.ExecContext(ctx, query, category.ID, category.Name, category.CategoryID)
	return err

}

func (categoriesDB *categoriesDB) ListSubcategoriesByID(ctx context.Context, id uuid.UUID) ([]categories.Subcategory, error) {
	rows, err := categoriesDB.conn.QueryContext(ctx, "SELECT id, name, category_id FROM subcategories WHERE category_id = $1", id)
	if err != nil {
		return nil, err
	}

	defer func() {
		err = errs.Combine(err, rows.Close())
	}()

	var data []categories.Subcategory
	for rows.Next() {
		var category categories.Subcategory
		err = rows.Scan(&category.ID, &category.Name, &category.CategoryID)
		if err != nil {
			return nil, err
		}

		data = append(data, category)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return data, nil
}

func (categoriesDB *categoriesDB) ListSubSubcategories(ctx context.Context) ([]categories.Subsubcategory, error) {
	rows, err := categoriesDB.conn.QueryContext(ctx, "SELECT id, name, subcategory_id FROM subsubcategories")
	if err != nil {
		return nil, err
	}

	defer func() {
		err = errs.Combine(err, rows.Close())
	}()

	var data []categories.Subsubcategory
	for rows.Next() {
		var category categories.Subsubcategory
		err = rows.Scan(&category.ID, &category.Name, &category.SubcategoryID)
		if err != nil {
			return nil, err
		}

		data = append(data, category)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return data, nil
}

func (categoriesDB *categoriesDB) CreateSubsubcategory(ctx context.Context, category categories.Subsubcategory) error {
	query := `INSERT INTO subsubcategories(
                  id, 
                  name,
                  subcategory_id
               ) VALUES (
                   $1,
                   $2,
                   $3
               )`

	_, err := categoriesDB.conn.ExecContext(ctx, query, category.ID, category.Name, category.SubcategoryID)
	return err
}

func (categoriesDB *categoriesDB) ListSubsubcategoriesByID(ctx context.Context, id uuid.UUID) ([]categories.Subsubcategory, error) {
	rows, err := categoriesDB.conn.QueryContext(ctx, "SELECT id, name, subcategory_id FROM subsubcategories WHERE subcategory_id = $1", id)
	if err != nil {
		return nil, err
	}

	defer func() {
		err = errs.Combine(err, rows.Close())
	}()

	var data []categories.Subsubcategory
	for rows.Next() {
		var category categories.Subsubcategory
		err = rows.Scan(&category.ID, &category.Name, &category.SubcategoryID)
		if err != nil {
			return nil, err
		}

		data = append(data, category)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return data, nil

}
