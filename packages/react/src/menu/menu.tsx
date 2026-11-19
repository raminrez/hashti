"use client"

import type { ComponentProps } from "react"
import {
  Menu,
  MenuContent as UiMenuContent,
  MenuGroup as UiMenuGroup,
  MenuGroupLabel as UiMenuGroupLabel,
  MenuItem as UiMenuItem,
  MenuSeparator as UiMenuSeparator,
  MenuTrigger as UiMenuTrigger,
} from "@ui-sdk/react/menu"

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

function MenuTrigger(props: ComponentProps<typeof UiMenuTrigger>) {
  return <UiMenuTrigger {...props} className={join("hashti-menu-trigger", props.className)} />
}

function MenuContent(props: ComponentProps<typeof UiMenuContent>) {
  return <UiMenuContent {...props} className={join("hashti-menu-content", props.className)} />
}

function MenuItem(props: ComponentProps<typeof UiMenuItem>) {
  return <UiMenuItem {...props} className={join("hashti-menu-item", props.className)} />
}

function MenuGroup(props: ComponentProps<typeof UiMenuGroup>) {
  return <UiMenuGroup {...props} className={join("hashti-menu-group", props.className)} />
}

function MenuGroupLabel(props: ComponentProps<typeof UiMenuGroupLabel>) {
  return <UiMenuGroupLabel {...props} className={join("hashti-menu__group-label", props.className)} />
}

function MenuSeparator(props: ComponentProps<typeof UiMenuSeparator>) {
  return <UiMenuSeparator {...props} className={join("hashti-menu-separator", props.className)} />
}

export { Menu, MenuTrigger, MenuContent, MenuItem, MenuGroup, MenuGroupLabel, MenuSeparator }
