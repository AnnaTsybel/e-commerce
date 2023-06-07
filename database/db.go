package database

import (
	"context"
	"database/sql"
	_ "github.com/lib/pq" // using postgres driver.
	"github.com/zeebo/errs"
	documentize "graduate_work"
	"graduate_work/categories"
	"graduate_work/products"
	"graduate_work/users"
)

var (
	// Error is the default documentize error class.
	Error = errs.Class("db error")
)

// database combines access to different database tables with a record
// of the db driver, db implementation, and db source URL.
//
// architecture: Master Database
type database struct {
	conn *sql.DB
}

// New returns documentize.DB postgresql implementation.
func New(databaseURL string) (documentize.DB, error) {
	conn, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, Error.Wrap(err)
	}

	return &database{conn: conn}, nil
}

// CreateSchema create schema for all tables and databases.
func (db *database) CreateSchema(ctx context.Context) error {
	createTableQuery := `
	CREATE TABLE IF NOT EXISTS users(
	    id           BYTEA PRIMARY KEY               NOT NULL,
	    name         VARCHAR                         NOT NULL,
	    surname      VARCHAR                         NOT NULL,
	    phone_number VARCHAR                         NOT NULL,
	    gender VARCHAR                         NOT NULL,
	    email      VARCHAR                         NOT NULL,
	    role       INTEGER DEFAULT 0 NOT NULL,
	    password_hash    BYTEA                     NOT NULL,
	    date_of_birth TIMESTAMP WITH TIME ZONE        NOT NULL,
	    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()       NOT NULL
	);
	CREATE TABLE IF NOT EXISTS categories(
	    id         BYTEA PRIMARY KEY,
	    name    VARCHAR DEFAULT '' NOT NULL
	);
	CREATE TABLE IF NOT EXISTS subcategories(
	    id         BYTEA PRIMARY KEY,
	    category_id BYTEA REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
	    name    VARCHAR DEFAULT '' NOT NULL
	);
	CREATE TABLE IF NOT EXISTS subsubcategories(
	    id         BYTEA PRIMARY KEY,
	    subcategory_id BYTEA REFERENCES subcategories(id) ON DELETE CASCADE NOT NULL,
	    name    VARCHAR DEFAULT '' NOT NULL
	);
    CREATE TABLE IF NOT EXISTS products(
	    id           BYTEA PRIMARY KEY               NOT NULL,
	    title        VARCHAR                         NOT NULL,
	    description  VARCHAR                         NOT NULL,
	    price        numeric                         NOT NULL,
	    color        VARCHAR DEFAULT '' NOT NULL,
	    brand        VARCHAR DEFAULT '' NOT NULL,
	    subsubcategory_id BYTEA REFERENCES subsubcategories(id) ON DELETE CASCADE NOT NULL,
	    is_available BOOLEAN DEFAULT FALSE NOT NULL
	);
    CREATE TABLE IF NOT EXISTS product_likes(
	    product_id BYTEA REFERENCES products(id) ON DELETE CASCADE NOT NULL,
	    user_id    BYTEA REFERENCES users(id) ON DELETE CASCADE NOT NULL,
	    PRIMARY KEY(product_id, user_id)
	);`

	_, err := db.conn.ExecContext(ctx, createTableQuery)
	return Error.Wrap(err)
}

// Close closes underlying db connection.
func (db *database) Close() error {
	return Error.Wrap(db.conn.Close())
}

func (db *database) Users() users.DB {
	return &usersDB{conn: db.conn}
}

func (db *database) Products() products.DB {
	return &productsDB{conn: db.conn}
}

func (db *database) Categories() categories.DB {
	return &categoriesDB{conn: db.conn}
}
