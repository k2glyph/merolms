package query

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

type GetCommentByID struct {
	CommentID int

	Result *entity.Comment
}

type GetCommentsByPost struct {
	Post *entity.Post

	Result []*entity.Comment
}
