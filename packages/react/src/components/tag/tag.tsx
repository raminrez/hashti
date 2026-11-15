"use client";

import { type CSSProperties, type ComponentPropsWithRef, type ReactNode, type Ref } from "react";
import {
  TagGroup as RACTagGroup,
  TagList,
  Tag as RACTag,
  Label,
  composeRenderProps,
  type TagGroupProps as RACTagGroupProps,
  type TagListProps,
  type TagProps as RACTagProps,
} from "react-aria-components";
import { Button } from "../button";
import { Icon } from "../../icons";
import { classes } from "../../utils";

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

export function Tag({ color = "gray", size = "md", className, style, ...props }: TagProps) {
  return (
    <span
      {...props}
      data-slot="tag"
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

export interface TagGroupProps<T> extends Omit<RACTagGroupProps, "children"> {
  label?: ReactNode;
  items?: Iterable<T>;
  children: TagListProps<T>["children"];
  ref?: Ref<HTMLDivElement>;
}

export function TagGroup<T>({ label, items, children, className, ...props }: TagGroupProps<T>) {
  return (
    <RACTagGroup {...props} className={["hashti-tag-group", className].filter(Boolean).join(" ")}>
      {label && <Label>{label}</Label>}
      <TagList items={items}>{children}</TagList>
    </RACTagGroup>
  );
}

export interface FilterTagProps extends RACTagProps {
  ref?: Ref<HTMLDivElement>;
}

export function FilterTag({ className, children, ...props }: FilterTagProps) {
  return (
    <RACTag {...props} className={classes("hashti-filter-tag", className)}>
      {composeRenderProps(children, (content, { allowsRemoving }) => (
        <>
          {content}
          {allowsRemoving && (
            <Button slot="remove" size="sm" iconOnly variant="ghost">
              <Icon name="close" />
            </Button>
          )}
        </>
      ))}
    </RACTag>
  );
}
