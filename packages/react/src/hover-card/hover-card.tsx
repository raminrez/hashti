"use client"

import type { ComponentProps } from "react"
import {
  HoverCard,
  HoverCardContent as UiHoverCardContent,
  HoverCardTrigger as UiHoverCardTrigger,
} from "@ui-sdk/react/hover-card"

const join = <State,>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined,
): string | ((state: State) => string | undefined) => {
  if (typeof className === "function") {
    return (state: State) => {
      const extra = className(state)
      return extra ? `${base} ${extra}` : base
    }
  }
  return className ? `${base} ${className}` : base
}

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
