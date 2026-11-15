"use client";

import { createContext, useContext, type Ref } from "react";
import {
  Tree as RACTree,
  TreeItem as RACTreeItem,
  TreeItemContent as RACTreeItemContent,
  Button as RACButton,
  type TreeProps as RACTreeProps,
  type TreeItemProps as RACTreeItemProps,
  type TreeItemContentProps,
  type TreeRenderProps,
  type TreeItemRenderProps,
  type ButtonProps as RACButtonProps,
  type CheckboxProps as RACCheckboxProps,
  type ButtonRenderProps,
  type CheckboxRenderProps,
} from "react-aria-components";
import { classes, cx } from "../../utils";
import { Checkbox } from "../checkbox";
import { Icon } from "../../icons";

export interface TreeContextValue {
  size?: "sm" | "md";
  showGuideLines?: boolean;
}

export const TreeContext = createContext<TreeContextValue>({});

export interface TreeRootProps<T extends object> extends Omit<RACTreeProps<T>, "className"> {
  size?: "sm" | "md";
  showGuideLines?: boolean;
  className?: string | ((values: TreeRenderProps) => string);
  ref?: Ref<HTMLDivElement>;
}

export function TreeRoot<T extends object>({
  size = "md",
  showGuideLines = true,
  className,
  children,
  ref,
  ...props
}: TreeRootProps<T>) {
  return (
    <TreeContext.Provider value={{ size, showGuideLines }}>
      <RACTree
        {...props}
        ref={ref}
        data-size={size}
        data-guide-lines={showGuideLines ? "true" : undefined}
        className={classes(
          cx(
            "react-aria-Tree",
            "hashti-tree",
            `hashti-tree--${size}`,
            showGuideLines && "hashti-tree--guidelines",
          ),
          className,
        )}
      >
        {children}
      </RACTree>
    </TreeContext.Provider>
  );
}

export interface TreeItemProps<T extends object = object> extends Omit<
  RACTreeItemProps<T>,
  "className"
> {
  className?: string | ((values: TreeItemRenderProps) => string);
  ref?: Ref<HTMLDivElement>;
}

export function TreeItem<T extends object = object>({
  className,
  children,
  ref,
  ...props
}: TreeItemProps<T>) {
  const { size, showGuideLines } = useContext(TreeContext);

  return (
    <RACTreeItem
      {...props}
      ref={ref}
      data-size={size}
      data-guide-lines={showGuideLines ? "true" : undefined}
      className={classes(
        cx("react-aria-TreeItem", "hashti-tree-item", size && `hashti-tree-item--${size}`),
        className,
      )}
    >
      {children}
    </RACTreeItem>
  );
}

export interface TreeIndicatorProps extends Omit<RACButtonProps, "className"> {
  "aria-label"?: string;
  className?: string | ((values: ButtonRenderProps) => string);
}

export function TreeIndicator({
  className,
  "aria-label": ariaLabel = "Expand / collapse",
  children,
  ...props
}: TreeIndicatorProps) {
  return (
    <RACButton
      slot="chevron"
      aria-label={ariaLabel}
      {...props}
      className={classes("hashti-tree-indicator", className)}
    >
      {children ?? <Icon name="chevronRight" size={16} />}
    </RACButton>
  );
}

export interface TreeContentProps extends TreeItemContentProps {
  className?: string;
}

export function TreeContent({ className, children, ...props }: TreeContentProps) {
  return (
    <RACTreeItemContent {...props}>
      {(renderProps) => {
        const content = typeof children === "function" ? children(renderProps) : children;
        return <div className={cx("hashti-tree-content", className)}>{content}</div>;
      }}
    </RACTreeItemContent>
  );
}

export interface TreeCheckboxProps extends Omit<RACCheckboxProps, "className"> {
  className?: string | ((values: CheckboxRenderProps) => string);
}

export function TreeCheckbox({ className, children, ...props }: TreeCheckboxProps) {
  return (
    <Checkbox slot="selection" {...props} className={classes("hashti-tree-checkbox", className)}>
      {children}
    </Checkbox>
  );
}

export interface TreeProps<T extends object> extends TreeRootProps<T> {}

function TreeDefault<T extends object>(props: TreeProps<T>) {
  return <TreeRoot {...props} />;
}

export const Tree = Object.assign(TreeDefault, {
  Root: TreeRoot,
  Item: TreeItem,
  Indicator: TreeIndicator,
  Content: TreeContent,
  Checkbox: TreeCheckbox,
});

export const TreeItemContent = TreeContent;
