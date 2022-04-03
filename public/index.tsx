import "@meroedu/assets/styles/index.scss"

import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import { ErrorBoundary, Loader, ReadOnlyNotice, DevBanner } from "@meroedu/components"
import { classSet, Meroedu, MeroeduContext, actions, activateI18N } from "@meroedu/services"

import { I18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { AsyncPage } from "./AsyncPages"
import Pager from "@meroedu/components/Pager/Pager"

const Loading = () => (
  <div className="page">
    <Loader />
  </div>
)

const logProductionError = (err: Error) => {
  if (Meroedu.isProduction()) {
    console.error(err)
    actions.logError(`react.ErrorBoundary: ${err.message}`, err)
  }
}

window.addEventListener("unhandledrejection", (evt: PromiseRejectionEvent) => {
  if (evt.reason instanceof Error) {
    actions.logError(`window.unhandledrejection: ${evt.reason.message}`, evt.reason)
  } else if (evt.reason) {
    actions.logError(`window.unhandledrejection: ${evt.reason.toString()}`)
  }
})

window.addEventListener("error", (evt: ErrorEvent) => {
  if (evt.error && evt.colno > 0 && evt.lineno > 0) {
    actions.logError(`window.error: ${evt.message}`, evt.error)
  }
})

const bootstrapApp = (i18n: I18n) => {
  const component = AsyncPage(meroedu.session.page)
  document.body.className = classSet({
    "is-authenticated": meroedu.session.isAuthenticated,
    "is-staff": meroedu.session.isAuthenticated && meroedu.session.user.isCollaborator,
  })

  ReactDOM.render(
    <>
      <ErrorBoundary onError={logProductionError}>
        <I18nProvider i18n={i18n}>
          <MeroeduContext.Provider value={meroedu}>
            <DevBanner />
            <ReadOnlyNotice />
            <Suspense fallback={<Loading />}>
              <Pager>
                {React.createElement(component, meroedu.session.props)}
              </Pager>
            </Suspense>
          </MeroeduContext.Provider>
        </I18nProvider>
      </ErrorBoundary>
    </>,
    document.getElementById("root")
  )
}

const meroedu = Meroedu.initialize()
__webpack_nonce__ = meroedu.session.contextID
__webpack_public_path__ = `${meroedu.settings.assetsURL}/assets/`
activateI18N(meroedu.currentLocale).then(bootstrapApp).catch(bootstrapApp)
