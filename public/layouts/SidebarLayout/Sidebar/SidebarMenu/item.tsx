import "./SideMenu.scss"
import React, { FC, ReactNode, useState } from "react"
// import { NavLink as RouterLink } from "react-router-dom"
// import clsx from "clsx"
// import { SidebarContext } from "@meroedu/contexts/SidebarContext"

import PropTypes from "prop-types"
import { Button, Badge, Collapse, ListItem } from "@mui/material"

import ExpandLessTwoToneIcon from "@mui/icons-material/ExpandLessTwoTone"
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone"
import { classSet } from "@meroedu/services"

interface SidebarMenuItemProps {
  children?: ReactNode
  link?: string
  icon?: any
  badge?: string
  open?: boolean
  active?: boolean
  name: string
}

const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ children, link, icon: Icon, badge, open: openParent, active, name, ...rest }) => {
  // @ts-ignore
  const [menuToggle, setMenuToggle] = useState<boolean>(openParent)

  // const { toggleSidebar } = useContext(SidebarContext)

const className = classSet({
  "c-side-menu__item": true,
  "c-side-menu__item--active": active,
  "width": "100%"
})
  const toggleMenu = (): void => {
    setMenuToggle((Open) => !Open)
  }

  if (children) {
    return (
      <ListItem component="div" className="Mui-children " key={name} {...rest}>
        <Button
          className={className}
          startIcon={Icon && <Icon />}
          endIcon={menuToggle ? <ExpandLessTwoToneIcon /> : <ExpandMoreTwoToneIcon />}
          onClick={toggleMenu}
        >
          {name}
        </Button>
        <Collapse in={menuToggle}>{children}</Collapse>
      </ListItem>
    )
  }
  
  return (
    <ListItem component="div" key={name} {...rest}>
      <a href={link} className={className}>
        {name}
        {badge && <Badge badgeContent={badge} />}
      </a>
    </ListItem>
  )
}

SidebarMenuItem.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  link: PropTypes.string,
  icon: PropTypes.elementType,
  badge: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string.isRequired,
}

SidebarMenuItem.defaultProps = {
  open: false,
  active: false,
}

export default SidebarMenuItem
