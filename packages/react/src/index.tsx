"use client"

import { createParts } from "@ui-sdk/react/primitive"
import { hashtiSwitch } from "@hashti/core"

export { Button } from "./button"

export const { Root: Switch } = createParts(hashtiSwitch, { root: "button" })

export { Separator } from "./separator"

export { Label } from "./label"

export { Avatar, AvatarImage, AvatarFallback } from "./avatar"

export { Input } from "./input"

export { Textarea } from "./textarea"
