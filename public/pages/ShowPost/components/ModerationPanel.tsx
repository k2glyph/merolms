import React, { useState } from "react"
import { PostStatus, Post } from "@meroedu/models"
import { actions, navigator, Failure } from "@meroedu/services"
import { Form, Modal, Button, TextArea } from "@meroedu/components"
import { useMeroedu } from "@meroedu/hooks"
import { VStack } from "@meroedu/components/layout"
import { t, Trans } from "@lingui/macro"

interface ModerationPanelProps {
  post: Post
}

export const ModerationPanel = (props: ModerationPanelProps) => {
  const meroedu = useMeroedu()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [text, setText] = useState("")
  const [error, setError] = useState<Failure>()

  const hideModal = async () => setShowConfirmation(false)
  const showModal = async () => setShowConfirmation(true)

  const handleDelete = async () => {
    const response = await actions.deletePost(props.post.number, text)
    if (response.ok) {
      hideModal()
      navigator.goHome()
    } else if (response.error) {
      setError(response.error)
    }
  }

  const status = PostStatus.Get(props.post.status)
  if (!meroedu.session.isAuthenticated || !meroedu.session.user.isAdministrator || status.closed) {
    return null
  }

  const modal = (
    <Modal.Window isOpen={showConfirmation} onClose={hideModal} center={false} size="large">
      <Modal.Content>
        <Form error={error}>
          <TextArea
            field="text"
            onChange={setText}
            value={text}
            placeholder={t({ id: "showpost.moderationpanel.text.placeholder", message: "Why are you deleting this post? (optional)" })}
          >
            <span className="text-muted">
              <Trans id="showpost.moderationpanel.text.help">
                This operation <strong>cannot</strong> be undone.
              </Trans>
            </span>
          </TextArea>
        </Form>
      </Modal.Content>

      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          <Trans id="action.delete">Delete</Trans>
        </Button>
        <Button variant="tertiary" onClick={hideModal}>
          <Trans id="action.cancel">Cancel</Trans>
        </Button>
      </Modal.Footer>
    </Modal.Window>
  )

  return (
    <VStack>
      {modal}
      <span className="text-category">
        <Trans id="label.moderation">Moderation</Trans>
      </span>
      <Button disabled={meroedu.isReadOnly} variant="danger" size="small" className="w-full" onClick={showModal}>
        <Trans id="action.delete">Delete</Trans>
      </Button>
    </VStack>
  )
}
