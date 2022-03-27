package tasks_test

import (
	"testing"

	"github.com/k2glyph/meroedu/app/models/dto"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/mock"
	"github.com/k2glyph/meroedu/app/services/email/emailmock"
	"github.com/k2glyph/meroedu/app/tasks"
)

func TestSendSignInEmailTask(t *testing.T) {
	RegisterT(t)
	bus.Init(emailmock.Service{})

	worker := mock.NewWorker()
	task := tasks.SendSignInEmail("jon@got.com", "9876")

	err := worker.
		OnTenant(mock.DemoTenant).
		AsUser(mock.JonSnow).
		WithBaseURL("http://domain.com").
		Execute(task)

	Expect(err).IsNil()
	Expect(emailmock.MessageHistory).HasLen(1)
	Expect(emailmock.MessageHistory[0].TemplateName).Equals("signin_email")
	Expect(emailmock.MessageHistory[0].Tenant).Equals(mock.DemoTenant)
	Expect(emailmock.MessageHistory[0].Props).Equals(dto.Props{
		"logo": "https://meroedu.io/images/logo-100x100.png",
	})
	Expect(emailmock.MessageHistory[0].From).Equals(dto.Recipient{
		Name: mock.DemoTenant.Name,
	})
	Expect(emailmock.MessageHistory[0].To).HasLen(1)
	Expect(emailmock.MessageHistory[0].To[0]).Equals(dto.Recipient{
		Address: "jon@got.com",
		Props: dto.Props{
			"siteName": mock.DemoTenant.Name,
			"link":     "<a href='http://domain.com/signin/verify?k=9876'>http://domain.com/signin/verify?k=9876</a>",
		},
	})
}
