package jobs_test

import (
	"context"
	"testing"

	"github.com/k2glyph/meroedu/app/jobs"
	"github.com/k2glyph/meroedu/app/models/cmd"
	"github.com/k2glyph/meroedu/app/models/query"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/bus"
)

func TestEmailSupressionJob_Schedule_IsCorrect(t *testing.T) {
	RegisterT(t)

	job := &jobs.EmailSupressionJobHandler{}
	Expect(job.Schedule()).Equals("0 5 * * * *")
}

func TestEmailSupressionJob_ShouldSupressRecentFailures(t *testing.T) {
	RegisterT(t)

	bus.AddHandler(func(ctx context.Context, q *query.FetchRecentSupressions) error {
		q.EmailAddresses = []string{
			"test1@gmail.com", "test2@gmail.com",
		}
		return nil
	})

	bus.AddHandler(func(ctx context.Context, c *cmd.SupressEmail) error {
		Expect(c.EmailAddresses).Equals([]string{"test1@gmail.com", "test2@gmail.com"})
		return nil
	})

	job := &jobs.EmailSupressionJobHandler{}
	err := job.Run(jobs.Context{
		Context: context.Background(),
	})
	Expect(err).IsNil()
}
