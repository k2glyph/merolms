import React, { ReactNode } from "react"

interface CardProps {
  title?: string
  description?: string
  image?: string
  isLink?: boolean
  url?: string
  isExternal?: boolean
  children?: ReactNode
}

const Card: React.FC<CardProps> = ({ title, description, image, isLink, url, isExternal, children }: CardProps) => {
  const content = (
    <>
      {image && <img src={image} className="object-cover h-48 w-96" />}
      <div className="px-6 py-4">
        {title && <h3 className="font-bold text-xl mb-2">{title}</h3>}
        {description && <div className="text-gray-700 text-base">{description}</div>}
      </div>
      {children}
    </>
  )

  return isLink ? (
    <div data-testid="card-element" className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <a href={url} target={isExternal ? "_blank" : ""} className="max-w-md" rel="noreferrer">
        {content}
      </a>
    </div>
  ) : (
    <div data-testid="card-element" className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      {content}
    </div>
  )
}

export default Card
