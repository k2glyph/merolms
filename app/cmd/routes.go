package cmd

import (
	"net/http"
	"time"

	"github.com/k2glyph/meroedu/app/handlers"
	"github.com/k2glyph/meroedu/app/handlers/apiv1"
	"github.com/k2glyph/meroedu/app/handlers/webhooks"
	"github.com/k2glyph/meroedu/app/middlewares"
	"github.com/k2glyph/meroedu/app/models/enum"
	"github.com/k2glyph/meroedu/app/pkg/env"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

func routes(r *web.Engine) *web.Engine {
	r.Worker().Use(middlewares.WorkerSetup())

	r.Use(middlewares.CatchPanic())
	r.Use(middlewares.Instrumentation())

	r.NotFound(func(c *web.Context) error {
		mw := middlewares.Chain(
			middlewares.WebSetup(),
			middlewares.Tenant(),
			middlewares.User(),
		)
		next := mw(func(c *web.Context) error {
			return c.NotFound()
		})
		return next(c)
	})

	r.Use(middlewares.Secure())
	r.Use(middlewares.Compress())

	assets := r.Group()
	{
		assets.Use(middlewares.CORS())
		assets.Use(middlewares.ClientCache(365 * 24 * time.Hour))
		assets.Get("/static/favicon", handlers.Favicon())
		assets.Static("/assets/*filepath", "dist")
	}

	r.Use(middlewares.Session())

	r.Get("/_health", handlers.Health())
	r.Get("/robots.txt", handlers.RobotsTXT())
	r.Post("/_api/log-error", handlers.LogError())

	r.Use(middlewares.Maintenance())
	r.Use(middlewares.WebSetup())
	r.Use(middlewares.Tenant())
	r.Use(middlewares.User())

	r.Get("/privacy", handlers.LegalPage("Privacy Policy", "privacy.md"))
	r.Get("/terms", handlers.LegalPage("Terms of Service", "terms.md"))

	r.Post("/_api/tenants", handlers.CreateTenant())
	r.Get("/_api/tenants/:subdomain/availability", handlers.CheckAvailability())
	r.Get("/signup", handlers.SignUp())
	r.Get("/oauth/:provider", handlers.SignInByOAuth())
	r.Get("/oauth/:provider/callback", handlers.OAuthCallback())

	if env.IsBillingEnabled() {
		wh := r.Group()
		{
			wh.Post("/webhooks/paddle", webhooks.IncomingPaddleWebhook())
		}
	}

	//Starting from this step, a Tenant is required
	r.Use(middlewares.RequireTenant())

	r.Get("/sitemap.xml", handlers.Sitemap())

	tenantAssets := r.Group()
	{
		tenantAssets.Use(middlewares.ClientCache(5 * 24 * time.Hour))
		tenantAssets.Get("/static/avatars/letter/:id/:name", handlers.LetterAvatar())
		tenantAssets.Get("/static/avatars/gravatar/:id/:name", handlers.Gravatar())

		tenantAssets.Use(middlewares.ClientCache(30 * 24 * time.Hour))
		tenantAssets.Get("/static/favicon/*bkey", handlers.Favicon())
		tenantAssets.Get("/static/images/*bkey", handlers.ViewUploadedImage())
		tenantAssets.Get("/static/custom/:md5.css", func(c *web.Context) error {
			return c.Blob(http.StatusOK, "text/css", []byte(c.Tenant().CustomCSS))
		})
	}

	r.Get("/_design", handlers.Page("Design System", "A preview of Meroedu UI elements", "DesignSystem/DesignSystem.page"))
	r.Get("/signup/verify", handlers.VerifySignUpKey())
	r.Get("/signout", handlers.SignOut())
	r.Get("/oauth/:provider/token", handlers.OAuthToken())
	r.Get("/oauth/:provider/echo", handlers.OAuthEcho())

	//If tenant is pending, block it from using any other route
	r.Use(middlewares.BlockPendingTenants())

	r.Get("/signin", handlers.SignInPage())
	r.Get("/not-invited", handlers.NotInvitedPage())
	r.Get("/signin/verify", handlers.VerifySignInKey(enum.EmailVerificationKindSignIn))
	r.Get("/invite/verify", handlers.VerifySignInKey(enum.EmailVerificationKindUserInvitation))
	r.Post("/_api/signin/complete", handlers.CompleteSignInProfile())
	r.Post("/_api/signin", handlers.SignInByEmail())

	//Block if it's private tenant with unauthenticated user
	r.Use(middlewares.CheckTenantPrivacy())

	r.Get("/", handlers.Index())

	ui := r.Group()
	{
		//From this step, a User is required
		ui.Use(middlewares.IsAuthenticated())

		ui.Get("/settings", handlers.UserSettings())
		ui.Get("/notifications", handlers.Notifications())
		ui.Get("/notifications/:id", handlers.ReadNotification())
		ui.Get("/change-email/verify", handlers.VerifyChangeEmailKey())

		ui.Delete("/_api/user", handlers.DeleteUser())
		ui.Post("/_api/user/regenerate-apikey", handlers.RegenerateAPIKey())
		ui.Post("/_api/user/settings", handlers.UpdateUserSettings())
		ui.Post("/_api/user/change-email", handlers.ChangeUserEmail())
		ui.Post("/_api/notifications/read-all", handlers.ReadAllNotifications())
		ui.Get("/_api/notifications/unread/total", handlers.TotalUnreadNotifications())

		// From this step, only Collaborators and Administrators are allowed
		ui.Use(middlewares.IsAuthorized(enum.RoleCollaborator, enum.RoleAdministrator))

		// locale is forced to English for administrative pages.
		// This is meant to be removed when all pages are translated.
		ui.Use(middlewares.SetLocale("en"))

		ui.Get("/admin", handlers.GeneralSettingsPage())
		ui.Get("/admin/advanced", handlers.AdvancedSettingsPage())
		ui.Get("/admin/privacy", handlers.Page("Privacy · Site Settings", "", "Administration/pages/PrivacySettings.page"))
		ui.Get("/admin/invitations", handlers.Page("Invitations · Site Settings", "", "Administration/pages/Invitations.page"))
		ui.Get("/admin/members", handlers.ManageMembers())
		ui.Get("/admin/authentication", handlers.ManageAuthentication())
		ui.Get("/_api/admin/oauth/:provider", handlers.GetOAuthConfig())

		//From this step, only Administrators are allowed
		ui.Use(middlewares.IsAuthorized(enum.RoleAdministrator))

		ui.Get("/admin/webhooks", handlers.ManageWebhooks())
		ui.Post("/_api/admin/webhook", handlers.CreateWebhook())
		ui.Put("/_api/admin/webhook/:id", handlers.UpdateWebhook())
		ui.Delete("/_api/admin/webhook/:id", handlers.DeleteWebhook())
		ui.Get("/_api/admin/webhook/test/:id", handlers.TestWebhook())
		ui.Post("/_api/admin/webhook/preview", handlers.PreviewWebhook())
		ui.Get("/_api/admin/webhook/props/:type", handlers.GetWebhookProps())
		ui.Post("/_api/admin/settings/general", handlers.UpdateSettings())
		ui.Post("/_api/admin/settings/advanced", handlers.UpdateAdvancedSettings())
		ui.Post("/_api/admin/settings/privacy", handlers.UpdatePrivacy())
		ui.Post("/_api/admin/settings/emailauth", handlers.UpdateEmailAuthAllowed())
		ui.Post("/_api/admin/oauth", handlers.SaveOAuthConfig())
		ui.Post("/_api/admin/roles/:role/users", handlers.ChangeUserRole())
		ui.Put("/_api/admin/users/:userID/block", handlers.BlockUser())
		ui.Delete("/_api/admin/users/:userID/block", handlers.UnblockUser())

		if env.IsBillingEnabled() {
			ui.Get("/admin/billing", handlers.ManageBilling())
			ui.Post("/_api/billing/checkout-link", handlers.GenerateCheckoutLink())
		}
	}

	// Public operations
	// Does not require authentication
	// publicApi := r.Group()
	// {

	// }

	// Operations used to manage the content of a site
	// Available to any authenticated user
	membersApi := r.Group()
	{
		membersApi.Use(middlewares.IsAuthenticated())
		membersApi.Use(middlewares.BlockLockedTenants())

		membersApi.Use(middlewares.IsAuthorized(enum.RoleCollaborator, enum.RoleAdministrator))
	}

	// Operations used to manage a site
	// Available to both collaborators and administrators
	staffApi := r.Group()
	{
		staffApi.Use(middlewares.SetLocale("en"))
		staffApi.Use(middlewares.IsAuthenticated())
		staffApi.Use(middlewares.IsAuthorized(enum.RoleCollaborator, enum.RoleAdministrator))

		staffApi.Get("/api/v1/users", apiv1.ListUsers())
		staffApi.Post("/api/v1/invitations/send", apiv1.SendInvites())
		staffApi.Post("/api/v1/invitations/sample", apiv1.SendSampleInvite())

		staffApi.Use(middlewares.BlockLockedTenants())
	}

	// Operations used to manage a site
	// Only available to administrators
	adminApi := r.Group()
	{
		adminApi.Use(middlewares.SetLocale("en"))
		adminApi.Use(middlewares.IsAuthenticated())
		adminApi.Use(middlewares.IsAuthorized(enum.RoleAdministrator))

		adminApi.Post("/api/v1/users", apiv1.CreateUser())

		adminApi.Use(middlewares.BlockLockedTenants())
	}

	return r
}
