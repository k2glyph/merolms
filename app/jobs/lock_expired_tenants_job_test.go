package jobs_test

import (
	"context"
	"testing"

	"github.com/k2glyph/meroedu/app/jobs"
	"github.com/k2glyph/meroedu/app/models/cmd"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/bus"
)

func TestLockExpiredTenantsJob_Schedule_IsCorrect(t *testing.T) {
	RegisterT(t)

	job := &jobs.LockExpiredTenantsJobHandler{}
	Expect(job.Schedule()).Equals("0 0 0 * * *")
}

func TestLockExpiredTenantsJob_ShouldJustDispatchCommand(t *testing.T) {
	RegisterT(t)

	bus.AddHandler(func(ctx context.Context, c *cmd.LockExpiredTenants) error {
		return nil
	})

	job := &jobs.LockExpiredTenantsJobHandler{}
	err := job.Run(jobs.Context{
		Context: context.Background(),
	})
	Expect(err).IsNil()
}
