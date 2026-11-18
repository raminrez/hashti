"use client";

import { type CSSProperties, type ComponentPropsWithRef } from "react";

export type TagColor =
  | "gray"
  | "blue"
  | "cyan"
  | "green"
  | "red"
  | "teal"
  | "purple"
  | "magenta"
  | "cool-gray"
  | "warm-gray";

export interface TagProps extends ComponentPropsWithRef<"span"> {
  color?: TagColor;
  size?: "sm" | "md";
}

/** Static, presentational tag. Removable/selectable tag groups move to TokenInput (TICK-006). */
export function Tag({ color = "gray", size = "md", className, style, ...props }: TagProps) {
  return (
    <span
      {...props}
      data-color={color}
      data-size={size}
      className={["hashti-tag", className].filter(Boolean).join(" ")}
      style={
        {
          "--tag-background": `var(--hashti-tag-background-${color}, var(--hashti-tag-background-${color}))`,
          "--tag-color": `var(--hashti-tag-color-${color}, var(--hashti-tag-color-${color}))`,
          ...style,
        } as CSSProperties
      }
    />
  );
}
