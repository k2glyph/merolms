import React from "react"
import { useMeroedu } from "@meroedu/hooks"
import { Message } from "./common"

export const ReadOnlyNotice = () => {
  const meroedu = useMeroedu()
  if (!meroedu.isReadOnly) {
    return null
  }

  if (meroedu.session.isAuthenticated && meroedu.session.user.isAdministrator) {
    return (
      <Message alignment="center" type="warning">
        This website is currently in read-only mode because there is no active subscription. Visit{" "}
        <a className="text-link" href="/admin/billing">
          Billing
        </a>{" "}
        to subscribe.
      </Message>
    )
  }

  return (
    <Message alignment="center" type="warning">
      This website is currently in read-only mode.
    </Message>
  )
}
