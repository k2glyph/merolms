package postgres

import (
	"context"
	"time"

	"github.com/k2glyph/meroedu/app/models/entity"
	"github.com/k2glyph/meroedu/app/models/enum"
	"github.com/k2glyph/meroedu/app/models/query"

	"github.com/k2glyph/meroedu/app/pkg/dbx"
	"github.com/k2glyph/meroedu/app/pkg/errors"
)

type dbCourse struct {
	ID          int       `db:"id"`
	Title       string    `db:"title"`
	Description string    `db:"description"`
	Tenant      *dbTenant `db:"tenant"`
	ImageURL    string    `db:"image_url"`
	CreatedAt   time.Time `db:"created_at"`
	User        *dbUser   `db:"user"`
	Status      int       `db:"status"`
}

func (i *dbCourse) toModel(ctx context.Context) *entity.Course {
	course := &entity.Course{
		ID:          i.ID,
		Title:       i.Title,
		Description: i.Description,
		ImageURL:    i.ImageURL,
		Tenant:      i.Tenant.toModel(),
		CreatedAt:   i.CreatedAt,
		Status:      enum.CourseStatus(i.Status),
		User:        i.User.toModel(ctx),
	}

	return course
}

func countCoursePerStatus(ctx context.Context, q *query.CountCoursePerStatus) error {
	return using(ctx, func(trx *dbx.Trx, tenant *entity.Tenant, user *entity.User) error {

		// type dbStatusCount struct {
		// 	Status enum.CourseStatus `db:"status"`
		// 	Count  int               `db:"count"`
		// }

		// q.Result = make(map[enum.CourseStatus]int)
		// stats := []*dbStatusCount{}
		// err := trx.Select(&stats, "SELECT status, COUNT(*) AS count FROM courses GROUP BY status")
		// if err != nil {
		// 	return errors.Wrap(err, "failed to count courses per status")
		// }

		// for _, v := range stats {
		// 	q.Result[v.Status] = v.Count
		// }
		return nil
	})
}

func getAllCourses(ctx context.Context, q *query.GetAllCourses) error {
	return using(ctx, func(trx *dbx.Trx, tenant *entity.Tenant, user *entity.User) error {
		var courses []*dbCourse
		err := trx.Select(&courses, `
			SELECT title, description, image_url
			FROM courses 
			WHERE tenant_id = $1
			ORDER BY id`, tenant.ID)
		if err != nil {
			return errors.Wrap(err, "failed to get all courses")
		}

		q.Result = make([]*entity.Course, len(courses))
		for i, user := range courses {
			q.Result[i] = user.toModel(ctx)
		}
		return nil
	})
}
