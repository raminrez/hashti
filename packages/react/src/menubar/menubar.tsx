"use client"

import type { ComponentProps } from "react"
import { Menubar as UiMenubar } from "@ui-sdk/react/menubar"

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

function Menubar(props: ComponentProps<typeof UiMenubar>) {
  return <UiMenubar {...props} className={join("hashti-menubar", props.className)} />
}

export { Menubar }
