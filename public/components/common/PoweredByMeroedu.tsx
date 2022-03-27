import React from "react"
import { useMeroedu } from "@meroedu/hooks"
import { classSet } from "@meroedu/services"

import "./PoweredByMeroedu.scss"

interface PoweredByMeroeduProps {
  slot: string
  className?: string
}

export const PoweredByMeroedu = (props: PoweredByMeroeduProps) => {
  const meroedu = useMeroedu()

  const source = encodeURIComponent(meroedu.session.tenant.subdomain)
  const medium = "powered-by"
  const campaign = props.slot

  const className = classSet({
    "c-powered": true,
    [props.className || ""]: props.className,
  })

  return (
    <div className={className}>
      <a rel="noopener" href={`https://meroedu.io?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`} target="_blank">
        Powered by Meroedu
      </a>
    </div>
  )
}
