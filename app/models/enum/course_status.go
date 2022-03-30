package enum

type CourseStatus int

var (
	CourseDraft           CourseStatus = 0
	CoursePublishInternal CourseStatus = 1
	CoursePublishExternal CourseStatus = 2
	CourseArchive         CourseStatus = 3
)

var courseStatusIDs = map[CourseStatus]string{
	CourseDraft:           "draft",
	CoursePublishInternal: "publish",
	CoursePublishExternal: "public",
	CourseArchive:         "archive",
}

// String returns the string version of the course status

func (status CourseStatus) String() string {
	return courseStatusIDs[status]
}
