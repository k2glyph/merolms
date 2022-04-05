import React, { FC } from "react"
import { useMeroedu } from "@meroedu/hooks"
import { Avatar as MeroAvatar, Dropdown } from "./common"
import { Trans } from "@lingui/macro"
import { Box, Button, Hidden, lighten, Typography } from "@mui/material"
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone"
import { styled } from "@mui/material/styles"

export const UserMenu = () => {
  const meroedu = useMeroedu()
  return (
    <div className="c-menu-user">
      <Dropdown position="left" renderHandle={<HeaderUserbox user={meroedu.session.user} />}>
        <div className="p-2 text-medium uppercase">{meroedu.session.user.name}</div>
        <Dropdown.ListItem href="/settings">
          <Trans id="menu.mysettings">My Settings</Trans>
        </Dropdown.ListItem>
        <Dropdown.Divider />

        {meroedu.session.user.isCollaborator && (
          <>
            <div className="p-2 text-medium uppercase">
              <Trans id="menu.administration">Administration</Trans>
            </div>
            <Dropdown.ListItem href="/admin">
              <Trans id="menu.sitesettings">Site Settings</Trans>
            </Dropdown.ListItem>
            <Dropdown.Divider />
          </>
        )}
        <Dropdown.ListItem href="/signout?redirect=/">
          <Trans id="menu.signout">Sign out</Trans>
        </Dropdown.ListItem>
      </Dropdown>
    </div>
  )
}
interface HeaderUserboxProps {
  user: any
}
const HeaderUserbox: FC<HeaderUserboxProps> = (props) => {
  return (
    <>
      <UserBoxButton color="secondary">
        <MeroAvatar user={props.user} />
        {/* <Avatar variant="rounded" alt={props.name} src={props.user.avatarURL} /> */}
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{props.user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">{props.user.role}</UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
    </>
  )
}
const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
)

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
)

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
)

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
)
