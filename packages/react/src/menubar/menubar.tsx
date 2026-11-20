"use client"

import type { ComponentProps } from "react"
import { join } from "@hashti/utils"
import { Menubar as UiMenubar } from "@ui-sdk/react/menubar"


function Menubar(props: ComponentProps<typeof UiMenubar>) {
  return <UiMenubar {...props} className={join("hashti-menubar", props.className)} />
}

export { Menubar }
