"use client"

import type { ComponentProps } from "react"
import {
  Progress as UiProgress,
  ProgressIndicator as UiProgressIndicator,
  ProgressLabel as UiProgressLabel,
  ProgressTrack as UiProgressTrack,
  ProgressValue as UiProgressValue,
} from "@ui-sdk/react/progress"

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base)
  return typeof className === "function" ? (state: S) => merge(className(state)) : merge(className)
}

function Progress({ className, ...props }: ComponentProps<typeof UiProgress>) {
  return <UiProgress className={join("hashti-progress", className)} {...props} />
}

function ProgressLabel({ className, ...props }: ComponentProps<typeof UiProgressLabel>) {
  return <UiProgressLabel className={join("hashti-progress__label", className)} {...props} />
}

function ProgressValue({ className, ...props }: ComponentProps<typeof UiProgressValue>) {
  return <UiProgressValue className={join("hashti-progress__value", className)} {...props} />
}

function ProgressTrack({ className, ...props }: ComponentProps<typeof UiProgressTrack>) {
  return <UiProgressTrack className={join("hashti-progress-track", className)} {...props} />
}

function ProgressIndicator({ className, ...props }: ComponentProps<typeof UiProgressIndicator>) {
  return <UiProgressIndicator className={join("hashti-progress-indicator", className)} {...props} />
}

export { Progress, ProgressLabel, ProgressValue, ProgressTrack, ProgressIndicator }
