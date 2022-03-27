import React, { useState, useRef } from "react"

import { Post, ImageUpload } from "@meroedu/models"
import { Avatar, UserName, Button, TextArea, Form, MultiImageUploader } from "@meroedu/components"
import { SignInModal } from "@meroedu/components"

import { cache, actions, Failure, Meroedu } from "@meroedu/services"
import { useMeroedu } from "@meroedu/hooks"
import { HStack } from "@meroedu/components/layout"
import { t, Trans } from "@lingui/macro"

interface CommentInputProps {
  post: Post
}

const CACHE_TITLE_KEY = "CommentInput-Comment-"

export const CommentInput = (props: CommentInputProps) => {
  const getCacheKey = () => `${CACHE_TITLE_KEY}${props.post.id}`

  const meroedu = useMeroedu()
  const inputRef = useRef<HTMLTextAreaElement>()
  const [content, setContent] = useState((meroedu.session.isAuthenticated && cache.session.get(getCacheKey())) || "")
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [attachments, setAttachments] = useState<ImageUpload[]>([])
  const [error, setError] = useState<Failure | undefined>(undefined)

  const commentChanged = (newContent: string) => {
    cache.session.set(getCacheKey(), newContent)
    setContent(newContent)
  }

  const hideModal = () => setIsSignInModalOpen(false)
  const clearError = () => setError(undefined)

  const submit = async () => {
    clearError()

    const result = await actions.createComment(props.post.number, content, attachments)
    if (result.ok) {
      cache.session.remove(getCacheKey())
      location.reload()
    } else {
      setError(result.error)
    }
  }

  const handleOnFocus = () => {
    if (!meroedu.session.isAuthenticated && inputRef.current) {
      inputRef.current.blur()
      setIsSignInModalOpen(true)
    }
  }

  return (
    <>
      <SignInModal isOpen={isSignInModalOpen} onClose={hideModal} />
      <HStack spacing={2} center={false} className="c-comment-input">
        {Meroedu.session.isAuthenticated && <Avatar user={Meroedu.session.user} />}
        <div className="flex-grow bg-gray-50 rounded-md p-2">
          <Form error={error}>
            {Meroedu.session.isAuthenticated && (
              <div className="mb-1">
                <UserName user={Meroedu.session.user} />
              </div>
            )}
            <TextArea
              placeholder={t({ id: "showpost.commentinput.placeholder", message: "Leave a comment" })}
              field="content"
              disabled={meroedu.isReadOnly}
              value={content}
              minRows={1}
              onChange={commentChanged}
              onFocus={handleOnFocus}
              inputRef={inputRef}
            />
            {content && (
              <>
                <MultiImageUploader field="attachments" maxUploads={2} onChange={setAttachments} />
                <Button variant="primary" onClick={submit}>
                  <Trans id="action.submit">Submit</Trans>
                </Button>
              </>
            )}
          </Form>
        </div>
      </HStack>
    </>
  )
}
