import "./SideMenu.scss"

import React, { useState } from "react"
import { classSet } from "@meroedu/services"
import { Icon } from "@meroedu/components"
import { useMeroedu } from "@meroedu/hooks"
import IconX from "@meroedu/assets/images/heroicons-x.svg"
import IconMenu from "@meroedu/assets/images/heroicons-menu.svg"
import { VStack } from "@meroedu/components/layout"

interface SiteMenuProps {
  activeItem: string
  className?: string
}

interface SideMenuItemProps {
  name: string
  title: string
  isActive: boolean
  href: string
}

const SideMenuItem = (props: SideMenuItemProps) => {
  const className = classSet({
    "c-side-menu__item": true,
    "c-side-menu__item--active": props.isActive,
  })

  return (
    <a key={props.name} className={className} href={props.href}>
      {props.title}
    </a>
  )
}

export const SideMenu = (props: SiteMenuProps) => {
  const meroedu = useMeroedu()
  const activeItem = props.activeItem || "general"

  return (
    <div className="js-admin-menu sm:hidden md:hidden lg:block">
      <VStack spacing={0} className="c-side-menu rounded-md shadow">
        <SideMenuItem name="general" title="General" href="/admin" isActive={activeItem === "general"} />
        <SideMenuItem name="privacy" title="Privacy" href="/admin/privacy" isActive={activeItem === "privacy"} />
        <SideMenuItem name="members" title="Members" href="/admin/members" isActive={activeItem === "members"} />
        <SideMenuItem name="invitations" title="Invitations" href="/admin/invitations" isActive={activeItem === "invitations"} />
        <SideMenuItem name="authentication" title="Authentication" href="/admin/authentication" isActive={activeItem === "authentication"} />
        <SideMenuItem name="advanced" title="Advanced" href="/admin/advanced" isActive={activeItem === "advanced"} />
        {meroedu.session.user.isAdministrator && (
          <>
            {meroedu.settings.isBillingEnabled && <SideMenuItem name="billing" title="Billing" href="/admin/billing" isActive={activeItem === "billing"} />}
            {/* <SideMenuItem name="webhooks" title="Webhooks" href="/admin/webhooks" isActive={activeItem === "webhooks"} /> */}
          </>
        )}
      </VStack>
    </div>
  )
}

export const SideMenuToggler = () => {
  const [isActive, setIsActive] = useState(false)

  const toggle = () => {
    const classes = ["sm:hidden", "md:hidden"]
    const el = document.querySelector(".js-admin-menu") as HTMLElement
    if (el && !isActive) {
      el.classList.remove(...classes)
    } else if (el && isActive) {
      el.classList.add(...classes)
    }
    setIsActive(!isActive)
  }

  return (
    <div className="h-8 w-8 lg:hidden xl:hidden" onClick={toggle}>
      {isActive ? <Icon sprite={IconX} /> : <Icon sprite={IconMenu} />}
    </div>
  )
}
