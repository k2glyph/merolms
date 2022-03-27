import "./Form.scss"

import React from "react"
import { Failure, classSet } from "@meroedu/services"
import { DisplayError } from "@meroedu/components"

interface ValidationContext {
  error?: Failure
}

interface FormProps {
  className?: string
  error?: Failure
}

export const ValidationContext = React.createContext<ValidationContext>({})

export const Form: React.FunctionComponent<FormProps> = (props) => {
  const className = classSet({
    "c-form": true,
    [props.className || ""]: props.className,
  })

  return (
    <form autoComplete="off" className={className}>
      <DisplayError error={props.error} />
      <ValidationContext.Provider value={{ error: props.error }}>{props.children}</ValidationContext.Provider>
    </form>
  )
}
