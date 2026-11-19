"use client"

import type { ComponentProps } from "react"
import {
  Collapsible as UiCollapsible,
  CollapsiblePanel as UiCollapsiblePanel,
  CollapsibleTrigger as UiCollapsibleTrigger,
} from "@ui-sdk/react/collapsible"

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base)
  return typeof className === "function" ? (state: S) => merge(className(state)) : merge(className)
}

function Collapsible({ className, ...props }: ComponentProps<typeof UiCollapsible>) {
  return <UiCollapsible className={join("hashti-collapsible", className)} {...props} />
}

function CollapsibleTrigger({ className, ...props }: ComponentProps<typeof UiCollapsibleTrigger>) {
  return <UiCollapsibleTrigger className={join("hashti-collapsible__trigger", className)} {...props} />
}

function CollapsiblePanel({ className, ...props }: ComponentProps<typeof UiCollapsiblePanel>) {
  return <UiCollapsiblePanel className={join("hashti-collapsible__panel", className)} {...props} />
}

export { Collapsible, CollapsibleTrigger, CollapsiblePanel }
