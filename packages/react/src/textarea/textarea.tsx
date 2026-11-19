"use client"

import type { ComponentProps } from "react"
import { Textarea as UiTextarea } from "@ui-sdk/react/textarea"

function Textarea({ className, ...props }: ComponentProps<typeof UiTextarea>) {
  return <UiTextarea className={`hashti-textarea${className ? ` ${className}` : ""}`} {...props} />
}

export { Textarea }
