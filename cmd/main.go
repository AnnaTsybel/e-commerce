package main

import (
	"context"
	"encoding/json"
	"github.com/caarlos0/env/v6"
	documentize "graduate_work"
	"graduate_work/database"
	"graduate_work/products"
	"graduate_work/users"
	//"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"
	"github.com/zeebo/errs"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	onSigInt(func() {
		// starting graceful exit on context cancellation.
		cancel()
	})

	config := new(documentize.Config)
	err := env.Parse(config)
	if err != nil {
		log.Println("could not parse env to config:", err)
		return
	}

	db, err := database.New(config.DatabaseURL)
	if err != nil {
		log.Println("Error starting master database", err)
		return
	}
	defer func() {
		err = errs.Combine(err, db.Close())
		log.Println("close db error", err)
	}()

	err = db.CreateSchema(ctx)
	if err != nil {
		log.Println("Error creating schema", err)
		return
	}

	app, err := documentize.New(config, db)
	if err != nil {
		log.Println("could not initialize app:", err)
		return
	}

	seed(ctx, db)

	err = errs.Combine(app.Run(ctx), app.Close())
	log.Println(err)
}

// OnSigInt fires in SIGINT or SIGTERM event (usually CTRL+C).
func onSigInt(onSigInt func()) {
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-done
		onSigInt()
	}()
}

func seed(ctx context.Context, db documentize.DB) error {
	usersFile, err := os.ReadFile("./cmd/testData/users.json")
	if err != nil {
		log.Println("AAAA", err)
		return err
	}

	testUsers := make([]users.User, 0, 10)

	err = json.Unmarshal(usersFile, &testUsers)
	if err != nil {
		log.Println("BBB", err)
		return err
	}

	dir, err := os.Getwd()
	if err != nil {
		log.Println("CCC", err)
		return err
	}

	log.Println(dir)

	productsFile, err := os.ReadFile("./cmd/testData/products.json")
	if err != nil {
		log.Println("AAAA111", err)
		return err
	}

	testProducts := make([]products.Product, 0, 10)

	err = json.Unmarshal(productsFile, &testProducts)
	if err != nil {
		log.Println("BBB111", err)
		return err
	}

	for _, user := range testUsers {
		user.PasswordHash = []byte(user.Password)
		err = user.EncodePass()
		if err != nil {
			log.Println("encode err", user)
		}

		err = db.Users().Create(ctx, user)
		log.Println("err users creation", err)
	}

	for _, product := range testProducts {
		err = db.Products().Create(ctx, product)
		log.Println("err products creation", err)
	}

	return nil
}
