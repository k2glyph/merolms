package email_test

import (
	"context"
	"testing"

	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/services/email"

	. "github.com/k2glyph/meroedu/app/pkg/assert"
)

func TestRenderMessage(t *testing.T) {
	RegisterT(t)

	message := email.RenderMessage(context.Background(), "echo_test", email.NoReply, dto.Props{
		"name": "Meroedu",
	})
	Expect(message.Subject).Equals("Message to: Meroedu")
	Expect(message.Body).Equals(`<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
	</head>
	<body bgcolor="#F7F7F7" style="font-size:18px">
		<table width="100%" bgcolor="#F7F7F7" cellpadding="0" cellspacing="0" border="0" style="text-align:center;font-size:18px;">
			<tr>
				<td height="40">&nbsp;</td>
			</tr>
			
			<tr>
				<td align="center">
					<table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" border="0" style="text-align:left;padding:20px;margin:10px;border-radius:5px;color:#1c262d;border:1px solid #ECECEC;min-width:320px;max-width:660px;">
						
Hello World Meroedu!

					</table>
				</td>
			</tr>
			
			<tr>
				<td>
					<span style="color:#666;font-size:12px">This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message.</span>
				</td>
			</tr>
			
			<tr>
				<td height="40">&nbsp;</td>
			</tr>
		</table>
	</body>
</html>`)
}

func TestCanSendTo(t *testing.T) {
	RegisterT(t)

	testCases := []struct {
		allowlist string
		blocklist string
		input     []string
		canSend   bool
	}{
		{
			allowlist: "(^.+@meroedu.io$)|(^darthvader\\.meroedu(\\+.*)?@gmail\\.com$)",
			blocklist: "",
			input:     []string{"me@meroedu.io", "me+123@meroedu.io", "darthvader.meroedu@gmail.com", "darthvader.meroedu+434@gmail.com"},
			canSend:   true,
		},
		{
			allowlist: "(^.+@meroedu.io$)|(^darthvader\\.meroedu(\\+.*)?@gmail\\.com$)",
			blocklist: "",
			input:     []string{"me+123@meroedu.iod", "me@meroeduo.io", "darthvader.meroedua@gmail.com", "@meroedu.io"},
			canSend:   false,
		},
		{
			allowlist: "(^.+@meroedu.io$)|(^darthvader\\.meroedu(\\+.*)?@gmail\\.com$)",
			blocklist: "(^.+@meroedu.io$)",
			input:     []string{"me@meroedu.io"},
			canSend:   true,
		},
		{
			allowlist: "",
			blocklist: "(^.+@meroedu.io$)",
			input:     []string{"me@meroedu.io", "abc@meroedu.io"},
			canSend:   false,
		},
		{
			allowlist: "",
			blocklist: "(^.+@meroedu.io$)",
			input:     []string{"me@meroedu.com", "abc@meroeduio.io"},
			canSend:   true,
		},
		{
			allowlist: "",
			blocklist: "",
			input:     []string{"me@meroedu.io"},
			canSend:   true,
		},
		{
			allowlist: "",
			blocklist: "",
			input:     []string{"", " "},
			canSend:   false,
		},
	}

	for _, testCase := range testCases {
		email.SetAllowlist(testCase.allowlist)
		email.SetBlocklist(testCase.blocklist)
		for _, input := range testCase.input {
			Expect(email.CanSendTo(input)).Equals(testCase.canSend)
		}
	}
}

func TestRecipient_String(t *testing.T) {
	RegisterT(t)

	testCases := []struct {
		name     string
		email    string
		expected string
	}{
		{
			name:     "Jon",
			email:    "jon@got.com",
			expected: `"Jon" <jon@got.com>`,
		},
		{
			name:     "Snow, Jon",
			email:    "jon@got.com",
			expected: `"Snow, Jon" <jon@got.com>`,
		},
		{
			name:     "",
			email:    "jon@got.com",
			expected: "<jon@got.com>",
		},
		{
			name:     "Jon's Home Account",
			email:    "jon@got.com",
			expected: `"Jon's Home Account" <jon@got.com>`,
		},
		{
			name:     `Jon "Great" Snow`,
			email:    "jon@got.com",
			expected: `"Jon \"Great\" Snow" <jon@got.com>`,
		},
		{
			name:     "Jon",
			email:    "",
			expected: "",
		},
	}

	for _, testCase := range testCases {
		r := dto.NewRecipient(testCase.name, testCase.email, dto.Props{})
		Expect(r.String()).Equals(testCase.expected)
	}
}
