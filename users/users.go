package users

import (
	"context"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type DB interface {
	Create(ctx context.Context, user User) error
	Get(ctx context.Context, id uuid.UUID) (User, error)
	GetByEmail(ctx context.Context, email string) (User, error)
	UpdatePassword(ctx context.Context, id uuid.UUID, password []byte) error
	UpdateEmail(ctx context.Context, id uuid.UUID, newEmail string) error
	UpdateUser(ctx context.Context, id uuid.UUID, user CreateUserFields) error
	SearchSimilarUsers(ctx context.Context, id uuid.UUID, dataOfBirthFrom time.Time, dataOfBirthTo time.Time, gender string) ([]User, error)
}

type Role int

const (
	RoleUser  Role = 0
	RoleAdmin Role = 1
)

type User struct {
	ID             uuid.UUID `json:"id"`
	Name           string    `json:"name"`
	Surname        string    `json:"surname"`
	PhoneNumber    string    `json:"phoneNumber"`
	Gender         string    `json:"gender"`
	Email          string    `json:"email"`
	Password       string    `json:"password,omitempty"`
	PasswordHash   []byte    `json:"passwordHash"`
	Role           Role      `json:"role"`
	DateOfBirth    time.Time `json:"dateOfBirth"`
	CreatedAt      time.Time `json:"createdAt"`
	IsAvatarExists bool      `json:"isAvatarExists"`
}

// EncodePass encode the password and generate "hash" to store from users password.
func (user *User) EncodePass() error {
	hash, err := bcrypt.GenerateFromPassword(user.PasswordHash, bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.PasswordHash = hash
	return nil
}

// CreateUserFields for crete user.
type CreateUserFields struct {
	Email       string    `json:"email"`
	Password    string    `json:"password"`
	Name        string    `json:"name"`
	Surname     string    `json:"surname"`
	PhoneNumber string    `json:"phoneNumber"`
	Gender      string    `json:"gender"`
	DateOfBirth time.Time `json:"dateOfBirth"`
	Avatar      string    `json:"avatar"`
}

// Password for old/new passwords.
type Password struct {
	Password    string `json:"password"`
	NewPassword string `json:"newPassword"`
}

// Email for old/new passwords.
type Email struct {
	Email string `json:"email"`
}
