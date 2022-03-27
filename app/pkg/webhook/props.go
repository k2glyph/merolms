package webhook

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

// Props is a map of key:value
type Props map[string]interface{}

// SetUser describe the user prefixed by "keyPrefix"
func (p Props) SetUser(user *entity.User, keyPrefix string) Props {
	if user != nil {
		p[keyPrefix+"_id"] = user.ID
		p[keyPrefix+"_name"] = user.Name
		p[keyPrefix+"_email"] = user.Email
		p[keyPrefix+"_role"] = user.Role.String()
		p[keyPrefix+"_avatar"] = user.AvatarURL
	}
	return p
}

// SetTenant describe the tenant prefixed by "keyPrefix"
func (p Props) SetTenant(tenant *entity.Tenant, keyPrefix, baseURL, logoURL string) Props {
	if tenant != nil {
		p[keyPrefix+"_id"] = tenant.ID
		p[keyPrefix+"_name"] = tenant.Name
		p[keyPrefix+"_subdomain"] = tenant.Subdomain
		p[keyPrefix+"_status"] = tenant.Status.String()
		p[keyPrefix+"_locale"] = tenant.Locale
		p[keyPrefix+"_url"] = baseURL
		p[keyPrefix+"_logo"] = logoURL
	}
	return p
}
