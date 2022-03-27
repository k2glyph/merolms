package query

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

type GetAttachments struct {
	Post    *entity.Post
	Comment *entity.Comment

	Result []string
}
