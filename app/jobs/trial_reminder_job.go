package jobs

import (
	"fmt"
	"time"

	"github.com/k2glyph/meroedu/app/models/cmd"
	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/models/query"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/env"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

type TrialReminderJobHandler struct {
	Days         int
	TemplateName string
}

func (e TrialReminderJobHandler) Schedule() string {
	return "0 0 7 * * *" // every day at 7:00 AM
}

func (e TrialReminderJobHandler) Run(ctx Context) error {
	if ctx.LastSuccessfulRun == nil {
		// this is the first run, we can skip it
		return nil
	}

	date := time.Now().AddDate(0, 0, e.Days)
	q := &query.GetTrialingTenantContacts{
		TrialExpiresOn: date,
	}

	if err := bus.Dispatch(ctx, q); err != nil {
		return err
	}

	to := make([]dto.Recipient, 0)
	for _, contact := range q.Contacts {
		to = append(to, dto.NewRecipient(contact.Name, contact.Email, dto.Props{
			"url":  fmt.Sprintf("https://%s.%s", contact.Tenant.Subdomain, env.Config.HostDomain),
			"name": contact.Name,
		}))
	}

	if len(to) > 0 {
		bus.Publish(ctx, &cmd.SendMail{
			From: dto.Recipient{
				Name:    "Guilherme",
				Address: "goenning@meroedu.io",
			},
			To:           to,
			TemplateName: e.TemplateName,
			Props: dto.Props{
				"logo": web.LogoURL(ctx),
			},
		})
	}

	return nil
}
