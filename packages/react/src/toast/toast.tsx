"use client"

import type { ComponentProps } from "react"
import {
  Toast as UiToast,
  ToastAction as UiToastAction,
  ToastClose as UiToastClose,
  ToastDescription as UiToastDescription,
  ToastRegion as UiToastRegion,
  ToastTitle as UiToastTitle,
} from "@ui-sdk/react/toast"

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

function ToastRegion(props: ComponentProps<typeof UiToastRegion>) {
  return <UiToastRegion {...props} className={join("hashti-toast-region", props.className)} />
}

function Toast(props: ComponentProps<typeof UiToast>) {
  return <UiToast {...props} className={join("hashti-toast", props.className)} />
}

function ToastTitle(props: ComponentProps<typeof UiToastTitle>) {
  return <UiToastTitle {...props} className={join("hashti-toast__title", props.className)} />
}

function ToastDescription(props: ComponentProps<typeof UiToastDescription>) {
  return (
    <UiToastDescription {...props} className={join("hashti-toast__description", props.className)} />
  )
}

function ToastAction(props: ComponentProps<typeof UiToastAction>) {
  return <UiToastAction {...props} className={join("hashti-toast-action", props.className)} />
}

function ToastClose(props: ComponentProps<typeof UiToastClose>) {
  return <UiToastClose {...props} className={join("hashti-toast-close", props.className)} />
}

export { Toast, ToastAction, ToastClose, ToastDescription, ToastRegion, ToastTitle }
export { toast } from "@ui-sdk/react/toast"
