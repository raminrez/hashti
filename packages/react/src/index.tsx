"use client"

import { createParts } from "@ui-sdk/react/primitive"
import { button, hashtiSwitch } from "@hashti/core"

export const { Root: Button } = createParts(button, { root: "button" })

export const { Root: Switch } = createParts(hashtiSwitch, { root: "button" })

export { Separator } from "./separator"

export { Label } from "./label"
