package handlers

import (
	"net/http"

	"github.com/k2glyph/meroedu/app/models/query"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

func CoursesList() web.HandlerFunc {
	return func(c *web.Context) error {

		c.SetCanonicalURL("")

		getAllCourses := &query.GetAllCourses{}
		// log.Warnf(c, "Search courses ${searchCourses}", dto.Props{
		// 	"Action": "test",
		// })
		// getAllTags := &query.GetAllTags{}
		countPerStatus := &query.CountCoursePerStatus{}

		if err := bus.Dispatch(c, getAllCourses, countPerStatus); err != nil {
			return c.Failure(err)
		}

		return c.Page(http.StatusOK, web.Props{
			Page: "Course/Course.page",
			Data: web.Map{
				"courses":        getAllCourses.Result,
				"countPerStatus": countPerStatus.Result,
			},
		})
	}
}

func CoursesCreate() web.HandlerFunc {
	return func(c *web.Context) error {

		c.SetCanonicalURL("")

		return c.Page(http.StatusOK, web.Props{
			Page: "Course/CreateCourse.page",
		})
	}
}
