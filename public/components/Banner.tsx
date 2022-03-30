import React from "react"
export interface BannerProps {
  title: string
}
export const Banner: React.FC<BannerProps> = ({ title }) => {
  return (
    <p className="text-7xl font-extrabold text-center" style={{ margin: "100px" }}>
      {title}
    </p>
  )
}
