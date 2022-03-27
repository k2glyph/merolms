package query

import (
	"github.com/k2glyph/meroedu/app/models/entity"
)

type GetBillingState struct {
	// Output
	Result *entity.BillingState
}

type GetBillingSubscription struct {
	SubscriptionID string

	// Output
	Result *entity.BillingSubscription
}
