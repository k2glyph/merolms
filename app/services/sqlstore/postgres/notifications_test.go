package postgres_test

import (
	"testing"

	"github.com/k2glyph/meroedu/app/models/query"

	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/bus"
)

func TestNotificationStorage_TotalCount(t *testing.T) {
	ctx := SetupDatabaseTest(t)
	defer TeardownDatabaseTest()

	q := &query.CountUnreadNotifications{}

	err := bus.Dispatch(ctx, q)
	Expect(err).IsNil()
	Expect(q.Result).Equals(0)

	err = bus.Dispatch(demoTenantCtx, q)
	Expect(err).IsNil()
	Expect(q.Result).Equals(0)
}
