package jobs

import (
	"time"

	"github.com/k2glyph/meroedu/app/models/cmd"
	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/models/query"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/errors"
	"github.com/k2glyph/meroedu/app/pkg/log"
)

type EmailSupressionJobHandler struct {
}

func (e EmailSupressionJobHandler) Schedule() string {
	return "0 5 * * * *" // every hour at minute 5
}

func (e EmailSupressionJobHandler) Run(ctx Context) error {
	startTime := ctx.LastSuccessfulRun
	if startTime == nil {
		twoDaysAgo := time.Now().AddDate(0, 0, -2)
		startTime = &twoDaysAgo
	}

	q := &query.FetchRecentSupressions{
		StartTime: *startTime,
	}

	if err := bus.Dispatch(ctx, q); err != nil {
		return errors.Wrap(err, "failed to fetch recent supressions")
	}

	c := &cmd.SupressEmail{
		EmailAddresses: q.EmailAddresses,
	}
	if err := bus.Dispatch(ctx, c); err != nil {
		return errors.Wrap(err, "failed to supress emails")
	}

	log.Debugf(ctx, "@{Count} account(s) marked with supressed email", dto.Props{
		"Count": c.NumOfSupressedEmailAddresses,
	})

	return nil
}
