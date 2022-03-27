package query

import "github.com/k2glyph/meroedu/app/models/entity"

type ListPostVotes struct {
	PostID       int
	Limit        int
	IncludeEmail bool

	Result []*entity.Vote
}
