package middlewares

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/k2glyph/meroedu/app/models/entity"
	"github.com/k2glyph/meroedu/app/models/enum"
	"github.com/k2glyph/meroedu/app/models/query"
	"github.com/k2glyph/meroedu/app/pkg/bus"

	"github.com/k2glyph/meroedu/app/pkg/validate"

	"github.com/k2glyph/meroedu/app"
	"github.com/k2glyph/meroedu/app/pkg/errors"
	"github.com/k2glyph/meroedu/app/pkg/jwt"
	"github.com/k2glyph/meroedu/app/pkg/web"
	webutil "github.com/k2glyph/meroedu/app/pkg/web/util"
)

// User gets JWT Auth token from cookie and insert into context
func User() web.MiddlewareFunc {
	return func(next web.HandlerFunc) web.HandlerFunc {
		return func(c *web.Context) error {
			var (
				token string
				user  *entity.User
			)

			cookie, err := c.Request.Cookie(web.CookieAuthName)
			if err == nil {
				token = cookie.Value
			} else {
				token = webutil.GetSignUpAuthCookie(c)
				if token != "" {
					webutil.AddAuthTokenCookie(c, token)
				}
			}

			if token != "" {
				claims, err := jwt.DecodeMeroeduClaims(token)
				if err != nil {
					c.RemoveCookie(web.CookieAuthName)
					return next(c)
				}

				userByClaimsID := &query.GetUserByID{UserID: claims.UserID}
				err = bus.Dispatch(c, userByClaimsID)
				user = userByClaimsID.Result
				if err != nil {
					if errors.Cause(err) == app.ErrNotFound {
						c.RemoveCookie(web.CookieAuthName)
						return next(c)
					}
					return err
				}
			} else if c.Request.IsAPI() {
				authHeader := c.Request.GetHeader("Authorization")
				parts := strings.Split(authHeader, "Bearer")
				if len(parts) == 2 {
					apiKey := strings.TrimSpace(parts[1])
					getUserByAPIKey := &query.GetUserByAPIKey{APIKey: apiKey}
					err = bus.Dispatch(c, getUserByAPIKey)
					if err != nil {
						if errors.Cause(err) == app.ErrNotFound {
							return c.HandleValidation(validate.Failed("API Key is invalid"))
						}
						return err
					}
					user = getUserByAPIKey.Result

					if !user.IsCollaborator() {
						return c.HandleValidation(validate.Failed("API Key is invalid"))
					}

					if impersonateUserIDStr := c.Request.GetHeader("X-Meroedu-UserID"); impersonateUserIDStr != "" {
						if !user.IsAdministrator() {
							return c.HandleValidation(validate.Failed("Only Administrators are allowed to impersonate another user"))
						}
						impersonateUserID, err := strconv.Atoi(impersonateUserIDStr)
						if err != nil {
							return c.HandleValidation(validate.Failed(fmt.Sprintf("User not found for given impersonate UserID '%s'", impersonateUserIDStr)))
						}
						userByImpersonateID := &query.GetUserByID{UserID: impersonateUserID}
						err = bus.Dispatch(c, userByImpersonateID)
						user = userByImpersonateID.Result
						if err != nil {
							if errors.Cause(err) == app.ErrNotFound {
								return c.HandleValidation(validate.Failed(fmt.Sprintf("User not found for given impersonate UserID '%s'", impersonateUserIDStr)))
							}
							return err
						}
					}
				}
			}

			if user != nil && c.Tenant() != nil && user.Tenant.ID == c.Tenant().ID {
				// blocked users are unable to sign in
				if user.Status == enum.UserBlocked {
					c.RemoveCookie(web.CookieAuthName)
					return c.Unauthorized()
				}

				c.SetUser(user)
			}

			return next(c)
		}
	}
}
