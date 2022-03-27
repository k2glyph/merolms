package env_test

import (
	"testing"

	. "github.com/k2glyph/meroedu/app/pkg/assert"
	"github.com/k2glyph/meroedu/app/pkg/env"
)

var envs = []struct {
	go_env string
	env    string
	isEnv  func() bool
}{
	{"test", "test", env.IsTest},
	{"development", "development", env.IsDevelopment},
	{"production", "production", env.IsProduction},
	{"anything", "production", env.IsProduction},
}

func TestIsEnvironment(t *testing.T) {
	RegisterT(t)

	for _, testCase := range envs {
		env.Config.Environment = testCase.go_env
		actual := testCase.isEnv()
		Expect(actual).IsTrue()
	}
}

func TestHasLegal(t *testing.T) {
	RegisterT(t)

	Expect(env.HasLegal()).IsTrue()
}

func TestMultiTenantDomain(t *testing.T) {
	RegisterT(t)

	env.Config.HostDomain = "test.meroedu.io"
	Expect(env.MultiTenantDomain()).Equals(".test.meroedu.io")
	env.Config.HostDomain = "dev.meroedu.io"
	Expect(env.MultiTenantDomain()).Equals(".dev.meroedu.io")
	env.Config.HostDomain = "meroedu.io"
	Expect(env.MultiTenantDomain()).Equals(".meroedu.io")
}

func TestSubdomain(t *testing.T) {
	RegisterT(t)

	Expect(env.Subdomain("demo.test.meroeducdn.com")).Equals("")

	env.Config.CDN.Host = "test.meroeducdn.com:3000"

	Expect(env.Subdomain("demo.test.meroedu.io")).Equals("demo")
	Expect(env.Subdomain("demo.test.meroeducdn.com")).Equals("demo")
	Expect(env.Subdomain("test.meroedu.io")).Equals("")
	Expect(env.Subdomain("test.meroeducdn.com")).Equals("")
	Expect(env.Subdomain("helloworld.com")).Equals("")

	env.Config.HostMode = "single"

	Expect(env.Subdomain("demo.test.meroedu.io")).Equals("")
	Expect(env.Subdomain("demo.test.meroeducdn.com")).Equals("")
	Expect(env.Subdomain("test.meroedu.io")).Equals("")
	Expect(env.Subdomain("test.meroeducdn.com")).Equals("")
	Expect(env.Subdomain("helloworld.com")).Equals("")
}
