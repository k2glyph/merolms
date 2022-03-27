package postgres

import (
	"context"
	"net/url"
	"regexp"
	"strings"

	"github.com/k2glyph/meroedu/app/models/enum"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

var onlyalphanumeric = regexp.MustCompile("[^a-zA-Z0-9 |]+")
var replaceOr = strings.NewReplacer("|", " ")

// ToTSQuery converts input to another string that can be safely used for ts_query
func ToTSQuery(input string) string {
	input = replaceOr.Replace(onlyalphanumeric.ReplaceAllString(input, ""))
	return strings.Join(strings.Fields(input), "|")
}

func buildAvatarURL(ctx context.Context, avatarType enum.AvatarType, id int, name, avatarBlobKey string) string {
	if name == "" {
		name = "-"
	}

	if avatarType == enum.AvatarTypeCustom {
		return web.AssetsURL(ctx, "/static/images/%s", avatarBlobKey)
	} else {
		return web.AssetsURL(ctx, "/static/avatars/%s/%d/%s", avatarType.String(), id, url.PathEscape(name))
	}
}
