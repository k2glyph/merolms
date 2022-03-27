package cmd

import (
	"github.com/k2glyph/meroedu/app/models/entity"
	"github.com/k2glyph/meroedu/app/models/enum"
)

type AddNewPost struct {
	Title       string
	Description string

	Result *entity.Post
}

type UpdatePost struct {
	Post        *entity.Post
	Title       string
	Description string

	Result *entity.Post
}

type SetPostResponse struct {
	Post   *entity.Post
	Text   string
	Status enum.PostStatus
}
