import "./NotificationIndicator.scss"

import React, { useEffect, useState } from "react"
import IconBell from "@meroedu/assets/images/heroicons-bell.svg"
import { useMeroedu } from "@meroedu/hooks"
import { actions } from "@meroedu/services"
import { Icon } from "./common"

export const NotificationIndicator = () => {
  const meroedu = useMeroedu()
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    if (meroedu.session.isAuthenticated) {
      actions.getTotalUnreadNotifications().then((result) => {
        if (result.ok && result.data > 0) {
          setUnreadNotifications(result.data)
        }
      })
    }
  }, [meroedu.session.isAuthenticated])

  return (
    <a href="/notifications" className="c-notification-indicator">
      <Icon sprite={IconBell} className="h-6 text-gray-500" />
      {unreadNotifications > 0 && <div className="c-notification-indicator-unread-counter" />}
    </a>
  )
}
