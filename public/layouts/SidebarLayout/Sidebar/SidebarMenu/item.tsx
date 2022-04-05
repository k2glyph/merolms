import React, { FC, ReactNode, useState } from "react"
import clsx from "clsx"
// import { SidebarContext } from "@meroedu/contexts/SidebarContext"

import PropTypes from "prop-types"
import { Button, Collapse, ListItem } from "@mui/material"

import ExpandLessTwoToneIcon from "@mui/icons-material/ExpandLessTwoTone"
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone"

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
  const [menuToggle, setMenuToggle] = useState(openParent)

  // const { toggleSidebar } = useContext(SidebarContext)

  const toggleMenu = (): void => {
    setMenuToggle((Open) => !Open)
  }

  if (children) {
    return (
      <ListItem component="div" className="Mui-children" key={name} {...rest}>
        <Button
          className={clsx({ "Mui-active": menuToggle })}
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
      {/* <Button activeClassName="Mui-active"  onClick={toggleSidebar} to={link} startIcon={Icon && <Icon />}>
        {name}
        {badge && <Badge badgeContent={badge} />}
      </Button> */}
      <div>hello</div>
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
