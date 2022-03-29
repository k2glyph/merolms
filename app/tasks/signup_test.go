package tasks_test

import (
	"testing"

	"github.com/k2glyph/meroedu/app/actions"
	"github.com/k2glyph/meroedu/app/models/dto"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/mock"
	"github.com/k2glyph/meroedu/app/services/email/emailmock"
	"github.com/k2glyph/meroedu/app/tasks"
)

func TestSendSignUpEmailTask(t *testing.T) {
	RegisterT(t)
	bus.Init(emailmock.Service{})

	worker := mock.NewWorker()
	task := tasks.SendSignUpEmail(&actions.CreateTenant{
		VerificationKey: "1234",
	}, "http://domain.com")

	err := worker.
		AsUser(mock.JonSnow).
		Execute(task)

	Expect(err).IsNil()
	Expect(emailmock.MessageHistory).HasLen(1)
	Expect(emailmock.MessageHistory[0].TemplateName).Equals("signup_email")
	Expect(emailmock.MessageHistory[0].Tenant).IsNil()
	Expect(emailmock.MessageHistory[0].Props).Equals(dto.Props{
		"logo": "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
	})
	Expect(emailmock.MessageHistory[0].From).Equals(dto.Recipient{
		Name: "Meroedu",
	})
	Expect(emailmock.MessageHistory[0].To).HasLen(1)
	Expect(emailmock.MessageHistory[0].To[0]).Equals(dto.Recipient{
		Props: dto.Props{
			"link": "<a href='http://domain.com/signup/verify?k=1234'>http://domain.com/signup/verify?k=1234</a>",
		},
	})
}
