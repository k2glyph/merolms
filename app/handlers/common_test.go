package handlers_test

import (
	"io/ioutil"
	"net/http"
	"testing"

	"github.com/k2glyph/meroedu/app/handlers"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/mock"
)

func TestHealthHandler(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	code, _ := server.
		Execute(handlers.Health())

	Expect(code).Equals(http.StatusOK)
}

func TestPageHandler(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	code, _ := server.
		Execute(handlers.Page("The Title", "The Description", "TheChunk.Page"))

	Expect(code).Equals(http.StatusOK)
}

func TestLegalPageHandler(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	code, _ := server.
		Execute(handlers.LegalPage("Terms of Service", "terms.md"))

	Expect(code).Equals(http.StatusOK)
}

func TestLegalPageHandler_Invalid(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	code, _ := server.
		Execute(handlers.LegalPage("Some Page", "somepage.md"))

	Expect(code).Equals(http.StatusNotFound)
}

func TestRobotsTXT(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	code, response := server.
		WithURL("https://demo.test.meroedu.io/robots.txt").
		Execute(handlers.RobotsTXT())
	content, _ := ioutil.ReadAll(response.Body)
	Expect(code).Equals(http.StatusOK)
	Expect(string(content)).Equals(`User-agent: *
Disallow: /_api/
Disallow: /api/v1/
Disallow: /admin/
Disallow: /oauth/
Disallow: /terms
Disallow: /privacy
Disallow: /_design
Sitemap: https://demo.test.meroedu.io/sitemap.xml`)
}

func TestSitemap(t *testing.T) {
	RegisterT(t)

	// bus.AddHandler(func(ctx context.Context, q *query.GetAllPosts) error {
	// 	q.Result = []*entity.Post{}
	// 	return nil
	// })

	server := mock.NewServer()
	code, response := server.
		OnTenant(mock.DemoTenant).
		WithURL("http://demo.test.meroedu.io:3000/sitemap.xml").
		Execute(handlers.Sitemap())

	bytes, _ := ioutil.ReadAll(response.Body)
	Expect(code).Equals(http.StatusOK)
	Expect(string(bytes)).Equals(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url> <loc>http://demo.test.meroedu.io:3000</loc> </url></urlset>`)
}

func TestSitemap_PrivateTenant_WithPosts(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()

	mock.DemoTenant.IsPrivate = true

	code, _ := server.
		OnTenant(mock.DemoTenant).
		WithURL("http://demo.test.meroedu.io:3000/sitemap.xml").
		Execute(handlers.Sitemap())

	Expect(code).Equals(http.StatusNotFound)
}
