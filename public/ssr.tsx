/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Meroedu, MeroeduContext } from "./services/meroedu"
import { DevBanner, ReadOnlyNotice } from "./components"

import { activateI18NSync } from "./services"
import { I18nProvider } from "@lingui/react"

// Locale files must be bundled for SSR to work synchronously
const messages: { [key: string]: any } = {
  en: require(`../locale/en/client`),
  "pt-BR": require(`../locale/pt-BR/client`)
}

// ESBuild doesn't support Dynamic Imports, so we need to map them statically
// But at least only public routes will be here, as routes behind authentication won't be crawled anyway
const pages: { [key: string]: any } = {
  "Home/Home.page": require(`./pages/Home/Home.page`),
  "SignIn/SignIn.page": require(`./pages/SignIn/SignIn.page`),
  "SignUp/SignUp.page": require(`./pages/SignUp/SignUp.page`),
  "SignUp/PendingActivation.page": require(`./pages/SignUp/PendingActivation.page`),
  "Legal/Legal.page": require(`./pages/Legal/Legal.page`),
  "Error/Maintenance.page": require(`./pages/Error/Maintenance.page`),
  "Error/Error401.page": require(`./pages/Error/Error401.page`),
  "Error/Error403.page": require(`./pages/Error/Error403.page`),
  "Error/Error404.page": require(`./pages/Error/Error404.page`),
  "Error/Error410.page": require(`./pages/Error/Error410.page`),
  "Error/Error500.page": require(`./pages/Error/Error500.page`),
  "Error/NotInvited.page": require(`./pages/Error/NotInvited.page`),
}

function ssrRender(url: string, args: any) {
  const meroedu = Meroedu.initialize({ ...args })
  const i18n = activateI18NSync(meroedu.currentLocale, messages[meroedu.currentLocale].messages)
  const component = pages[meroedu.session.page]?.default
  if (!component) {
    throw new Error(`Page not found: ${meroedu.session.page}`)
  }

  window.location.href = url

  return renderToStaticMarkup(
    <I18nProvider i18n={i18n}>
      <MeroeduContext.Provider value={meroedu}>
        <DevBanner />
        <ReadOnlyNotice />
        {React.createElement(component, args.props)}
      </MeroeduContext.Provider>
    </I18nProvider>
  )
}

;(globalThis as any).ssrRender = ssrRender
