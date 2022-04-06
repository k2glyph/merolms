import React, { useState } from "react"
import { useContext } from "react"

import { Box, IconButton, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone"
import { SidebarContext } from "@meroedu/contexts/SidebarContext"
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone"
// import Logo from "@meroedu/components/Logo"
import { Trans } from "@lingui/macro"
import { NotificationIndicator, SignInModal, TenantLogo, UserMenu } from "@meroedu/components"
import { useMeroedu } from "@meroedu/hooks"

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 5;
        background-color: ${theme.header.background};
        box-shadow: ${theme.header.boxShadow};
        position: fixed;
        justify-content: space-between;
        width: 100%;
       
`
)
// @media (min-width: ${theme.breakpoints.values.lg}px) {
//   left: ${theme.sidebar.width};
//   width: auto;
// }
function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext)
  const meroedu = useMeroedu()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const showModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSignInModalOpen(true)
  }

  const hideModal = () => setIsSignInModalOpen(false)

  return (
    <HeaderWrapper display="flex" alignItems="center">
      <Box display="flex" alignItems="center">
        <Tooltip arrow title="Toggle Menu">
          <IconButton color="primary" onClick={toggleSidebar}>
            {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
          </IconButton>
        </Tooltip>
        <TenantLogo size={100} />
        <a href="/" className="flex flex-x flex-items-center flex--spacing-2 h-8">
          <Typography variant="h3" noWrap component="div">
            {meroedu.session.tenant.name}
          </Typography>
        </a>
      </Box>
      <Box display="flex" alignItems="center">
        {meroedu.session.isAuthenticated && (
          <>
            <Box sx={{ mr: 1 }}>
              <NotificationIndicator />
            </Box>
            <UserMenu />
          </>
        )}
        {!meroedu.session.isAuthenticated && (
          <a href="#" className="uppercase text-sm" onClick={showModal}>
            <Trans id="action.signin">Sign in</Trans>
          </a>
        )}
      </Box>
      <SignInModal isOpen={isSignInModalOpen} onClose={hideModal} />
    </HeaderWrapper>
  )
}

export default Header
