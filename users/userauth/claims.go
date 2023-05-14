package userauth

import (
	"encoding/json"
	"time"

	"github.com/BoostyLabs/goauth"
	"github.com/google/uuid"
)

// Claims represents data signed by server and used for authentication.
type Claims struct {
	UserID    uuid.UUID `json:"userId"`
	ExpiresAt time.Time `json:"expiresAt"`
}

// GetStructClaims returns claims in struct from goauth.
func GetStructClaims(claimsMap goauth.Claims) (*Claims, error) {
	var claims Claims

	jsonClaims, err := json.Marshal(claimsMap)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(jsonClaims, &claims)
	if err != nil {
		return nil, err
	}

	return &claims, nil
}

// GetMapClaims returns claims in map for goauth from Claims struct.
func GetMapClaims(claims Claims) (goauth.Claims, error) {
	var goAuthClaims goauth.Claims = make(map[string]string)

	jsonClaims, err := json.Marshal(claims)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(jsonClaims, &goAuthClaims)
	if err != nil {
		return nil, err
	}

	return goAuthClaims, nil
}
