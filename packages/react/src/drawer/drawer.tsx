"use client"

import type { ComponentProps } from "react"
import {
  Drawer,
  DrawerBackdrop as UiDrawerBackdrop,
  DrawerClose as UiDrawerClose,
  DrawerContent as UiDrawerContent,
  DrawerDescription as UiDrawerDescription,
  DrawerTitle as UiDrawerTitle,
  DrawerTrigger as UiDrawerTrigger,
} from "@ui-sdk/react/drawer"

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

function DrawerTrigger(props: ComponentProps<typeof UiDrawerTrigger>) {
  return <UiDrawerTrigger {...props} className={join("hashti-drawer-trigger", props.className)} />
}

function DrawerBackdrop(props: ComponentProps<typeof UiDrawerBackdrop>) {
  return <UiDrawerBackdrop {...props} className={join("hashti-drawer-backdrop", props.className)} />
}

function DrawerContent(props: ComponentProps<typeof UiDrawerContent>) {
  return <UiDrawerContent {...props} className={join("hashti-drawer-content", props.className)} />
}

function DrawerTitle(props: ComponentProps<typeof UiDrawerTitle>) {
  return <UiDrawerTitle {...props} className={join("hashti-drawer__title", props.className)} />
}

function DrawerDescription(props: ComponentProps<typeof UiDrawerDescription>) {
  return (
    <UiDrawerDescription {...props} className={join("hashti-drawer__description", props.className)} />
  )
}

function DrawerClose(props: ComponentProps<typeof UiDrawerClose>) {
  return <UiDrawerClose {...props} className={join("hashti-drawer-close", props.className)} />
}

export {
  Drawer,
  DrawerTrigger,
  DrawerBackdrop,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
}
