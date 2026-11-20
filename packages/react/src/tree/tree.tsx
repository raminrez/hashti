"use client"

import type { ComponentProps } from "react"
import {
  Tree as UiTree,
  TreeGroup as UiTreeGroup,
  TreeItem as UiTreeItem,
  TreeItemIndicator as UiTreeItemIndicator,
  TreeItemLabel as UiTreeItemLabel,
} from "@ui-sdk/react/tree"

const join = <State,>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined,
): string | ((state: State) => string | undefined) => {
  if (typeof className === "function") {
    return (state: State) => {
      const extra = className(state)
      return extra ? `${base} ${extra}` : base
    }
  }
  return className ? `${base} ${className}` : base
}

function Tree(props: ComponentProps<typeof UiTree>) {
  return <UiTree {...props} className={join("hashti-tree", props.className)} />
}

function TreeItem(props: ComponentProps<typeof UiTreeItem>) {
  return <UiTreeItem {...props} className={join("hashti-tree-item", props.className)} />
}

function TreeItemLabel(props: ComponentProps<typeof UiTreeItemLabel>) {
  return <UiTreeItemLabel {...props} className={join("hashti-tree-item-label", props.className)} />
}

function TreeItemIndicator(props: ComponentProps<typeof UiTreeItemIndicator>) {
  return (
    <UiTreeItemIndicator
      {...props}
      className={join("hashti-tree-item-indicator", props.className)}
    />
  )
}

function TreeGroup(props: ComponentProps<typeof UiTreeGroup>) {
  return <UiTreeGroup {...props} className={join("hashti-tree-group", props.className)} />
}

export { Tree, TreeItem, TreeItemLabel, TreeItemIndicator, TreeGroup }
