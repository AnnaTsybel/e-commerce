package database

import (
	"context"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"github.com/zeebo/errs"
	"graduate_work/products"
)

var _ products.DB = (*productsDB)(nil)

type productsDB struct {
	conn *sql.DB
}

func (productsDB *productsDB) Create(ctx context.Context, product products.Product) error {
	query := `INSERT INTO products(
                  id, 
                  title, 
                  description,
                  price,
                  color,
                  brand,
                  is_available
               ) VALUES (
                   $1,
                   $2,
                   $3,
                   $4,
                   $5,
                   $6,
                   $7
               )`

	_, err := productsDB.conn.ExecContext(ctx, query,
		product.ID, product.Title, product.Description, product.Price, product.Color, product.Brand, product.IsAvailable)
	return err
}

func (productsDB *productsDB) Get(ctx context.Context, id uuid.UUID) (products.Product, error) {
	query := `SELECT id, title, description, price, color, brand, is_available
	          FROM products
	          WHERE id = $1`

	var product products.Product
	err := productsDB.conn.QueryRowContext(ctx, query, id).Scan(
		&product.ID, &product.Title, &product.Description, &product.Price, &product.Color, &product.Brand, &product.IsAvailable)
	return product, err
}

func (productsDB *productsDB) List(ctx context.Context) ([]products.Product, error) {
	rows, err := productsDB.conn.QueryContext(ctx, "SELECT id, title, description, price, color, brand, is_available FROM products")
	if err != nil {
		return nil, err
	}

	defer func() {
		err = errs.Combine(err, rows.Close())
	}()

	var data []products.Product
	for rows.Next() {
		var product products.Product
		err = rows.Scan(&product.ID, &product.Title, &product.Description, &product.Price, &product.Color, &product.Brand, &product.IsAvailable)
		if err != nil {
			return nil, err
		}

		data = append(data, product)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return data, nil
}

func (productsDB *productsDB) Update(ctx context.Context, product products.Product) error {
	result, err := productsDB.conn.ExecContext(
		ctx,
		"UPDATE products SET id=$1, title=$2, description=$3, price=$4, is_available=$5, color=$6, brand=$7 WHERE id=$8",
		product.ID, product.Title, product.Description, product.Price, product.IsAvailable, product.Color, product.Brand, product.ID)
	if err != nil {
		return err
	}

	rowNum, err := result.RowsAffected()
	if rowNum == 0 {
		return errors.New("product does not exist")
	}

	return err
}

func (productsDB *productsDB) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM products 
	          WHERE id = $1`

	result, err := productsDB.conn.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowNum, err := result.RowsAffected()
	if err == nil && rowNum == 0 {
		return errors.New("admin does not exist")
	}

	return err
}

func (productsDB *productsDB) LikeProduct(ctx context.Context, productID, userID uuid.UUID) error {
	query := `INSERT INTO product_likes(
                  product_id, 
                  user_id
               ) VALUES (
                   $1,
                   $2
               )`

	_, err := productsDB.conn.ExecContext(ctx, query,
		productID, userID)
	return err
}

func (productsDB *productsDB) UnlikeProduct(ctx context.Context, productID, userID uuid.UUID) error {
	query := `DELETE FROM product_likes 
	          WHERE product_id = $1 AND user_id = $2`

	result, err := productsDB.conn.ExecContext(ctx, query, productID, userID)
	if err != nil {
		return err
	}

	rowNum, err := result.RowsAffected()
	if err == nil && rowNum == 0 {
		return errors.New("user does not like product")
	}

	return err
}

func (productsDB *productsDB) GetLikedUserProduct(ctx context.Context, productID, userID uuid.UUID) (bool, error) {
	query := `SELECT 1
	          FROM product_likes
	          WHERE product_id = $1 AND user_id = $2`

	var isLiked bool
	err := productsDB.conn.QueryRowContext(ctx, query, productID, userID).Scan(&isLiked)
	if err != nil {
		return false, err
	}
	return true, err
}

func (productsDB *productsDB) ListLikedProducts(ctx context.Context, userID uuid.UUID) ([]uuid.UUID, error) {
	query := `SELECT product_id
	          FROM product_likes
	          WHERE user_id = $1`

	rows, err := productsDB.conn.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}

	defer func() {
		err = errs.Combine(err, rows.Close())
	}()

	var data []uuid.UUID
	for rows.Next() {
		var productID uuid.UUID
		err = rows.Scan(&productID)
		if err != nil {
			return nil, err
		}

		data = append(data, productID)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return data, nil
}

func (productsDB *productsDB) ListLikedProductsByUsers(ctx context.Context, userID uuid.UUID) ([]uuid.UUID, error) {
	query := `SELECT product_id
	          FROM product_likes
	          WHERE user_id = $1`

	rows, err := productsDB.conn.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}

	defer func() {
		err = errs.Combine(err, rows.Close())
	}()

	var data []uuid.UUID
	for rows.Next() {
		var productID uuid.UUID
		err = rows.Scan(&productID)
		if err != nil {
			return nil, err
		}

		data = append(data, productID)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return data, nil
}
