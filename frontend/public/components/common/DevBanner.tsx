import React from "react"
import { useMeroedu } from "@meroedu/hooks"

import "./DevBanner.scss"

export const DevBanner = () => {
  const meroedu = useMeroedu()

  if (meroedu.isProduction()) {
    return null
  }

  return <div className="c-dev-banner">DEV</div>
}
