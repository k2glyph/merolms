import React, { useEffect, useState } from "react"
import { SignInControl, Modal, Button, DisplayError, Form, Input, Message, LegalAgreement } from "@meroedu/components"
import { jwt, actions, Failure, querystring, Meroedu } from "@meroedu/services"
import { Divider } from "@meroedu/components/layout"
import { useMeroedu } from "@meroedu/hooks"

interface OAuthUser {
  token: string
  name: string
  email: string
}

interface SubdomainState {
  name: string
  isAvailable: boolean
  message: string
}

const SignUpPage = () => {
  const meroedu = useMeroedu()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLegalAgreed, setIsLegalAgreed] = useState(false)
  const [tenantName, setTenantName] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [subdomain, setSubdomain] = useState<SubdomainState>({ name: "", isAvailable: false, message: "" })
  const [error, setError] = useState<Failure | undefined>()

  let user: OAuthUser | undefined
  const token = querystring.get("token")
  if (token) {
    const data = jwt.decode(token)
    if (data) {
      user = {
        token,
        name: data["oauth/name"],
        email: data["oauth/email"],
      }
    }
  }

  const confirm = async () => {
    const result = await actions.createTenant({
      token: user && user.token,
      legalAgreement: isLegalAgreed,
      tenantName: tenantName,
      subdomain: subdomain.name,
      name: userName,
      email: userEmail,
    })

    if (result.ok) {
      if (user) {
        if (meroedu.isSingleHostMode()) {
          location.reload()
        } else {
          let baseURL = `${location.protocol}//${subdomain.name}${meroedu.settings.domain}`
          if (location.port) {
            baseURL = `${baseURL}:${location.port}`
          }

          location.href = baseURL
        }
      } else {
        setIsSubmitted(true)
      }
    } else if (result.error) {
      setError(result.error)
      setIsSubmitted(false)
    }
  }

  const setSubdomainName = (value: string) => {
    setSubdomain({
      name: value,
      isAvailable: false,
      message: "",
    })
  }

  let timer: number | undefined
  useEffect(() => {
    setSubdomain({
      ...subdomain,
      isAvailable: false,
      message: "",
    })

    if (subdomain.name != "") {
      timer = window.setTimeout(() => {
        actions.checkAvailability(subdomain.name).then((result) => {
          setSubdomain({
            ...subdomain,
            isAvailable: !result.data.message,
            message: result.data.message,
          })
        })
      }, 500)
    }
    return () => {
      window.clearTimeout(timer)
    }
  }, [subdomain.name])

  const noop = () => {
    // do nothing
  }

  const modal = (
    <Modal.Window canClose={false} isOpen={isSubmitted} onClose={noop}>
      <Modal.Header>Thank you for registering!</Modal.Header>
      <Modal.Content>
        <p>
          We have just sent a confirmation link to <b>{userEmail}</b>.
        </p>
        <p>Click the link to complete the registration.</p>
      </Modal.Content>
    </Modal.Window>
  )

  return (
    <div id="p-signup" className="page container w-max-6xl">
      {modal}
      <div className="h-20 text-center mb-4">
        <img className="logo" alt="Logo" src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" />
      </div>
    
      <h3 className="text-display mb-2">1. Who are you?</h3>
      <DisplayError fields={["token"]} error={error} />

      {user ? (
        <p>
          Hello, <b>{user.name}</b> {user.email && `(${user.email})`}
        </p>
      ) : (
        <>
          <p>We need to identify you to setup your new Meroedu account.</p>
          <SignInControl useEmail={false} />
          <Divider />
          <Form error={error}>
            <Input field="name" maxLength={100} onChange={setUserName} placeholder="Name" />
            <Input field="email" maxLength={200} onChange={setUserEmail} placeholder="Email" />
          </Form>
        </>
      )}

      <h3 className="text-display mb-2 mt-8">2. What is your Company or Product Name?</h3>

      <Form error={error} className="mb-8">
        <Input field="tenantName" maxLength={60} onChange={setTenantName} placeholder="Your company or product name" />
        {!Meroedu.isSingleHostMode() && (
          <Input field="subdomain" maxLength={40} onChange={setSubdomainName} placeholder="subdomain" suffix={meroedu.settings.domain}>
            {subdomain.isAvailable && (
              <Message className="mt-2" type="success" showIcon={true}>
                This subdomain is available!
              </Message>
            )}
            {subdomain.message && (
              <Message className="mt-2" type="error" showIcon={true}>
                {subdomain.message}
              </Message>
            )}
          </Input>
        )}

        <div className="mt-4">
          <LegalAgreement onChange={setIsLegalAgreed} />
        </div>
      </Form>

      <Button variant="primary" size="large" onClick={confirm}>
        Confirm
      </Button>
      {meroedu.settings.isBillingEnabled && <div className="mt-2 text-muted">Your trial starts today and ends in 15 days.</div>}
    </div>
  )
}

export default SignUpPage
