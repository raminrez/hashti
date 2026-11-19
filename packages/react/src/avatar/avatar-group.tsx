"use client"

import { Children, type ComponentProps, type ReactNode } from "react"
import type { AvatarSize } from "./avatar"

interface AvatarGroupProps extends ComponentProps<"div"> {
  size?: AvatarSize
  max?: number
  overflowRenderer?: (count: number) => ReactNode
}

/** Extracts grapheme-safe initials (supporting Persian/Arabic grapheme clusters). */
function getInitials(name: string, locale?: string): string {
  const trimmed = name.trim()
  if (!trimmed) return ""
  const parts = trimmed.split(/\s+/)
  const firstWord = parts[0] ?? ""
  const lastWord = parts[parts.length - 1] ?? ""

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(locale ?? "und", { granularity: "grapheme" })
    const getFirstGrapheme = (str: string) => {
      const segments = Array.from(segmenter.segment(str))
      return segments[0]?.segment ?? ""
    }
    if (parts.length === 1) {
      return getFirstGrapheme(firstWord)
    }
    return getFirstGrapheme(firstWord) + getFirstGrapheme(lastWord)
  }

  // Fallback
  if (parts.length === 1) return Array.from(firstWord)[0] ?? ""
  return (Array.from(firstWord)[0] ?? "") + (Array.from(lastWord)[0] ?? "")
}

function AvatarGroup({ size = "md", max, overflowRenderer, children, className, ...props }: AvatarGroupProps) {
  const allChildren = Children.toArray(children)
  const total = allChildren.length
  const visibleCount = max != null && max < total ? max : total
  const overflowCount = total - visibleCount

  return (
    <div
      {...props}
      role="group"
      data-size={size}
      className={`hashti-avatar-group${className ? ` ${className}` : ""}`}
    >
      {allChildren.slice(0, visibleCount)}

      {overflowCount > 0 && (
        <span className="hashti-avatar-group-count" aria-label={`${overflowCount} more members`}>
          {overflowRenderer ? overflowRenderer(overflowCount) : `+${overflowCount}`}
        </span>
      )}
    </div>
  )
}

export { AvatarGroup, getInitials, type AvatarGroupProps }
