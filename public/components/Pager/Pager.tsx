import React, { ReactNode } from "react"
import SidebarLayout from "@meroedu/layouts/SidebarLayout"

export interface PagerProps {
  children?: ReactNode
}
const Pager: React.FC<PagerProps> = ({ children }) => {
  // const navItems = [
  //   { name: "Dashboard", path: "/user/dashboard" },
  //   { name: "Courses", path: "/user/courses" },
  //   { name: "Learning Paths", path: "/user/learning_paths" },
  //   { name: "Events", path: "/user/events" },
  //   { name: "Forum", path: "/user/forum" },
  // ]
  return <SidebarLayout>{children}</SidebarLayout>
}

export default Pager
