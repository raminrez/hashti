"use client"

import type { ComponentProps } from "react"
import { Button as UiButton } from "@ui-sdk/react/button"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "danger"
  | "danger-tertiary"
  | "danger-ghost"

type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ComponentProps<typeof UiButton> {
  variant?: ButtonVariant
  size?: ButtonSize
}

function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <UiButton
      className={`hashti-button${className ? ` ${className}` : ""}`}
      data-variant={variant}
      data-size={size}
      {...props}
    />
  )
}

export { Button }
