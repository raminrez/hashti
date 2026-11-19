"use client"

import type { ComponentProps } from "react"
import { Label as UILabel } from "@ui-sdk/react/label"

function Label({ className, ...props }: ComponentProps<typeof UILabel>) {
  return <UILabel className={`hashti-label${className ? ` ${className}` : ""}`} {...props} />
}

export { Label }
