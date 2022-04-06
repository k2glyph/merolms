import { ReactNode } from "react"

import DesignServicesTwoToneIcon from "@mui/icons-material/DesignServicesTwoTone"
// import BrightnessLowTwoToneIcon from "@mui/icons-material/BrightnessLowTwoTone"
// import MmsTwoToneIcon from "@mui/icons-material/MmsTwoTone"
import TableChartTwoToneIcon from "@mui/icons-material/TableChartTwoTone"
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone"

export interface MenuItem {
  link?: string
  icon?: ReactNode
  badge?: string
  items?: MenuItem[]
  name: string
}

export interface MenuItems {
  items: MenuItem[]
  heading: string
}

const menuItems: MenuItems[] = [
  {
    heading: "Home",
    items: [
      {
        name: "Home",
        link: "/",
        icon: DesignServicesTwoToneIcon,
      },
    ],
  },
  {
    heading: "Dashboard",
    items: [
      {
        name: "Dashboard",
        link: "/user/dashboard",
        icon: DesignServicesTwoToneIcon,
      },
    ],
  },
  {
    heading: "Learning",
    items: [
      {
        name: "Courses",
        icon: TableChartTwoToneIcon,
        link: "/user/courses",
      },
      {
        name: "Learning Paths",
        icon: TableChartTwoToneIcon,
        link: "/user/path",
      },
      {
        name: "Forum",
        icon: TableChartTwoToneIcon,
        link: "/user/forum",
      },
      {
        name: "User Profile",
        icon: AccountCircleTwoToneIcon,
        link: "/settings",
        items: [
          {
            name: "My Settings",
            link: "/settings",
          },
          {
            name: "Site Settings",
            link: "/admin",
          },
        ],
      },
    ],
  },
]

export default menuItems
