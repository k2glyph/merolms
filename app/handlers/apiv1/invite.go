package apiv1

import (
	"strings"

	"github.com/k2glyph/meroedu/app"
	"github.com/k2glyph/meroedu/app/actions"
	"github.com/k2glyph/meroedu/app/models/cmd"
	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/log"
	"github.com/k2glyph/meroedu/app/pkg/markdown"
	"github.com/k2glyph/meroedu/app/pkg/web"
	"github.com/k2glyph/meroedu/app/tasks"
)

// SendSampleInvite to current user's email
func SendSampleInvite() web.HandlerFunc {
	return func(c *web.Context) error {
		action := &actions.InviteUsers{IsSampleInvite: true}
		if result := c.BindTo(action); !result.Ok {
			return c.HandleValidation(result)
		}

		if c.User().Email != "" {
			action.Message = strings.Replace(action.Message, app.InvitePlaceholder, "*[the link to join will be here]*", -1)
			to := dto.NewRecipient(c.User().Name, c.User().Email, dto.Props{
				"subject": action.Subject,
				"message": markdown.Full(action.Message),
			})

			bus.Publish(c, &cmd.SendMail{
				From:         dto.Recipient{Name: c.Tenant().Name},
				To:           []dto.Recipient{to},
				TemplateName: "invite_email",
				Props: dto.Props{
					"logo": web.LogoURL(c),
				},
			})
		}

		return c.Ok(web.Map{})
	}
}

// SendInvites sends an email to each recipient
func SendInvites() web.HandlerFunc {
	return func(c *web.Context) error {
		action := new(actions.InviteUsers)
		if result := c.BindTo(action); !result.Ok {
			return c.HandleValidation(result)
		}

		log.Warnf(c, "@{Tenant:magenta} sent @{TotalInvites:magenta} invites", dto.Props{
			"Tenant":       c.Tenant().Subdomain,
			"TotalInvites": len(action.Invitations),
		})
		c.Enqueue(tasks.SendInvites(action.Subject, action.Message, action.Invitations))

		return c.Ok(web.Map{})
	}
}
