package userauth

import (
	"context"
	"crypto/subtle"
	"errors"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"log"
	"time"

	"github.com/BoostyLabs/goauth"
	"github.com/zeebo/errs"

	"graduate_work/users"
)

const (
	// TokenExpirationTime after passing this time token expires.
	TokenExpirationTime = 24 * time.Hour
)

var (
	// ErrUnauthenticated should be returned when user performs unauthenticated action.
	ErrUnauthenticated = errs.Class("user unauthenticated error")

	// Error is a error class for internal auth errors.
	Error = errs.Class("user auth internal error")
)

// Service is handling all user authentication logic.
//
// architecture: Service
type Service struct {
	users        users.DB
	usersService *users.Service
	signer       goauth.TokenSigner
}

// NewService is a constructor for user auth service.
func NewService(users users.DB, usersService *users.Service, signer goauth.TokenSigner) *Service {
	return &Service{
		users:        users,
		usersService: usersService,
		signer:       signer,
	}
}

// Authorize validates token from context and returns claims.
func (service *Service) Authorize(ctx context.Context, tokenS string) (goauth.Claims, error) {
	token, err := goauth.FromBase64URLString(tokenS)
	if err != nil {
		return nil, Error.Wrap(err)
	}

	claims, err := service.authenticate(token)
	if err != nil {
		return nil, ErrUnauthenticated.Wrap(err)
	}

	err = service.authorize(ctx, claims)
	if err != nil {
		return nil, ErrUnauthenticated.Wrap(err)
	}

	return claims, nil
}

// authenticate validates token signature and returns authenticated claims.
func (service *Service) authenticate(token goauth.Token) (goauth.Claims, error) {
	signature := token.Signature

	err := service.signer.SignToken(&token)
	if err != nil {
		return nil, Error.Wrap(err)
	}

	if subtle.ConstantTimeCompare(signature, token.Signature) != 1 {
		return nil, Error.New("incorrect signature")
	}

	claims, err := goauth.FromJSON(token.Payload)
	if err != nil {
		return nil, Error.Wrap(err)
	}

	return *claims, nil
}

// authorize checks claims and returns authorized User.
func (service *Service) authorize(ctx context.Context, claimsMap goauth.Claims) error {
	claims, err := GetStructClaims(claimsMap)
	if err != nil {
		return ErrUnauthenticated.Wrap(err)
	}

	if !claims.ExpiresAt.IsZero() && claims.ExpiresAt.Before(time.Now()) {
		return ErrUnauthenticated.Wrap(err)
	}

	_, err = service.users.Get(ctx, claims.UserID)
	if err != nil {
		return ErrUnauthenticated.New("authorization failed. no user with wallet address: %s", claims.UserID)
	}

	return nil
}

// CheckAuthToken checks auth token.
func (service *Service) CheckAuthToken(ctx context.Context, tokenStr string) error {
	token, err := goauth.FromBase64URLString(tokenStr)
	if err != nil {
		return Error.Wrap(err)
	}
	claimsMap, err := service.authenticate(token)
	if err != nil {
		return ErrUnauthenticated.Wrap(err)
	}

	claims, err := GetStructClaims(claimsMap)
	if err != nil {
		return ErrUnauthenticated.Wrap(err)
	}

	if !claims.ExpiresAt.IsZero() && claims.ExpiresAt.Before(time.Now()) {
		return ErrUnauthenticated.Wrap(err)
	}

	_, err = service.users.Get(ctx, claims.UserID)
	if err != nil {
		return Error.Wrap(err)
	}

	return nil
}

// LoginToken authenticates user by credentials and returns login token.
func (service *Service) LoginToken(ctx context.Context, email string, password string) (token string, err error) {
	user, err := service.users.GetByEmail(ctx, email)
	if err != nil {
		return "", Error.Wrap(err)
	}

	err = bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(password))
	if err != nil {
		return "", ErrUnauthenticated.Wrap(err)
	}

	claims := Claims{
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(TokenExpirationTime),
	}

	goAuthClaims, err := GetMapClaims(claims)
	if err != nil {
		return "", Error.Wrap(err)
	}

	token, err = service.signer.CreateToken(ctx, &goAuthClaims)
	if err != nil {
		return "", Error.Wrap(err)
	}

	return token, nil
}

// Register - register a new user.
func (service *Service) Register(ctx context.Context, userToCreate users.CreateUserFields) (string, error) {
	_, err := service.users.GetByEmail(ctx, userToCreate.Email)
	if err == nil {
		return "", errors.New("email already in use")
	}

	user := users.User{
		ID:           uuid.New(),
		Email:        userToCreate.Email,
		PasswordHash: []byte(userToCreate.Password),
		Name:         userToCreate.Name,
		Surname:      userToCreate.Surname,
		PhoneNumber:  userToCreate.PhoneNumber,
		Gender:       userToCreate.Gender,
		Role:         users.RoleUser,
		DateOfBirth:  userToCreate.DateOfBirth,
		CreatedAt:    time.Now().UTC(),
	}

	err = user.EncodePass()
	if err != nil {
		return "", Error.Wrap(err)
	}

	err = service.usersService.Create(ctx, user, userToCreate.Avatar)
	if err != nil {
		return "", Error.Wrap(err)
	}

	claims := Claims{
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(TokenExpirationTime),
	}

	goAuthClaim, err := GetMapClaims(claims)
	if err != nil {
		return "", Error.Wrap(err)
	}

	token, err := service.signer.CreateToken(ctx, &goAuthClaim)

	return token, nil
}

// ChangePassword - change users password.
func (service *Service) ChangePassword(ctx context.Context, password, newPassword string) error {
	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		log.Println("руку")
		return ErrUnauthenticated.Wrap(err)
	}

	log.Println("claimsMap", claimsMap)

	claims, err := GetStructClaims(claimsMap)
	if err != nil {
		return ErrUnauthenticated.Wrap(err)
	}

	user, err := service.users.Get(ctx, claims.UserID)
	if err != nil {
		return err
	}

	err = bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(password))
	if err != nil {
		return ErrUnauthenticated.Wrap(err)
	}

	user.PasswordHash = []byte(newPassword)
	err = user.EncodePass()
	if err != nil {
		return Error.Wrap(err)
	}

	return Error.Wrap(service.users.UpdatePassword(ctx, user.ID, user.PasswordHash))
}

// ChangeEmail - change users email address.
func (service *Service) ChangeEmail(ctx context.Context, email string) error {
	claimsMap, err := goauth.GetClaims(ctx)
	if err != nil {
		return ErrUnauthenticated.Wrap(err)
	}

	claims, err := GetStructClaims(claimsMap)
	if err != nil {
		return ErrUnauthenticated.Wrap(err)
	}

	user, err := service.users.Get(ctx, claims.UserID)
	if err != nil {
		return ErrUnauthenticated.Wrap(err)
	}

	return Error.Wrap(service.users.UpdateEmail(ctx, user.ID, email))
}
