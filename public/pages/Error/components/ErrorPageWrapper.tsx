import React from "react"
import { TenantLogo } from "@meroedu/components"
import { useMeroedu } from "@meroedu/hooks"
import { Trans } from "@lingui/macro"

interface ErrorPageWrapperProps {
  id: string
  showHomeLink: boolean
  children?: React.ReactNode
}

export const ErrorPageWrapper = (props: ErrorPageWrapperProps) => {
  const meroedu = useMeroedu()

  return (
    <>
      {meroedu.session.tenant && true}
      <div id={props.id} className="container page">
        <div className="w-max-7xl mx-auto text-center mt-8">
          <div className="h-20 mb-4">
            <TenantLogo size={100} useMeroeduIfEmpty={true} />
          </div>
          {props.children}
          {props.showHomeLink && meroedu.session.tenant && (
            <p>
              <Trans id="page.backhome">
                Take me back to{" "}
                <a className="text-link" href={meroedu.settings.baseURL}>
                  {meroedu.settings.baseURL}
                </a>{" "}
                home page.
              </Trans>
            </p>
          )}
        </div>
      </div>
    </>
  )
}
