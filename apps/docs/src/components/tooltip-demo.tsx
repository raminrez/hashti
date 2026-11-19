"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@hashti/react"

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger>Share</TooltipTrigger>
      <TooltipContent>Anyone with the link can view</TooltipContent>
    </Tooltip>
  )
}
