import React from "react"
import { Modal, Checkbox } from "@meroedu/components"
import { useMeroedu } from "@meroedu/hooks"
import { Trans } from "@lingui/macro"

interface LegalAgreementProps {
  onChange: (agreed: boolean) => void
}

export const TermsOfService = () => {
  const meroedu = useMeroedu()

  if (meroedu.settings.hasLegal) {
    return (
      <a href="/terms" className="text-link" target="_blank">
        <Trans id="legal.termsofservice">Terms of Service</Trans>
      </a>
    )
  }
  return null
}

export const PrivacyPolicy = () => {
  const meroedu = useMeroedu()

  if (meroedu.settings.hasLegal) {
    return (
      <a href="/privacy" className="text-link" target="_blank">
        <Trans id="legal.privacypolicy">Privacy Policy</Trans>
      </a>
    )
  }
  return null
}

export const LegalNotice = () => {
  const meroedu = useMeroedu()

  if (meroedu.settings.hasLegal) {
    return (
      <p className="text-muted">
        <Trans id="legal.notice">
          By signing in, you agree to the <PrivacyPolicy /> and <TermsOfService />.
        </Trans>
      </p>
    )
  }
  return null
}

export const LegalFooter = () => {
  const meroedu = useMeroedu()

  if (meroedu.settings.hasLegal) {
    return (
      <Modal.Footer align="center">
        <LegalNotice />
      </Modal.Footer>
    )
  }
  return null
}

export const LegalAgreement: React.FunctionComponent<LegalAgreementProps> = (props) => {
  const meroedu = useMeroedu()

  if (meroedu.settings.hasLegal) {
    return (
      <Checkbox field="legalAgreement" onChange={props.onChange}>
        <Trans id="legal.agreement">
          I have read and agree to the <PrivacyPolicy /> and <TermsOfService />.
        </Trans>
      </Checkbox>
    )
  }
  return null
}
