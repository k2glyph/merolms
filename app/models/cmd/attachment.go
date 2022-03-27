package cmd

import (
	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/models/entity"
)

type SetAttachments struct {
	Post        *entity.Post
	Comment     *entity.Comment
	Attachments []*dto.ImageUpload
}

type UploadImage struct {
	Image  *dto.ImageUpload
	Folder string
}

type UploadImages struct {
	Images []*dto.ImageUpload
	Folder string
}
