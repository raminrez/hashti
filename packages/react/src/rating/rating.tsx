"use client"

import type { ComponentProps } from "react"
import { Rating as UiRating, RatingItem as UiRatingItem } from "@ui-sdk/react/rating"

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base)
  return typeof className === "function" ? (state: S) => merge(className(state)) : merge(className)
}

function Rating({ className, ...props }: ComponentProps<typeof UiRating>) {
  return <UiRating className={join("hashti-rating", className)} {...props} />
}

function RatingItem({ className, ...props }: ComponentProps<typeof UiRatingItem>) {
  return <UiRatingItem className={join("hashti-rating-item", className)} {...props} />
}

export { Rating, RatingItem }
