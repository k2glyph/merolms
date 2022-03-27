import React from "react"
import { Tag } from "@meroedu/models"
import { Icon, ShowTag } from "@meroedu/components"
import IconCheck from "@meroedu/assets/images/heroicons-check.svg"
import { HStack } from "@meroedu/components/layout"

interface TagListItemProps {
  tag: Tag
  assigned: boolean
  onClick: (tag: Tag) => void
}

export const TagListItem = (props: TagListItemProps) => {
  const onClick = () => {
    props.onClick(props.tag)
  }

  return (
    <HStack className="clickable hover:bg-gray-100 rounded py-1" onClick={onClick}>
      <Icon sprite={IconCheck} className={`h-4 text-green-600 ${!props.assigned && "invisible"}`} />
      <ShowTag tag={props.tag} circular />
      <span>{props.tag.name}</span>
    </HStack>
  )
}
