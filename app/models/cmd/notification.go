package cmd

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

type MarkAllNotificationsAsRead struct{}

type PurgeExpiredNotifications struct {
	NumOfDeletedNotifications int
}

type MarkNotificationAsRead struct {
	ID int
}

type AddNewNotification struct {
	User   *entity.User
	Title  string
	Link   string
	PostID int

	Result *entity.Notification
}

type AddSubscriber struct {
	Post *entity.Post
	User *entity.User
}

type RemoveSubscriber struct {
	Post *entity.Post
	User *entity.User
}

type SupressEmail struct {
	EmailAddresses []string

	//Output
	NumOfSupressedEmailAddresses int
}
