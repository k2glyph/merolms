package query

import "github.com/k2glyph/meroedu/app/models/dto"

type ListBlobs struct {
	Prefix string

	Result []string
}

type GetBlobByKey struct {
	Key string

	Result *dto.Blob
}
