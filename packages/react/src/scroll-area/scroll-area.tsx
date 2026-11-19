"use client"

import type { ComponentProps } from "react"
import {
  ScrollArea as UiScrollArea,
  ScrollAreaContent as UiScrollAreaContent,
  ScrollAreaScrollbar as UiScrollAreaScrollbar,
  ScrollAreaThumb as UiScrollAreaThumb,
  ScrollAreaViewport as UiScrollAreaViewport,
} from "@ui-sdk/react/scroll-area"

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base)
  return typeof className === "function" ? (state: S) => merge(className(state)) : merge(className)
}

function ScrollArea({ className, ...props }: ComponentProps<typeof UiScrollArea>) {
  return <UiScrollArea className={join("hashti-scroll-area", className)} {...props} />
}

function ScrollAreaViewport({ className, ...props }: ComponentProps<typeof UiScrollAreaViewport>) {
  return <UiScrollAreaViewport className={join("hashti-scroll-area-viewport", className)} {...props} />
}

function ScrollAreaContent({ className, ...props }: ComponentProps<typeof UiScrollAreaContent>) {
  return <UiScrollAreaContent className={join("hashti-scroll-area-content", className)} {...props} />
}

function ScrollAreaScrollbar({ className, ...props }: ComponentProps<typeof UiScrollAreaScrollbar>) {
  return <UiScrollAreaScrollbar className={join("hashti-scroll-area-scrollbar", className)} {...props} />
}

function ScrollAreaThumb({ className, ...props }: ComponentProps<typeof UiScrollAreaThumb>) {
  return <UiScrollAreaThumb className={join("hashti-scroll-area-thumb", className)} {...props} />
}

export { ScrollArea, ScrollAreaViewport, ScrollAreaContent, ScrollAreaScrollbar, ScrollAreaThumb }
