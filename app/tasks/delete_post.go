package tasks

import (
	"fmt"

	"github.com/k2glyph/meroedu/app/models/cmd"
	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/models/entity"
	"github.com/k2glyph/meroedu/app/models/enum"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/i18n"
	"github.com/k2glyph/meroedu/app/pkg/markdown"
	"github.com/k2glyph/meroedu/app/pkg/web"
	"github.com/k2glyph/meroedu/app/pkg/webhook"
	"github.com/k2glyph/meroedu/app/pkg/worker"
)

//NotifyAboutDeletedPost sends a notification (web and email) to subscribers of the post that has been deleted
func NotifyAboutDeletedPost(post *entity.Post) worker.Task {
	return describe("Notify about deleted post", func(c *worker.Context) error {

		// Web notification
		users, err := getActiveSubscribers(c, post, enum.NotificationChannelWeb, enum.NotificationEventChangeStatus)
		if err != nil {
			return c.Failure(err)
		}

		author := c.User()
		title := fmt.Sprintf("**%s** deleted **%s**", author.Name, post.Title)
		for _, user := range users {
			if user.ID != author.ID {
				err = bus.Dispatch(c, &cmd.AddNewNotification{
					User:   user,
					Title:  title,
					PostID: post.ID,
				})
				if err != nil {
					return c.Failure(err)
				}
			}
		}

		// Email notification
		users, err = getActiveSubscribers(c, post, enum.NotificationChannelEmail, enum.NotificationEventChangeStatus)
		if err != nil {
			return c.Failure(err)
		}

		to := make([]dto.Recipient, 0)
		for _, user := range users {
			if user.ID != author.ID {
				to = append(to, dto.NewRecipient(user.Name, user.Email, dto.Props{}))
			}
		}

		tenant := c.Tenant()
		baseURL, logoURL := web.BaseURL(c), web.LogoURL(c)

		props := dto.Props{
			"title":    post.Title,
			"siteName": tenant.Name,
			"content":  markdown.Full(post.Response.Text),
			"change":   linkWithText(i18n.T(c, "email.subscription.change"), baseURL, "/settings"),
			"logo":     logoURL,
		}

		bus.Publish(c, &cmd.SendMail{
			From:         dto.Recipient{Name: c.User().Name},
			To:           to,
			TemplateName: "delete_post",
			Props:        props,
		})

		webhookProps := webhook.Props{}
		webhookProps.SetPost(post, "post", baseURL, true, true)
		webhookProps.SetUser(author, "author")
		webhookProps.SetTenant(tenant, "tenant", baseURL, logoURL)

		err = bus.Dispatch(c, &cmd.TriggerWebhooks{
			Type:  enum.WebhookDeletePost,
			Props: webhookProps,
		})
		if err != nil {
			return c.Failure(err)
		}

		return nil
	})
}
