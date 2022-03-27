package handlers

import (
	"net/http"

	"github.com/k2glyph/meroedu/app/pkg/web"
)

// Index is the default home page
func Index() web.HandlerFunc {
	return func(c *web.Context) error {
		c.SetCanonicalURL("")

		// searchPosts := &query.SearchPosts{
		// 	Query: c.QueryParam("query"),
		// 	View:  c.QueryParam("view"),
		// 	Limit: c.QueryParam("limit"),
		// 	Tags:  c.QueryParamAsArray("tags"),
		// }
		// getAllTags := &query.GetAllTags{}
		// countPerStatus := &query.CountPostPerStatus{}

		// if err := bus.Dispatch(c, searchPosts, getAllTags, countPerStatus); err != nil {
		// 	return c.Failure(err)
		// }

		// description := ""
		// if c.Tenant().WelcomeMessage != "" {
		// 	description = markdown.PlainText(c.Tenant().WelcomeMessage)
		// } else {
		// 	description = "We'd love to hear what you're thinking about. What can we do better? This is the place for you to vote, discuss and share posts."
		// }

		return c.Page(http.StatusOK, web.Props{
			Page:        "Home/Home.page",
			Description: "",
			Data:        nil,
		})
	}
}
