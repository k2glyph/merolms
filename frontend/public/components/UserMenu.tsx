import React from "react"
import { useMeroedu } from "@meroedu/hooks"
import { Avatar, Dropdown } from "./common"
import { Trans } from "@lingui/macro"

export const UserMenu = () => {
  const meroedu = useMeroedu()

  return (
    <div className="c-menu-user">
      <Dropdown position="left" renderHandle={<Avatar user={meroedu.session.user} />}>
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
