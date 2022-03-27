package tpl_test

import (
	"bytes"
	"context"
	"testing"

	"github.com/k2glyph/meroedu/app/models/dto"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/tpl"
)

func TestGetTemplate_Render(t *testing.T) {
	RegisterT(t)

	bf := new(bytes.Buffer)
	tmpl := tpl.GetTemplate("app/pkg/tpl/testdata/base.html", "app/pkg/tpl/testdata/echo.html")
	err := tpl.Render(context.Background(), tmpl, bf, dto.Props{
		"name": "John",
	})

	Expect(err).IsNil()
	Expect(bf.String()).Equals(`<html>
  <head>This goes on the head.</head>
  <body>
  Hello, John!
</body>
</html>`)
}
