package rand_test

import (
	"testing"

	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/rand"
)

func TestRandomString(t *testing.T) {
	RegisterT(t)

	Expect(rand.String(10000)).HasLen(10000)
	Expect(rand.String(10)).HasLen(10)
	Expect(rand.String(0)).HasLen(0)
	Expect(rand.String(-1)).HasLen(0)
}
