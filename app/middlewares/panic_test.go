package middlewares_test

import (
	"net/http"
	"testing"

	"github.com/k2glyph/meroedu/app/middlewares"
	"github.com/k2glyph/meroedu/app/pkg/mock"
	"github.com/k2glyph/meroedu/app/pkg/web"

	. "github.com/k2glyph/meroedu/app/pkg/assert"
)

func TestCatchPanic_Success(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	server.Use(middlewares.CatchPanic())
	status, _ := server.Execute(func(c *web.Context) error {
		return c.Ok(web.Map{})
	})

	Expect(status).Equals(http.StatusOK)
}

func TestCatchPanic_Panic(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	server.Use(middlewares.CatchPanic())
	status, _ := server.Execute(func(c *web.Context) error {
		panic("Boom!")
	})

	Expect(status).Equals(http.StatusInternalServerError)
}
