package postgres

import (
	"context"
	"database/sql"
	"time"

	"github.com/k2glyph/meroedu/app/models/cmd"
	"github.com/k2glyph/meroedu/app/models/entity"
	"github.com/k2glyph/meroedu/app/pkg/dbx"
	"github.com/k2glyph/meroedu/app/pkg/errors"
)

func storeEvent(ctx context.Context, c *cmd.StoreEvent) error {
	return using(ctx, func(trx *dbx.Trx, tenant *entity.Tenant, user *entity.User) error {
		dbClientIP := sql.NullString{
			String: c.ClientIP,
			Valid:  len(c.ClientIP) > 0,
		}

		_, err := trx.Execute(`
			INSERT INTO events (tenant_id, client_ip, name, created_at) 
			VALUES ($1, $2, $3, $4)
			RETURNING id
		`, tenant.ID, dbClientIP, c.EventName, time.Now())
		if err != nil {
			return errors.Wrap(err, "failed to insert event")
		}
		return nil
	})
}
