import React, { ReactNode } from "react"
import SidebarLayout from "@meroedu/layouts/SidebarLayout"

export interface PagerProps {
  children?: ReactNode
}
const Pager: React.FC<PagerProps> = ({ children }) => {
  return <SidebarLayout>{children}</SidebarLayout>
}

export default Pager
