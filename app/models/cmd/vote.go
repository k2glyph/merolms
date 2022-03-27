package cmd

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

type AddVote struct {
	Post *entity.Post
	User *entity.User
}

type RemoveVote struct {
	Post *entity.Post
	User *entity.User
}

type MarkPostAsDuplicate struct {
	Post     *entity.Post
	Original *entity.Post
}
