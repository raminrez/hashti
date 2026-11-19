"use client"

import type { ComponentProps } from "react"
import {
  Tooltip,
  TooltipContent as UiTooltipContent,
  TooltipTrigger as UiTooltipTrigger,
} from "@ui-sdk/react/tooltip"

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

function TooltipTrigger(props: ComponentProps<typeof UiTooltipTrigger>) {
  return <UiTooltipTrigger {...props} className={join("hashti-tooltip-trigger", props.className)} />
}

function TooltipContent(props: ComponentProps<typeof UiTooltipContent>) {
  return <UiTooltipContent {...props} className={join("hashti-tooltip-content", props.className)} />
}

export { Tooltip, TooltipTrigger, TooltipContent }
