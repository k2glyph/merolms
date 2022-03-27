package cmd

import (
	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/models/enum"
	"github.com/k2glyph/meroedu/app/pkg/webhook"
)

type TestWebhook struct {
	ID int

	Result *dto.WebhookTriggerResult
}

type TriggerWebhooks struct {
	Type  enum.WebhookType
	Props webhook.Props
}

type PreviewWebhook struct {
	Type    enum.WebhookType
	Url     string
	Content string

	Result *dto.WebhookPreviewResult
}

type GetWebhookProps struct {
	Type enum.WebhookType

	Result webhook.Props
}
