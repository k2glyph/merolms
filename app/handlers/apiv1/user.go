package apiv1

import (
	"github.com/k2glyph/meroedu/app"
	"github.com/k2glyph/meroedu/app/actions"
	"github.com/k2glyph/meroedu/app/models/cmd"
	"github.com/k2glyph/meroedu/app/models/entity"
	"github.com/k2glyph/meroedu/app/models/enum"
	"github.com/k2glyph/meroedu/app/models/query"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/errors"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

// ListUsers returns all registered users
func ListUsers() web.HandlerFunc {
	return func(c *web.Context) error {
		allUsers := &query.GetAllUsers{}
		if err := bus.Dispatch(c, allUsers); err != nil {
			return c.Failure(err)
		}
		return c.Ok(allUsers.Result)
	}
}

// CreateUser is used to create new users
func CreateUser() web.HandlerFunc {
	return func(c *web.Context) error {
		action := new(actions.CreateUser)
		if result := c.BindTo(action); !result.Ok {
			return c.HandleValidation(result)
		}

		var user *entity.User

		getByReference := &query.GetUserByProvider{Provider: "reference", UID: action.Reference}
		err := bus.Dispatch(c, getByReference)
		user = getByReference.Result

		if err != nil && errors.Cause(err) == app.ErrNotFound {
			if action.Email != "" {
				getByEmail := &query.GetUserByEmail{Email: action.Email}
				err = bus.Dispatch(c, getByEmail)
				user = getByEmail.Result
			}
			if err != nil && errors.Cause(err) == app.ErrNotFound {
				user = &entity.User{
					Tenant: c.Tenant(),
					Name:   action.Name,
					Email:  action.Email,
					Role:   enum.RoleLearner,
				}
				err = bus.Dispatch(c, &cmd.RegisterUser{User: user})
			}
		}

		if err != nil {
			return c.Failure(err)
		}

		if action.Reference != "" && !user.HasProvider("reference") {
			if err := bus.Dispatch(c, &cmd.RegisterUserProvider{
				UserID:       user.ID,
				ProviderName: "reference",
				ProviderUID:  action.Reference,
			}); err != nil {
				return c.Failure(err)
			}
		}

		return c.Ok(web.Map{
			"id": user.ID,
		})
	}
}
