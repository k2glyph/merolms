import React from "react"
import { Icon } from "@meroedu/components"
import IconVisa from "@meroedu/assets/images/cc-visa.svg"
import IconAMEX from "@meroedu/assets/images/cc-amex.svg"
import IconDiners from "@meroedu/assets/images/cc-diners.svg"
import IconDiscover from "@meroedu/assets/images/cc-discover.svg"
import IconJCB from "@meroedu/assets/images/cc-jcb.svg"
import IconMaestro from "@meroedu/assets/images/cc-maestro.svg"
import IconMasterCard from "@meroedu/assets/images/cc-mastercard.svg"
import IconUnionPay from "@meroedu/assets/images/cc-unionpay.svg"
import IconGeneric from "@meroedu/assets/images/cc-generic.svg"
import { HStack } from "@meroedu/components/layout"

interface CardDetailsProps {
  cardType: string
  lastFourDigits: string
  expiryDate: string
}

const brands: { [key: string]: SpriteSymbol } = {
  visa: IconVisa,
  master: IconMasterCard,
  american_express: IconAMEX,
  discover: IconDiscover,
  jcb: IconJCB,
  maestro: IconMaestro,
  diners_club: IconDiners,
  unionpay: IconUnionPay,
}

export const CardDetails = (props: CardDetailsProps) => {
  const icon = brands[props.cardType] || IconGeneric

  return (
    <HStack>
      <Icon sprite={icon} className="h-6" />
      <span>{props.lastFourDigits}</span>
      <span>Exp. {props.expiryDate}</span>
    </HStack>
  )
}
