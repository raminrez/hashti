"use client"

import type { ComponentProps } from "react"
import {
  TriggerMenu,
  TriggerMenuContent as UiTriggerMenuContent,
  TriggerMenuEmpty as UiTriggerMenuEmpty,
  TriggerMenuInput as UiTriggerMenuInput,
  TriggerMenuItem as UiTriggerMenuItem,
  TriggerMenuList as UiTriggerMenuList,
  TriggerMenuStatus as UiTriggerMenuStatus,
} from "@ui-sdk/react/trigger-menu"

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

// The root renders no element of its own, so there is no class to add.
function TriggerMenuInput(props: ComponentProps<typeof UiTriggerMenuInput>) {
  return (
    <UiTriggerMenuInput
      {...props}
      className={join("hashti-trigger-menu-input", props.className)}
    />
  )
}

function TriggerMenuStatus(props: ComponentProps<typeof UiTriggerMenuStatus>) {
  return (
    <UiTriggerMenuStatus
      {...props}
      className={join("hashti-trigger-menu__status", props.className)}
    />
  )
}

function TriggerMenuContent(props: ComponentProps<typeof UiTriggerMenuContent>) {
  return (
    <UiTriggerMenuContent
      {...props}
      className={join("hashti-trigger-menu-content", props.className)}
    />
  )
}

function TriggerMenuList(props: ComponentProps<typeof UiTriggerMenuList>) {
  return (
    <UiTriggerMenuList
      {...props}
      className={join("hashti-trigger-menu-list", props.className)}
    />
  )
}

function TriggerMenuItem(props: ComponentProps<typeof UiTriggerMenuItem>) {
  return (
    <UiTriggerMenuItem
      {...props}
      className={join("hashti-trigger-menu-item", props.className)}
    />
  )
}

function TriggerMenuEmpty(props: ComponentProps<typeof UiTriggerMenuEmpty>) {
  return (
    <UiTriggerMenuEmpty
      {...props}
      className={join("hashti-trigger-menu-empty", props.className)}
    />
  )
}

export {
  TriggerMenu,
  TriggerMenuInput,
  TriggerMenuStatus,
  TriggerMenuContent,
  TriggerMenuList,
  TriggerMenuItem,
  TriggerMenuEmpty,
}
