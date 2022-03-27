package metrics

import (
	"github.com/k2glyph/meroedu/app/pkg/env"
	"github.com/prometheus/client_golang/prometheus"
)

var TotalTenants = prometheus.NewCounter(
	prometheus.CounterOpts{
		Name: "meroedu_tenants_total",
		Help: "Number of Meroedu tenants.",
	},
)

var TotalPosts = prometheus.NewCounter(
	prometheus.CounterOpts{
		Name: "meroedu_posts_total",
		Help: "Number of Meroedu posts.",
	},
)

var TotalComments = prometheus.NewCounter(
	prometheus.CounterOpts{
		Name: "meroedu_comments_total",
		Help: "Number of Meroedu comments.",
	},
)

var TotalVotes = prometheus.NewCounter(
	prometheus.CounterOpts{
		Name: "meroedu_votes_total",
		Help: "Number of Meroedu votes.",
	},
)

var meroeduInfo = prometheus.NewGauge(
	prometheus.GaugeOpts{
		Name:        "meroedu_info",
		Help:        "Information about Meroedu environment.",
		ConstLabels: prometheus.Labels{"version": env.Version()},
	},
)

func init() {
	meroeduInfo.Inc()
	prometheus.MustRegister(TotalTenants, TotalPosts, TotalComments, TotalVotes, meroeduInfo)
}
