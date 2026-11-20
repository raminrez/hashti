"use client"

import type { ComponentProps } from "react"
import {
  Toolbar as UiToolbar,
  ToolbarButton as UiToolbarButton,
  ToolbarGroup as UiToolbarGroup,
  ToolbarInput as UiToolbarInput,
  ToolbarLink as UiToolbarLink,
  ToolbarSeparator as UiToolbarSeparator,
} from "@ui-sdk/react/toolbar"

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

function Toolbar(props: ComponentProps<typeof UiToolbar>) {
  return <UiToolbar {...props} className={join("hashti-toolbar", props.className)} />
}

function ToolbarButton(props: ComponentProps<typeof UiToolbarButton>) {
  return (
    <UiToolbarButton {...props} className={join("hashti-toolbar-button", props.className)} />
  )
}

function ToolbarGroup(props: ComponentProps<typeof UiToolbarGroup>) {
  return <UiToolbarGroup {...props} className={join("hashti-toolbar-group", props.className)} />
}

function ToolbarSeparator(props: ComponentProps<typeof UiToolbarSeparator>) {
  return (
    <UiToolbarSeparator
      {...props}
      className={join("hashti-toolbar-separator", props.className)}
    />
  )
}

function ToolbarLink(props: ComponentProps<typeof UiToolbarLink>) {
  return <UiToolbarLink {...props} className={join("hashti-toolbar-link", props.className)} />
}

function ToolbarInput(props: ComponentProps<typeof UiToolbarInput>) {
  return <UiToolbarInput {...props} className={join("hashti-toolbar-input", props.className)} />
}

export { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator, ToolbarLink, ToolbarInput }
