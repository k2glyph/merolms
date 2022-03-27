import React, { useState } from "react"
import { Tag, Post } from "@meroedu/models"
import { actions } from "@meroedu/services"
import { ShowTag, Icon } from "@meroedu/components"
import { TagListItem } from "./TagListItem"
import { useMeroedu } from "@meroedu/hooks"

import IconPencilAlt from "@meroedu/assets/images/heroicons-pencil-alt.svg"
import IconCheckCircle from "@meroedu/assets/images/heroicons-check-circle.svg"
import { HStack, VStack } from "@meroedu/components/layout"
import { Trans } from "@lingui/macro"

interface TagsPanelProps {
  post: Post
  tags: Tag[]
}

export const TagsPanel = (props: TagsPanelProps) => {
  const meroedu = useMeroedu()
  const canEdit = meroedu.session.isAuthenticated && meroedu.session.user.isCollaborator && props.tags.length > 0

  const [isEditing, setIsEditing] = useState(false)
  const [assignedTags, setAssignedTags] = useState(props.tags.filter((t) => props.post.tags.indexOf(t.slug) >= 0))

  const assignOrUnassignTag = async (tag: Tag) => {
    const idx = assignedTags.indexOf(tag)
    let nextAssignedTags: Tag[] = []

    if (idx >= 0) {
      const response = await actions.unassignTag(tag.slug, props.post.number)
      if (response.ok) {
        nextAssignedTags = [...assignedTags]
        nextAssignedTags.splice(idx, 1)
      }
    } else {
      const response = await actions.assignTag(tag.slug, props.post.number)
      if (response.ok) {
        nextAssignedTags = [...assignedTags, tag]
      }
    }

    setAssignedTags(nextAssignedTags)
  }

  const onSubtitleClick = () => {
    if (canEdit) {
      setIsEditing(!isEditing)
    }
  }

  if (!canEdit && assignedTags.length === 0) {
    return null
  }

  const tagsList =
    assignedTags.length > 0 ? (
      <VStack spacing={2} className="flex-items-baseline">
        {assignedTags.map((tag) => (
          <ShowTag key={tag.id} tag={tag} link />
        ))}
      </VStack>
    ) : (
      <span className="text-muted">
        <Trans id="label.none">None</Trans>
      </span>
    )

  const editTagsList = props.tags.length > 0 && (
    <VStack>
      {props.tags.map((tag) => (
        <TagListItem key={tag.id} tag={tag} assigned={assignedTags.indexOf(tag) >= 0} onClick={assignOrUnassignTag} />
      ))}
    </VStack>
  )

  const icon = canEdit && (isEditing ? <Icon sprite={IconCheckCircle} className="h-4" /> : <Icon sprite={IconPencilAlt} className="h-4" />)

  if (meroedu.isReadOnly) {
    return (
      <VStack>
        <HStack spacing={2} className="text-category">
          <Trans id="label.tags">Tags</Trans>
        </HStack>
        {tagsList}
      </VStack>
    )
  }

  return (
    <VStack>
      <HStack spacing={2} className="text-category clickable" onClick={onSubtitleClick}>
        <span>
          <Trans id="label.tags">Tags</Trans>
        </span>
        {icon}
      </HStack>

      {!isEditing && tagsList}
      {isEditing && editTagsList}
    </VStack>
  )
}
