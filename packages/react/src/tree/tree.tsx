"use client";

import { join } from "@hashti/utils";
import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  Tree as UiTree,
  TreeGroup as UiTreeGroup,
  TreeItem as UiTreeItem,
  TreeItemIndicator as UiTreeItemIndicator,
  TreeItemLabel as UiTreeItemLabel,
} from "@ui-sdk/react/tree";

function Tree(props: ComponentProps<typeof UiTree>) {
  return <UiTree {...props} className={join("hashti-tree", props.className)} />;
}

// ui-sdk detects a branch by comparing child element types with its own TreeGroup,
// so a group reached through this wrapper has to be reported as `branch`.
function hasGroup(
  children: ComponentProps<typeof UiTreeItem>["children"],
): boolean {
  if (typeof children === "function") {
    return false;
  }
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (child.type === TreeGroup ||
        hasGroup((child.props as { children?: ReactNode }).children)),
  );
}

function TreeItem(props: ComponentProps<typeof UiTreeItem>) {
  return (
    <UiTreeItem
      {...props}
      branch={props.branch ?? (hasGroup(props.children) || undefined)}
      className={join("hashti-tree-item", props.className)}
    />
  );
}

function TreeItemLabel(props: ComponentProps<typeof UiTreeItemLabel>) {
  return (
    <UiTreeItemLabel
      {...props}
      className={join("hashti-tree-item-label", props.className)}
    />
  );
}

function TreeItemIndicator(props: ComponentProps<typeof UiTreeItemIndicator>) {
  return (
    <UiTreeItemIndicator
      {...props}
      className={join("hashti-tree-item-indicator", props.className)}
    />
  );
}

function TreeGroup(props: ComponentProps<typeof UiTreeGroup>) {
  return (
    <UiTreeGroup
      {...props}
      className={join("hashti-tree-group", props.className)}
    />
  );
}

export { Tree, TreeItem, TreeItemLabel, TreeItemIndicator, TreeGroup };
