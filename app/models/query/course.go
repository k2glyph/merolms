package query

import (
	"github.com/k2glyph/meroedu/app/models/entity"
	"github.com/k2glyph/meroedu/app/models/enum"
)

type GetCourseByID struct {
	CourseID int

	Result *entity.Course
}

type GetCoursesByTenant struct {
	Tenant *entity.Tenant

	Result []*entity.Course
}
type GetCoursesByUser struct {
	User *entity.User

	Result []*entity.Course
}

type SearchCourses struct {
	Query string
	View  string
	Limit string

	Result []*entity.Course
}

type GetAllCourses struct {
	Result []*entity.Course
}

type CountCoursePerStatus struct {
	Result map[enum.CourseStatus]int
}
