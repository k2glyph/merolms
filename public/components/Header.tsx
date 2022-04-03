import React, { useState } from "react"
import { SignInModal, TenantLogo, NotificationIndicator, UserMenu } from "@meroedu/components"
import { useMeroedu } from "@meroedu/hooks"
import { HStack } from "./layout"
import { Trans } from "@lingui/macro"
import AppBar from '@mui/material/AppBar';
import { Toolbar, Typography } from "@mui/material"

export const Header = () => {
  const meroedu = useMeroedu()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const showModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSignInModalOpen(true)
  }

  const hideModal = () => setIsSignInModalOpen(false)

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
          {meroedu.session.tenant.name}
          </Typography>
        </Toolbar>
      
      {/* <div id="c-header" className="header-bar"> */}
        <SignInModal isOpen={isSignInModalOpen} onClose={hideModal} />
        <HStack className="c-menu shadow p-2 w-full">
          <div className="container">
            <HStack justify="between">
              <a href="/" className="flex flex-x flex-items-center flex--spacing-2 h-8">
                <TenantLogo size={100} />
                <h1 className="text-title">{meroedu.session.tenant.name}</h1>
              </a>
              {meroedu.session.isAuthenticated && (
                <HStack spacing={2}>
                  <NotificationIndicator />
                  <UserMenu />
                </HStack>
              )}
              {!meroedu.session.isAuthenticated && (
                <a href="#" className="uppercase text-sm" onClick={showModal}>
                  <Trans id="action.signin">Sign in</Trans>
                </a>
              )}
            </HStack>
          </div>
        </HStack>
      {/* </div> */}
    </AppBar>
  )
}
