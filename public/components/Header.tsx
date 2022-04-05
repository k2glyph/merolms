import React, { useState } from "react"
import { SignInModal, NotificationIndicator, UserMenu } from "@meroedu/components"
import { useMeroedu } from "@meroedu/hooks"
import { HStack } from "./layout"
import { Trans } from "@lingui/macro"
import AppBar from "@mui/material/AppBar"
import { Box, Toolbar, Typography } from "@mui/material"

export const Header = () => {
  const meroedu = useMeroedu()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const showModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSignInModalOpen(true)
  }

  const hideModal = () => setIsSignInModalOpen(false)

  return (
    <>
      <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 0.15, display: { xs: "none", md: "flex" } }} />
          <Typography variant="h6" noWrap component="div">
            {meroedu.session.tenant.name}
          </Typography>
          <Box sx={{ flexGrow: 0.7, display: { xs: "none", md: "flex" } }} />

          <Box sx={{ flexGrow: 0 }}>
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
          </Box>
        </Toolbar>

        <SignInModal isOpen={isSignInModalOpen} onClose={hideModal} />
      </AppBar>
    </>
  )
}
