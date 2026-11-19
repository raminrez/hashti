"use client"

import { type ComponentPropsWithRef, type ReactNode, type Ref } from "react"

export type BadgeKind =
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "primary"
  | "neutral"
  | "secondary"

export type BadgePlacement =
  | "top-end"
  | "top-start"
  | "bottom-end"
  | "bottom-start"
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"

export interface BadgeProps extends Omit<ComponentPropsWithRef<"span">, "content"> {
  content?: ReactNode
  count?: ReactNode
  maxCount?: number
  max?: number
  isDot?: boolean
  kind?: BadgeKind
  placement?: BadgePlacement
  children?: ReactNode
  ref?: Ref<HTMLSpanElement>
}

export function Badge({
  content,
  count,
  maxCount = 99,
  max,
  isDot = false,
  kind = "danger",
  placement = "top-end",
  children,
  className,
  ref,
  ...props
}: BadgeProps) {
  const actualContent = count ?? content
  const actualMax = max ?? maxCount
  let displayContent: ReactNode = actualContent
  if (typeof actualContent === "number" && actualMax != null && actualContent > actualMax) {
    displayContent = `${actualMax}+`
  }

  const normalizedPlacement =
    placement === "top-right"
      ? "top-end"
      : placement === "top-left"
        ? "top-start"
        : placement === "bottom-right"
          ? "bottom-end"
          : placement === "bottom-left"
            ? "bottom-start"
            : placement

  const isDotMode = isDot || actualContent == null

  const badgeElement = (
    <span
      {...props}
      ref={ref}
      role="status"
      data-kind={kind}
      data-placement={normalizedPlacement}
      data-dot={isDotMode ? "" : undefined}
      className={className ? `hashti-badge ${className}` : "hashti-badge"}
    >
      {!isDot && displayContent}
    </span>
  )

  if (children) {
    return (
      <span className="hashti-badge-wrapper">
        {children}
        {badgeElement}
      </span>
    )
  }

  return badgeElement
}
