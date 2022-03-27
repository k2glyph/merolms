package cmd

import (
	"context"

	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/dbx"
	"github.com/k2glyph/meroedu/app/pkg/log"
	"github.com/k2glyph/meroedu/app/pkg/rand"
	_ "github.com/k2glyph/meroedu/app/services/log/console"
)

// RunMigrate run all pending migrations on current DATABASE_URL
// Returns an exitcode, 0 for OK and 1 for ERROR
func RunMigrate() int {
	bus.Init()

	ctx := log.WithProperties(context.Background(), dto.Props{
		log.PropertyKeyTag:       "MIGRATE",
		log.PropertyKeyContextID: rand.String(32),
	})

	err := dbx.Migrate(ctx, "/migrations")
	if err != nil {
		log.Error(ctx, err)
		return 1
	}
	return 0
}
