package middlewares

import (
	"github.com/k2glyph/meroedu/app/pkg/errors"
	"github.com/k2glyph/meroedu/app/pkg/log"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

func CatchPanic() web.MiddlewareFunc {
	return func(next web.HandlerFunc) web.HandlerFunc {
		return func(c *web.Context) error {
			defer func() {
				if r := recover(); r != nil {
					err := c.Failure(errors.Panicked(r))
					log.Error(c, err)
					c.Rollback()
				}
			}()

			return next(c)
		}
	}
}
