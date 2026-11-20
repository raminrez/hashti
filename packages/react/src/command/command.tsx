"use client"

import type { ComponentProps } from "react"
import {
  Command as UiCommand,
  CommandEmpty as UiCommandEmpty,
  CommandGroup as UiCommandGroup,
  CommandGroupLabel as UiCommandGroupLabel,
  CommandInput as UiCommandInput,
  CommandItem as UiCommandItem,
  CommandList as UiCommandList,
  CommandSeparator as UiCommandSeparator,
} from "@ui-sdk/react/command"

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

function Command(props: ComponentProps<typeof UiCommand>) {
  return <UiCommand {...props} className={join("hashti-command", props.className)} />
}

function CommandInput(props: ComponentProps<typeof UiCommandInput>) {
  return (
    <UiCommandInput {...props} className={join("hashti-command-input", props.className)} />
  )
}

function CommandList(props: ComponentProps<typeof UiCommandList>) {
  return (
    <UiCommandList {...props} className={join("hashti-command-list", props.className)} />
  )
}

function CommandItem(props: ComponentProps<typeof UiCommandItem>) {
  return (
    <UiCommandItem {...props} className={join("hashti-command-item", props.className)} />
  )
}

function CommandGroup(props: ComponentProps<typeof UiCommandGroup>) {
  return (
    <UiCommandGroup {...props} className={join("hashti-command-group", props.className)} />
  )
}

function CommandGroupLabel(props: ComponentProps<typeof UiCommandGroupLabel>) {
  return (
    <UiCommandGroupLabel
      {...props}
      className={join("hashti-command__group-label", props.className)}
    />
  )
}

function CommandSeparator(props: ComponentProps<typeof UiCommandSeparator>) {
  return (
    <UiCommandSeparator
      {...props}
      className={join("hashti-command-separator", props.className)}
    />
  )
}

function CommandEmpty(props: ComponentProps<typeof UiCommandEmpty>) {
  return (
    <UiCommandEmpty {...props} className={join("hashti-command-empty", props.className)} />
  )
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandGroupLabel,
  CommandSeparator,
  CommandEmpty,
}
