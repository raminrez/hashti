"use client"

import type { ComponentProps } from "react"
import {
  Menu,
  MenuContent as UiMenuContent,
  MenuCheckboxItem as UiMenuCheckboxItem,
  MenuGroup as UiMenuGroup,
  MenuGroupLabel as UiMenuGroupLabel,
  MenuItem as UiMenuItem,
  MenuItemIcon as UiMenuItemIcon,
  MenuItemIndicator as UiMenuItemIndicator,
  MenuRadioGroup as UiMenuRadioGroup,
  MenuRadioItem as UiMenuRadioItem,
  MenuSeparator as UiMenuSeparator,
  MenuSub as UiMenuSub,
  MenuSubContent as UiMenuSubContent,
  MenuSubTrigger as UiMenuSubTrigger,
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

function MenuSubTrigger(props: ComponentProps<typeof UiMenuSubTrigger>) {
  return (
    <UiMenuSubTrigger
      {...props}
      className={join("hashti-menu-item hashti-menu-sub-trigger", props.className)}
    />
  )
}

function MenuSubContent(props: ComponentProps<typeof UiMenuSubContent>) {
  return <UiMenuSubContent {...props} className={join("hashti-menu-content", props.className)} />
}

function MenuCheckboxItem(props: ComponentProps<typeof UiMenuCheckboxItem>) {
  return (
    <UiMenuCheckboxItem
      {...props}
      className={join("hashti-menu-item hashti-menu-checkbox-item", props.className)}
    />
  )
}

function MenuItemIndicator(props: ComponentProps<typeof UiMenuItemIndicator>) {
  return (
    <UiMenuItemIndicator
      {...props}
      className={join("hashti-menu-item-indicator", props.className)}
    />
  )
}

function MenuRadioItem(props: ComponentProps<typeof UiMenuRadioItem>) {
  return (
    <UiMenuRadioItem
      {...props}
      className={join("hashti-menu-item hashti-menu-radio-item", props.className)}
    />
  )
}

function MenuItemIcon(props: ComponentProps<typeof UiMenuItemIcon>) {
  return <UiMenuItemIcon {...props} className={join("hashti-menu-item-icon", props.className)} />
}

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  UiMenuSub as MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  MenuCheckboxItem,
  MenuItemIndicator,
  MenuItemIcon,
  UiMenuRadioGroup as MenuRadioGroup,
  MenuRadioItem,
}
