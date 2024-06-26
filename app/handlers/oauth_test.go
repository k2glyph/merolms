package handlers_test

import (
	"context"
	"testing"

	"github.com/k2glyph/meroedu/app/models/dto"
	"github.com/k2glyph/meroedu/app/models/entity"

	"github.com/k2glyph/meroedu/app/services/oauth"

	"github.com/k2glyph/meroedu/app"

	"net/http"
	"net/url"

	"github.com/k2glyph/meroedu/app/handlers"
	"github.com/k2glyph/meroedu/app/middlewares"
	"github.com/k2glyph/meroedu/app/models/cmd"
	"github.com/k2glyph/meroedu/app/models/query"
	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/jwt"
	"github.com/k2glyph/meroedu/app/pkg/mock"
	"github.com/k2glyph/meroedu/app/pkg/web"
)

func TestSignOutHandler(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	code, response := server.
		WithURL("http://demo.test.meroedu.io/signout?redirect=/").
		AddCookie(web.CookieAuthName, "some-value").
		Execute(handlers.SignOut())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("/")
	Expect(response.Header().Get("Set-Cookie")).ContainsSubstring(web.CookieAuthName + "=; Path=/; Expires=")
	Expect(response.Header().Get("Set-Cookie")).ContainsSubstring("Max-Age=0; HttpOnly")
}

func TestSignInByOAuthHandler(t *testing.T) {
	RegisterT(t)
	bus.Init(&oauth.Service{})

	server := mock.NewServer()
	code, response := server.
		AddParam("provider", app.FacebookProvider).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		WithURL("http://avengers.test.meroedu.io/oauth/facebook").
		Use(middlewares.Session()).
		Execute(handlers.SignInByOAuth())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("https://www.facebook.com/v3.2/dialog/oauth?client_id=FB_CL_ID&redirect_uri=http%3A%2F%2Flogin.test.meroedu.io%2Foauth%2Ffacebook%2Fcallback&response_type=code&scope=public_profile+email&state=http%3A%2F%2Favengers.test.meroedu.io%7CMY_SESSION_ID")
}

func TestSignInByOAuthHandler_AuthenticatedUser(t *testing.T) {
	RegisterT(t)
	bus.Init(&oauth.Service{})

	server := mock.NewServer()
	code, response := server.
		AsUser(mock.JonSnow).
		AddParam("provider", app.FacebookProvider).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		WithURL("http://avengers.test.meroedu.io/oauth/facebook?redirect=http://avengers.test.meroedu.io").
		Use(middlewares.Session()).
		Execute(handlers.SignInByOAuth())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("http://avengers.test.meroedu.io")
}

func TestSignInByOAuthHandler_AuthenticatedUser_UsingEcho(t *testing.T) {
	RegisterT(t)
	bus.Init(&oauth.Service{})

	server := mock.NewServer()
	code, response := server.
		AsUser(mock.JonSnow).
		AddParam("provider", app.FacebookProvider).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		WithURL("http://avengers.test.meroedu.io/oauth/facebook?redirect=http://avengers.test.meroedu.io/oauth/facebook/echo").
		Use(middlewares.Session()).
		Execute(handlers.SignInByOAuth())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("https://www.facebook.com/v3.2/dialog/oauth?client_id=FB_CL_ID&redirect_uri=http%3A%2F%2Flogin.test.meroedu.io%2Foauth%2Ffacebook%2Fcallback&response_type=code&scope=public_profile+email&state=http%3A%2F%2Favengers.test.meroedu.io%2Foauth%2Ffacebook%2Fecho%7CMY_SESSION_ID")
}

func TestCallbackHandler_InvalidState(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	code, _ := server.
		WithURL("http://login.test.meroedu.io/oauth/callback?state=abc").
		AddParam("provider", app.FacebookProvider).
		Execute(handlers.OAuthCallback())

	Expect(code).Equals(http.StatusInternalServerError)
}

func TestCallbackHandler_InvalidCode(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()

	code, response := server.
		WithURL("http://login.test.meroedu.io/oauth/callback?state=http://avengers.test.meroedu.io").
		AddParam("provider", app.FacebookProvider).
		Execute(handlers.OAuthCallback())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("http://avengers.test.meroedu.io")
}

func TestCallbackHandler_SignIn(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	code, response := server.
		WithURL("http://login.test.meroedu.io/oauth/callback?state=http://avengers.test.meroedu.io|888&code=123").
		AddParam("provider", app.FacebookProvider).
		Execute(handlers.OAuthCallback())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("http://avengers.test.meroedu.io/oauth/facebook/token?code=123&identifier=888&redirect=%2F")
}

func TestCallbackHandler_SignIn_WithPath(t *testing.T) {
	RegisterT(t)
	server := mock.NewServer()

	code, response := server.
		WithURL("http://login.test.meroedu.io/oauth/callback?state=http://avengers.test.meroedu.io/some-page|888&code=123").
		AddParam("provider", app.FacebookProvider).
		Execute(handlers.OAuthCallback())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("http://avengers.test.meroedu.io/oauth/facebook/token?code=123&identifier=888&redirect=%2Fsome-page")
}

func TestCallbackHandler_SignUp(t *testing.T) {
	RegisterT(t)

	oauthUser := &dto.OAuthUserProfile{
		ID:    "FB123",
		Name:  "Jon Snow",
		Email: "jon.snow@got.com",
	}

	bus.AddHandler(func(ctx context.Context, q *query.GetOAuthProfile) error {
		if q.Provider == app.FacebookProvider && q.Code == "123" {
			q.Result = oauthUser
			return nil
		}
		return app.ErrNotFound
	})

	server := mock.NewServer()
	code, response := server.
		WithURL("http://login.test.meroedu.io/oauth/callback?state=http://demo.test.meroedu.io/signup&code=123").
		AddParam("provider", app.FacebookProvider).
		Execute(handlers.OAuthCallback())
	Expect(code).Equals(http.StatusTemporaryRedirect)

	location, _ := url.Parse(response.Header().Get("Location"))
	Expect(location.Host).Equals("demo.test.meroedu.io")
	Expect(location.Scheme).Equals("http")
	Expect(location.Path).Equals("/signup")
	ExpectOAuthToken(location.Query().Get("token"), &jwt.OAuthClaims{
		OAuthProvider: "facebook",
		OAuthID:       oauthUser.ID,
		OAuthName:     oauthUser.Name,
		OAuthEmail:    oauthUser.Email,
	})
}

func TestOAuthTokenHandler_ExistingUserAndProvider(t *testing.T) {
	RegisterT(t)

	oauthUser := &dto.OAuthUserProfile{
		ID:    "FB123",
		Name:  "Jon Snow",
		Email: "jon.snow@got.com",
	}

	bus.AddHandler(func(ctx context.Context, q *query.GetOAuthProfile) error {
		if q.Provider == app.FacebookProvider && q.Code == "123" {
			q.Result = oauthUser
			return nil
		}
		return app.ErrNotFound
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetUserByProvider) error {
		if q.Provider == app.FacebookProvider && q.UID == oauthUser.ID {
			q.Result = mock.JonSnow
			return nil
		}
		return app.ErrNotFound
	})

	server := mock.NewServer()
	code, response := server.
		WithURL("http://demo.test.meroedu.io/oauth/facebook/token?code=123&identifier=MY_SESSION_ID&redirect=/hello").
		OnTenant(mock.DemoTenant).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		AddParam("provider", app.FacebookProvider).
		Use(middlewares.Session()).
		Execute(handlers.OAuthToken())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("/hello")
	ExpectMeroeduAuthCookie(response, mock.JonSnow)
}

func TestOAuthTokenHandler_NewUser(t *testing.T) {
	RegisterT(t)

	var registeredUser *entity.User
	bus.AddHandler(func(ctx context.Context, c *cmd.RegisterUser) error {
		registeredUser = c.User
		return nil
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetUserByProvider) error {
		return app.ErrNotFound
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetUserByEmail) error {
		return app.ErrNotFound
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetOAuthProfile) error {
		if q.Provider == app.FacebookProvider && q.Code == "456" {
			q.Result = &dto.OAuthUserProfile{
				ID:    "FB456",
				Name:  "Some Facebook Guy",
				Email: "some.guy@facebook.com",
			}
			return nil
		}
		return app.ErrNotFound
	})

	server := mock.NewServer()
	code, response := server.
		WithURL("http://demo.test.meroedu.io/oauth/facebook/token?code=456&identifier=MY_SESSION_ID&redirect=/hello").
		OnTenant(mock.DemoTenant).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		AddParam("provider", app.FacebookProvider).
		Use(middlewares.Session()).
		Execute(handlers.OAuthToken())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("/hello")

	Expect(registeredUser.Name).Equals("Some Facebook Guy")

	ExpectMeroeduAuthCookie(response, registeredUser)
}

func TestOAuthTokenHandler_NewUserWithoutEmail(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	var newUser *entity.User
	bus.AddHandler(func(ctx context.Context, c *cmd.RegisterUser) error {
		c.User.ID = 1
		newUser = c.User
		return nil
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetUserByProvider) error {
		return app.ErrNotFound
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetOAuthProfile) error {
		if q.Provider == app.FacebookProvider && q.Code == "798" {
			q.Result = &dto.OAuthUserProfile{
				ID:    "FB798",
				Name:  "Mark",
				Email: "",
			}
			return nil
		}
		return app.ErrNotFound
	})

	code, response := server.
		WithURL("http://demo.test.meroedu.io/oauth/facebook/token?code=798&identifier=MY_SESSION_ID&redirect=/").
		OnTenant(mock.DemoTenant).
		AddParam("provider", app.FacebookProvider).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		Use(middlewares.Session()).
		Execute(handlers.OAuthToken())

	Expect(newUser.ID).Equals(1)
	Expect(newUser.Name).Equals("Mark")
	Expect(newUser.Providers).HasLen(1)

	Expect(code).Equals(http.StatusTemporaryRedirect)

	Expect(response.Header().Get("Location")).Equals("/")
	ExpectMeroeduAuthCookie(response, &entity.User{
		ID:   1,
		Name: "Mark",
	})
}

func TestOAuthTokenHandler_ExistingUser_WithoutEmail(t *testing.T) {
	RegisterT(t)

	user := &entity.User{
		ID:     3,
		Name:   "Some Facebook Guy",
		Email:  "",
		Tenant: mock.DemoTenant,
		Providers: []*entity.UserProvider{
			{UID: "FB456", Name: app.FacebookProvider},
		},
	}

	bus.AddHandler(func(ctx context.Context, q *query.GetOAuthProfile) error {
		if q.Provider == app.FacebookProvider && q.Code == "456" {
			q.Result = &dto.OAuthUserProfile{
				ID:    "FB456",
				Name:  "Some Facebook Guy",
				Email: "some.guy@facebook.com",
			}
			return nil
		}
		return app.ErrNotFound
	})

	server := mock.NewServer()

	bus.AddHandler(func(ctx context.Context, q *query.GetUserByProvider) error {
		if q.Provider == "facebook" && q.UID == "FB456" {
			q.Result = user
			return nil
		}
		return app.ErrNotFound
	})

	code, response := server.
		WithURL("http://demo.test.meroedu.io/oauth/facebook/token?code=456&identifier=MY_SESSION_ID&redirect=/").
		OnTenant(mock.DemoTenant).
		AddParam("provider", app.FacebookProvider).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		Use(middlewares.Session()).
		Execute(handlers.OAuthToken())

	Expect(code).Equals(http.StatusTemporaryRedirect)

	Expect(response.Header().Get("Location")).Equals("/")
	ExpectMeroeduAuthCookie(response, &entity.User{
		ID:    3,
		Name:  "Some Facebook Guy",
		Email: "",
	})
}

func TestOAuthTokenHandler_ExistingUser_NewProvider(t *testing.T) {
	RegisterT(t)

	var newProvider *entity.UserProvider
	bus.AddHandler(func(ctx context.Context, c *cmd.RegisterUserProvider) error {
		newProvider = &entity.UserProvider{
			Name: c.ProviderName,
			UID:  c.ProviderUID,
		}
		return nil
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetOAuthProfile) error {
		if q.Provider == app.GoogleProvider && q.Code == "123" {
			q.Result = &dto.OAuthUserProfile{
				ID:    "GO123",
				Name:  "Jon Snow",
				Email: "jon.snow@got.com",
			}
			return nil
		}
		return app.ErrNotFound
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetUserByProvider) error {
		if q.Provider == app.GoogleProvider && q.UID == "GO123" {
			q.Result = mock.JonSnow
			return nil
		}
		return app.ErrNotFound
	})

	server := mock.NewServer()
	code, response := server.
		WithURL("http://demo.test.meroedu.io/oauth/google/token?code=123&identifier=MY_SESSION_ID&redirect=/").
		OnTenant(mock.DemoTenant).
		AddParam("provider", app.GoogleProvider).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		Use(middlewares.Session()).
		Execute(handlers.OAuthToken())

	Expect(code).Equals(http.StatusTemporaryRedirect)

	Expect(newProvider.Name).Equals("google")
	Expect(newProvider.UID).Equals("GO123")

	Expect(response.Header().Get("Location")).Equals("/")
	ExpectMeroeduAuthCookie(response, mock.JonSnow)
}

func TestOAuthTokenHandler_NewUser_PrivateTenant(t *testing.T) {
	RegisterT(t)

	server := mock.NewServer()
	mock.AvengersTenant.IsPrivate = true

	bus.AddHandler(func(ctx context.Context, q *query.GetUserByEmail) error {
		return app.ErrNotFound
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetUserByProvider) error {
		return app.ErrNotFound
	})

	bus.AddHandler(func(ctx context.Context, q *query.GetOAuthProfile) error {
		if q.Provider == app.FacebookProvider && q.Code == "456" {
			q.Result = &dto.OAuthUserProfile{
				ID:    "FB456",
				Name:  "Some Facebook Guy",
				Email: "some.guy@facebook.com",
			}
			return nil
		}
		return app.ErrNotFound
	})

	code, response := server.
		WithURL("http://feedback.theavengers.com/oauth/facebook/token?code=456&identifier=MY_SESSION_ID&redirect=/").
		OnTenant(mock.AvengersTenant).
		AddParam("provider", app.FacebookProvider).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		Use(middlewares.Session()).
		Execute(handlers.OAuthToken())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("/not-invited")
	ExpectMeroeduAuthCookie(response, nil)
}

func TestOAuthTokenHandler_InvalidIdentifier(t *testing.T) {
	RegisterT(t)
	server := mock.NewServer()
	mock.AvengersTenant.IsPrivate = true

	code, response := server.
		WithURL("http://feedback.theavengers.com/oauth/facebook/token?code=456&identifier=SOME_OTHER_ID&redirect=/").
		OnTenant(mock.AvengersTenant).
		AddParam("provider", app.FacebookProvider).
		AddCookie(web.CookieSessionName, "MY_SESSION_ID").
		Use(middlewares.Session()).
		Execute(handlers.OAuthToken())

	Expect(code).Equals(http.StatusTemporaryRedirect)
	Expect(response.Header().Get("Location")).Equals("/")
	ExpectMeroeduAuthCookie(response, nil)
}

func ExpectOAuthToken(token string, expected *jwt.OAuthClaims) {
	user, err := jwt.DecodeOAuthClaims(token)
	Expect(err).IsNil()
	Expect(user.OAuthID).Equals(expected.OAuthID)
	Expect(user.OAuthName).Equals(expected.OAuthName)
	Expect(user.OAuthEmail).Equals(expected.OAuthEmail)
	Expect(user.OAuthProvider).Equals(expected.OAuthProvider)
}
