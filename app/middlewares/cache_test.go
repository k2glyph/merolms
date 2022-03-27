package middlewares_test

import (
	"net/http"
	"testing"
	"time"

	"github.com/k2glyph/meroedu/app/middlewares"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/mock"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

func TestCache_StatusOK(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	server.Use(middlewares.ClientCache(5 * time.Minute))
	handler := func(c *web.Context) error {
		return c.NoContent(http.StatusOK)
	}

	status, response := server.Execute(handler)

	Expect(status).Equals(http.StatusOK)
	Expect(response.Header().Get("Cache-Control")).Equals("public, max-age=300")
}

func TestCache_StatusNotFound(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	server.Use(middlewares.ClientCache(5 * time.Minute))
	handler := func(c *web.Context) error {
		return c.NotFound()
	}

	status, response := server.Execute(handler)

	Expect(status).Equals(http.StatusNotFound)
	Expect(response.Header().Get("Cache-Control")).Equals("no-cache, no-store")
}
