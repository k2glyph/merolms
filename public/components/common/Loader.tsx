import "./Loader.scss"

import React, { useState } from "react"
import { useTimeout } from "@meroedu/hooks"
import { classSet } from "@meroedu/services"

interface LoaderProps {
  text?: string
  className?: string
}

export function Loader(props: LoaderProps) {
  const [show, setShow] = useState(false)

  useTimeout(() => {
    setShow(true)
  }, 500)

  const className = classSet({
    "c-loader": true,
    [props.className || ""]: props.className,
  })

  return show ? (
    <div className={className}>
      <div className="c-loader__spinner" />
      {props.text && <span className="c-loader__text">{props.text}</span>}
    </div>
  ) : null
}
