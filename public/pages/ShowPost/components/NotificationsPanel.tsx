import React, { useState } from "react"
import { Post } from "@meroedu/models"
import { Button, Icon } from "@meroedu/components"
import { actions } from "@meroedu/services"
import { useMeroedu } from "@meroedu/hooks"
import IconVolumeOn from "@meroedu/assets/images/heroicons-volume-on.svg"
import IconVolumeOff from "@meroedu/assets/images/heroicons-volume-off.svg"
import { VStack } from "@meroedu/components/layout"
import { Trans } from "@lingui/macro"

interface NotificationsPanelProps {
  post: Post
  subscribed: boolean
}

export const NotificationsPanel = (props: NotificationsPanelProps) => {
  const meroedu = useMeroedu()
  const [subscribed, setSubscribed] = useState(props.subscribed)

  const subscribeOrUnsubscribe = async () => {
    const action = subscribed ? actions.unsubscribe : actions.subscribe

    const response = await action(props.post.number)
    if (response.ok) {
      setSubscribed(!subscribed)
    }
  }

  if (!meroedu.session.isAuthenticated) {
    return null
  }

  const button = subscribed ? (
    <Button className="w-full" onClick={subscribeOrUnsubscribe} disabled={meroedu.isReadOnly}>
      <Icon sprite={IconVolumeOff} />{" "}
      <span>
        <Trans id="label.unsubscribe">Unsubscribe</Trans>
      </span>
    </Button>
  ) : (
    <Button className="w-full" onClick={subscribeOrUnsubscribe} disabled={meroedu.isReadOnly}>
      <Icon sprite={IconVolumeOn} />
      <span>
        <Trans id="label.subscribe">Subscribe</Trans>
      </span>
    </Button>
  )

  const text = subscribed ? (
    <span className="text-muted">
      <Trans id="showpost.notificationspanel.message.subscribed">You’re receiving notifications about activity on this post.</Trans>
    </span>
  ) : (
    <span className="text-muted">
      <Trans id="showpost.notificationspanel.message.unsubscribed">You&apos;ll not receive any notification about this post.</Trans>
    </span>
  )

  return (
    <VStack>
      <span className="text-category">
        <Trans id="label.notifications">Notifications</Trans>
      </span>
      {button}
      {text}
    </VStack>
  )
}
