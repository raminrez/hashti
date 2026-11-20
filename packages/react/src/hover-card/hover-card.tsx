"use client"

import type { ComponentProps } from "react"
import { join } from "@hashti/utils"
import {
  HoverCard,
  HoverCardContent as UiHoverCardContent,
  HoverCardTrigger as UiHoverCardTrigger,
} from "@ui-sdk/react/hover-card"


function HoverCardTrigger(props: ComponentProps<typeof UiHoverCardTrigger>) {
  return (
    <UiHoverCardTrigger {...props} className={join("hashti-hover-card-trigger", props.className)} />
  )
}

function HoverCardContent(props: ComponentProps<typeof UiHoverCardContent>) {
  return (
    <UiHoverCardContent {...props} className={join("hashti-hover-card-content", props.className)} />
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
