package web

import (
	"context"
	"crypto/tls"
	"testing"

	"github.com/k2glyph/meroedu/app/pkg/bus"
	"github.com/k2glyph/meroedu/app/pkg/env"
	"github.com/k2glyph/meroedu/app/services/blob/fs"

	. "github.com/k2glyph/meroedu/app/pkg/assert"
)

func TestGetCertificate(t *testing.T) {
	RegisterT(t)

	var testCases = []struct {
		mode       string
		cert       string
		serverName string
	}{
		{"multi", "all-test-meroedu-io", ""},
		{"multi", "all-test-meroedu-io", "meroedu"},
		{"multi", "all-test-meroedu-io", "feedback.test.meroedu.io"},
		{"multi", "all-test-meroedu-io", "FEEDBACK.test.meroedu.io"},
		{"single", "test-meroedu-io", "test.meroedu.io"},
		{"single", "test-meroedu-io", "meroedu.io"},
	}

	for _, testCase := range testCases {
		env.Config.HostMode = testCase.mode
		certFile := env.Path("/app/pkg/web/testdata/" + testCase.cert + ".crt")
		keyFile := env.Path("/app/pkg/web/testdata/" + testCase.cert + ".key")
		wildcardCert, _ := tls.LoadX509KeyPair(certFile, keyFile)

		manager, err := NewCertificateManager(context.Background(), certFile, keyFile)
		Expect(err).IsNil()
		cert, err := manager.GetCertificate(&tls.ClientHelloInfo{
			ServerName: testCase.serverName,
		})

		Expect(err).IsNil()
		Expect(cert.Certificate).Equals(wildcardCert.Certificate)
	}
}

func TestGetCertificate_WhenCNAMEAreInvalid(t *testing.T) {
	RegisterT(t)
	bus.Init(fs.Service{})
	bus.AddHandler(mockIsCNAMEAvailable)

	manager, err := NewCertificateManager(context.Background(), "", "")
	Expect(err).IsNil()

	invalidServerNames := []string{"feedback.heyworld.com", "2.2.2.2"}

	for _, serverName := range invalidServerNames {
		cert, err := manager.GetCertificate(&tls.ClientHelloInfo{
			ServerName: serverName,
		})
		Expect(err.Error()).ContainsSubstring(`no tenants found with cname ` + serverName)
		Expect(cert).IsNil()
	}
}

func TestGetCertificate_ServerNameMatchesCertificate_ShouldReturnIt(t *testing.T) {
	RegisterT(t)
	bus.Init(fs.Service{})
	bus.AddHandler(mockIsCNAMEAvailable)

	certFile := env.Etc("dev-meroedu-io.crt")
	certKey := env.Etc("dev-meroedu-io.key")
	manager, err := NewCertificateManager(context.Background(), certFile, certKey)
	Expect(err).IsNil()

	serverNames := []string{"dev.meroedu.io", "feedback.dev.meroedu.io", "anything.dev.meroedu.io", "IDEAS.DEV.meroedu.io", ".feedback.DEV.meroedu.io"}

	for _, serverName := range serverNames {
		cert, err := manager.GetCertificate(&tls.ClientHelloInfo{
			ServerName: serverName,
		})
		Expect(err).IsNil()
		Expect(cert).IsNotNil()
	}
}

func TestGetCertificate_ServerNameDoesntMatchCertificate_ButEndsWithHostName_ShouldThrow(t *testing.T) {
	RegisterT(t)
	bus.Init(fs.Service{})
	bus.AddHandler(mockIsCNAMEAvailable)

	env.Config.HostDomain = "dev.meroedu.io"
	certFile := env.Etc("dev-meroedu-io.crt")
	certKey := env.Etc("dev-meroedu-io.key")
	manager, err := NewCertificateManager(context.Background(), certFile, certKey)
	Expect(err).IsNil()

	serverNames := []string{"sub.feedback.dev.meroedu.io"}

	for _, serverName := range serverNames {
		cert, err := manager.GetCertificate(&tls.ClientHelloInfo{
			ServerName: serverName,
		})
		Expect(err.Error()).ContainsSubstring("invalid ServerName used: " + serverName)
		Expect(cert).IsNil()
	}
}
