package cmd

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

type AddNewComment struct {
	Post    *entity.Post
	Content string

	Result *entity.Comment
}

type UpdateComment struct {
	CommentID int
	Content   string
}

type DeleteComment struct {
	CommentID int
}
