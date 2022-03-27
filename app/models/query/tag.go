package query

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

type GetTagBySlug struct {
	Slug string

	Result *entity.Tag
}

type GetAssignedTags struct {
	Post *entity.Post

	Result []*entity.Tag
}

type GetAllTags struct {
	Result []*entity.Tag
}
