"use client"

import type { ComponentProps } from "react"
import { Switch as UiSwitch, SwitchThumb as UiSwitchThumb } from "@ui-sdk/react/switch"

type SwitchSize = "sm" | "md"

interface SwitchProps extends ComponentProps<typeof UiSwitch> {
  size?: SwitchSize
}

function Switch({ size, className, ...props }: SwitchProps) {
  return (
    <UiSwitch
      className={`hashti-switch${className ? ` ${className}` : ""}`}
      data-size={size}
      {...props}
    />
  )
}

function SwitchThumb({ className, ...props }: ComponentProps<typeof UiSwitchThumb>) {
  return <UiSwitchThumb className={`hashti-switch__thumb${className ? ` ${className}` : ""}`} {...props} />
}

export { Switch, SwitchThumb }
