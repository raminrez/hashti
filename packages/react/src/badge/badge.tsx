"use client";

import { type ComponentPropsWithRef, type ReactNode, type Ref } from "react";

export type BadgeKind =
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "primary"
  | "neutral"
  | "secondary";

export type BadgePlacement =
  | "top-end"
  | "top-start"
  | "bottom-end"
  | "bottom-start"
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface BadgeProps extends Omit<
  ComponentPropsWithRef<"span">,
  "content"
> {
  content?: ReactNode;
  count?: ReactNode;
  maxCount?: number;
  max?: number;
  isDot?: boolean;
  kind?: BadgeKind;
  placement?: BadgePlacement;
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

function normalizePlacement(placement: BadgePlacement) {
  switch (placement) {
    case "top-right":
      return "top-end";
    case "top-left":
      return "top-start";
    case "bottom-right":
      return "bottom-end";
    case "bottom-left":
      return "bottom-start";
    default:
      return placement;
  }
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
  const actualContent = count ?? content;
  const actualMax = max ?? maxCount;
  let displayContent: ReactNode = actualContent;
  if (
    typeof actualContent === "number" &&
    actualMax != null &&
    actualContent > actualMax
  ) {
    displayContent = `${actualMax}+`;
  }

  const normalizedPlacement = normalizePlacement(placement);

  const isDotMode = isDot || (actualContent == null && children == null);

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
      {!isDot && (displayContent ?? children)}
    </span>
  );

  // Without content/count the children are the pill's label; with one they are
  // the thing the badge marks.
  if (children && (actualContent != null || isDot)) {
    return (
      <span className="hashti-badge-wrapper">
        {children}
        {badgeElement}
      </span>
    );
  }

  return badgeElement;
}
