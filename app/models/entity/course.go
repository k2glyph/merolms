package entity

import (
	"time"

	"github.com/k2glyph/meroedu/app/models/enum"
)

// Course represents an learning material created on platform
type Course struct {
	ID              int               `json:"id"`
	Title           string            `json:"title"`
	Description     string            `json:"description"`
	LongDescription string            `json:"long_description"`
	ImageURL        string            `json:"image_url"`
	Duration        int               `json:"duration"`
	User            *User             `json:"user"`
	Attachments     []string          `json:"attachments,omitempty"`
	Status          enum.CourseStatus `json:"status"`
	CreatedAt       time.Time         `json:"createdAt"`
	EditedAt        []*time.Time      `json:"editedAt,omitempty"`
	EditedBy        []*User           `json:"editedBy,omitempty"`
	Tenant          *Tenant           `json:"tenant"`
}

//CourseResponse is a staff response to a given post
type CourseResponse struct {
	Text        string          `json:"text"`
	RespondedAt time.Time       `json:"respondedAt"`
	User        *User           `json:"user"`
	Original    *OriginalCourse `json:"original"`
}

//OriginalCourse holds details of the original course of a duplicate
type OriginalCourse struct {
	Number int               `json:"number"`
	Title  string            `json:"title"`
	Status enum.CourseStatus `json:"status"`
}
