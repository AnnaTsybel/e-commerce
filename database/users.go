package database

import (
	"context"
	"database/sql"
	"errors"
	"github.com/zeebo/errs"
	"time"

	"github.com/google/uuid"

	"graduate_work/users"
)

var _ users.DB = (*usersDB)(nil)

type usersDB struct {
	conn *sql.DB
}

func (usersDB *usersDB) Create(ctx context.Context, user users.User) error {
	query := `INSERT INTO users(
                  id, 
                  name, 
                  surname,
                  phone_number,
                  gender,
                  email,
                  date_of_birth,
                  password_hash,
                  created_at
               ) VALUES (
                   $1,
                   $2,
                   $3,
                   $4,
                   $5,
                   $6,
                   $7,
                   $8,
                   $9
               )`

	_, err := usersDB.conn.ExecContext(ctx, query,
		user.ID, user.Name, user.Surname, user.PhoneNumber, user.Gender, user.Email, user.DateOfBirth, user.PasswordHash, user.CreatedAt)
	return err
}

func (usersDB *usersDB) Get(ctx context.Context, id uuid.UUID) (users.User, error) {
	query := `SELECT id, name, surname, phone_number, gender, email, date_of_birth, password_hash, role, created_at
	          FROM users
	          WHERE id = $1`

	var user users.User
	err := usersDB.conn.QueryRowContext(ctx, query, id).Scan(&user.ID, &user.Name, &user.Surname, &user.PhoneNumber, &user.Gender, &user.Email, &user.DateOfBirth, &user.PasswordHash, &user.Role, &user.CreatedAt)
	return user, err
}

func (usersDB *usersDB) GetByEmail(ctx context.Context, email string) (users.User, error) {
	query := `SELECT id, name, surname, phone_number, gender, email, date_of_birth, password_hash, role, created_at
	          FROM users
	          WHERE email = $1`

	var user users.User
	err := usersDB.conn.QueryRowContext(ctx, query, email).Scan(&user.ID, &user.Name, &user.Surname, &user.PhoneNumber, &user.Gender, &user.Email, &user.DateOfBirth, &user.PasswordHash, &user.Role, &user.CreatedAt)
	return user, err
}

func (usersDB *usersDB) UpdatePassword(ctx context.Context, id uuid.UUID, password []byte) error {
	result, err := usersDB.conn.ExecContext(ctx, "UPDATE users SET password_hash=$1 WHERE id=$2", password, id)
	if err != nil {
		return err
	}

	rowNum, err := result.RowsAffected()
	if rowNum == 0 {
		return errors.New("user does not exist")
	}

	return err
}

// UpdateEmail updates an email address in the database.
func (usersDB *usersDB) UpdateEmail(ctx context.Context, id uuid.UUID, newEmail string) error {
	result, err := usersDB.conn.ExecContext(ctx, "UPDATE users SET email=$1 WHERE id=$2", newEmail, id)
	if err != nil {
		return err
	}

	rowNum, err := result.RowsAffected()
	if rowNum == 0 {
		return errors.New("user does not exist")
	}

	return err
}

// UpdateUser updates user in the database.
func (usersDB *usersDB) UpdateUser(ctx context.Context, id uuid.UUID, user users.CreateUserFields) error {
	result, err := usersDB.conn.ExecContext(
		ctx,
		"UPDATE users SET name=$1, surname=$3, phone_number=$4, gender=$5, email=$6, date_of_birth=$7 WHERE id=$2",
		user.Name, id, user.Surname, user.PhoneNumber, user.Gender, user.Email, user.DateOfBirth)
	if err != nil {
		return err
	}

	rowNum, err := result.RowsAffected()
	if rowNum == 0 {
		return errors.New("user does not exist")
	}

	return err
}

func (usersDB *usersDB) SearchSimilarUsers(ctx context.Context, id uuid.UUID, dataOfBirthFrom time.Time, dataOfBirthTo time.Time, gender string) ([]users.User, error) {
	query := `SELECT id, name, surname, phone_number, gender, email, date_of_birth, password_hash, role, created_at 
	          FROM users
	          WHERE date_of_birth > $1 AND date_of_birth < $2 AND gender = $3 AND id != $4`
	rows, err := usersDB.conn.QueryContext(ctx, query, dataOfBirthFrom, dataOfBirthTo, gender, id)
	if err != nil {
		return nil, err
	}

	defer func() {
		err = errs.Combine(err, rows.Close())
	}()

	var data []users.User
	for rows.Next() {
		var user users.User
		err = rows.Scan(&user.ID, &user.Name, &user.Surname, &user.PhoneNumber, &user.Gender, &user.Email, &user.DateOfBirth, &user.PasswordHash, &user.Role, &user.CreatedAt)
		if err != nil {
			return nil, err
		}

		data = append(data, user)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return data, nil
}
