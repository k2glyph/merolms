package web

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/k2glyph/meroedu/app/pkg/env"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func newMetricsServer(address string) *http.Server {
	mux := httprouter.New()
	mux.Handler("GET", "/metrics", promhttp.Handler())

	return &http.Server{
		ReadTimeout:  env.Config.HTTP.ReadTimeout,
		WriteTimeout: env.Config.HTTP.WriteTimeout,
		IdleTimeout:  env.Config.HTTP.IdleTimeout,
		Addr:         address,
		Handler:      mux,
	}
}
