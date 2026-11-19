"use client"

import type { ComponentProps } from "react"
import { Separator } from "@ui-sdk/react/separator"

function Divider({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator className={`hashti-divider${className ? ` ${className}` : ""}`} {...props} />
}

export { Divider }
