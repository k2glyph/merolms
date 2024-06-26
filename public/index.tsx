import "@meroedu/assets/styles/index.scss"

import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import { ErrorBoundary, Loader, ReadOnlyNotice, DevBanner } from "@meroedu/components"
import { classSet, Meroedu, MeroeduContext, actions, activateI18N } from "@meroedu/services"

import { I18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { AsyncPage } from "./AsyncPages"
import Pager from "@meroedu/components/Pager/Pager"
import ThemeProvider from "@meroedu/theme/ThemeProvider"
import "nprogress/nprogress.css"
import { CssBaseline } from "@mui/material"
import { SidebarProvider } from "@meroedu/contexts/SidebarContext"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"

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
    <React.StrictMode>
      <ErrorBoundary onError={logProductionError}>
        <I18nProvider i18n={i18n}>
          <HelmetProvider>
            <MeroeduContext.Provider value={meroedu}>
              <ThemeProvider>
                <CssBaseline />
                <DevBanner />
                <ReadOnlyNotice />
                <Suspense fallback={<Loading />}>
                  <SidebarProvider>
                    <BrowserRouter>
                      {meroedu.session.isAuthenticated && <Pager>{React.createElement(component, meroedu.session.props)}</Pager>}
                      {!meroedu.session.isAuthenticated && React.createElement(component, meroedu.session.props)}
                    </BrowserRouter>
                  </SidebarProvider>
                </Suspense>
              </ThemeProvider>
            </MeroeduContext.Provider>
          </HelmetProvider>
        </I18nProvider>
      </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById("root")
  )
}

const meroedu = Meroedu.initialize()
__webpack_nonce__ = meroedu.session.contextID
__webpack_public_path__ = `${meroedu.settings.assetsURL}/assets/`
activateI18N(meroedu.currentLocale).then(bootstrapApp).catch(bootstrapApp)
