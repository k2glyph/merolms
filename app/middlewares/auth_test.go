package middlewares_test

import (
	"net/http"
	"testing"

	"github.com/k2glyph/meroedu/app/middlewares"
	"github.com/k2glyph/meroedu/app/models/enum"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/mock"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

func TestIsAuthorized_WithAllowedRole(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	server.Use(middlewares.IsAuthorized(enum.RoleAdministrator, enum.RoleCollaborator))
	status, _ := server.AsUser(mock.JonSnow).Execute(func(c *web.Context) error {
		return c.NoContent(http.StatusOK)
	})

	Expect(status).Equals(http.StatusOK)
}

func TestIsAuthorized_WithForbiddenRole(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	server.Use(middlewares.IsAuthorized(enum.RoleAdministrator, enum.RoleCollaborator))
	status, _ := server.AsUser(mock.AryaStark).Execute(func(c *web.Context) error {
		return c.NoContent(http.StatusOK)
	})

	Expect(status).Equals(http.StatusForbidden)
}

func TestIsAuthenticated_WithUser(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	server.Use(middlewares.IsAuthenticated())
	status, _ := server.AsUser(mock.AryaStark).Execute(func(c *web.Context) error {
		return c.NoContent(http.StatusOK)
	})

	Expect(status).Equals(http.StatusOK)
}

func TestIsAuthenticated_WithoutUser(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	server.Use(middlewares.IsAuthenticated())

	status, _ := server.Execute(func(c *web.Context) error {
		return c.NoContent(http.StatusOK)
	})

	Expect(status).Equals(http.StatusUnauthorized)
}
