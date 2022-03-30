package cmd

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

type AddNewCourse struct {
	User   *entity.User
	Tenant *entity.Tenant

	Title       string
	Description string

	Result *entity.Course
}

type UpdateCourse struct {
	CourseID    int
	Title       string
	Description string
}

type DeleteCourse struct {
	CourseID int
}
