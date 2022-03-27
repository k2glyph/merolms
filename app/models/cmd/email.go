package cmd

import "github.com/k2glyph/meroedu/app/models/dto"

type SendMail struct {
	From         dto.Recipient
	To           []dto.Recipient
	TemplateName string
	Props        dto.Props
}
