package cmd

import (
	"testing"

	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

func TestGetMainEngine(t *testing.T) {
	RegisterT(t)

	r := routes(web.New())
	Expect(r).IsNotNil()
}
