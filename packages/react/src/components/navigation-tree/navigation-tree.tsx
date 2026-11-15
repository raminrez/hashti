"use client";

import { createContext, useContext, type ReactNode, type Ref } from "react";
import {
  NavigationTree as RACNavigationTree,
  NavigationTreeItem as RACNavigationTreeItem,
  NavigationTreeItemContent as RACNavigationTreeItemContent,
  NavigationTreeSection as RACNavigationTreeSection,
  NavigationTreeHeader as RACNavigationTreeHeader,
  Button as RACButton,
  type NavigationTreeProps as RACNavigationTreeProps,
  type NavigationTreeItemProps as RACNavigationTreeItemProps,
  type NavigationTreeItemContentProps as RACNavigationTreeItemContentProps,
  type NavigationTreeSectionProps as RACNavigationTreeSectionProps,
  type NavigationTreeHeaderProps as RACNavigationTreeHeaderProps,
  type NavigationTreeRenderProps,
  type NavigationTreeItemRenderProps,
  type ButtonProps as RACButtonProps,
  type ButtonRenderProps,
} from "react-aria-components";
import { classes, cx } from "../../utils";
import { Icon } from "../../icons";

export interface NavigationTreeContextValue {
  size?: "sm" | "md";
}

export const NavigationTreeContext = createContext<NavigationTreeContextValue>({});

export interface NavigationTreeRootProps<T extends object = object> extends Omit<
  RACNavigationTreeProps<T>,
  "className"
> {
  size?: "sm" | "md";
  className?: string | ((values: NavigationTreeRenderProps) => string);
  ref?: Ref<HTMLDivElement>;
}

export function NavigationTreeRoot<T extends object = object>({
  size = "md",
  className,
  children,
  ref,
  ...props
}: NavigationTreeRootProps<T>) {
  return (
    <NavigationTreeContext.Provider value={{ size }}>
      <RACNavigationTree
        {...props}
        ref={ref}
        data-size={size}
        className={classes(
          cx("hashti-navigation-tree", `hashti-navigation-tree--${size}`),
          className,
        )}
      >
        {children as any}
      </RACNavigationTree>
    </NavigationTreeContext.Provider>
  );
}

export interface NavigationTreeItemProps<T extends object = object> extends Omit<
  RACNavigationTreeItemProps<T>,
  "className"
> {
  className?: string | ((values: NavigationTreeItemRenderProps) => string);
  ref?: Ref<HTMLDivElement>;
}

export function NavigationTreeItem<T extends object = object>({
  className,
  children,
  ref,
  ...props
}: NavigationTreeItemProps<T>) {
  const { size } = useContext(NavigationTreeContext);

  return (
    <RACNavigationTreeItem
      {...props}
      ref={ref}
      data-size={size}
      className={classes(
        cx("hashti-navigation-tree-item", size && `hashti-navigation-tree-item--${size}`),
        className,
      )}
    >
      {children as any}
    </RACNavigationTreeItem>
  );
}

export interface NavigationTreeIndicatorProps extends Omit<RACButtonProps, "className"> {
  "aria-label"?: string;
  className?: string | ((values: ButtonRenderProps) => string);
}

export function NavigationTreeIndicator({
  className,
  "aria-label": ariaLabel = "Expand / collapse",
  children,
  ...props
}: NavigationTreeIndicatorProps) {
  return (
    <RACButton
      slot="chevron"
      aria-label={ariaLabel}
      {...props}
      className={classes("hashti-navigation-tree-indicator", className)}
    >
      {children ?? <Icon name="chevronRight" size={16} />}
    </RACButton>
  );
}

export interface NavigationTreeItemContentProps extends RACNavigationTreeItemContentProps {
  className?: string;
}

export function NavigationTreeItemContent({
  className,
  children,
  ...props
}: NavigationTreeItemContentProps) {
  return (
    <RACNavigationTreeItemContent {...props}>
      {(renderProps) => {
        const content = typeof children === "function" ? children(renderProps) : children;
        return <div className={cx("hashti-navigation-tree-content", className)}>{content}</div>;
      }}
    </RACNavigationTreeItemContent>
  );
}

export interface NavigationTreeSectionProps<T extends object = object> extends Omit<
  RACNavigationTreeSectionProps<T>,
  "className"
> {
  title?: ReactNode;
  className?: string;
}

export function NavigationTreeSection<T extends object = object>({
  className,
  title,
  children,
  ...props
}: NavigationTreeSectionProps<T>) {
  return (
    <RACNavigationTreeSection
      {...props}
      className={cx("hashti-navigation-tree-section", className)}
    >
      {title && (
        <RACNavigationTreeHeader className="hashti-navigation-tree-header">
          {title}
        </RACNavigationTreeHeader>
      )}
      {children as any}
    </RACNavigationTreeSection>
  );
}

export interface NavigationTreeHeaderProps extends RACNavigationTreeHeaderProps {
  className?: string;
}

export function NavigationTreeHeader({ className, children, ...props }: NavigationTreeHeaderProps) {
  return (
    <RACNavigationTreeHeader className={cx("hashti-navigation-tree-header", className)} {...props}>
      {children as any}
    </RACNavigationTreeHeader>
  );
}

export interface NavigationTreeProps<
  T extends object = object,
> extends NavigationTreeRootProps<T> {}

function NavigationTreeDefault<T extends object = object>(props: NavigationTreeProps<T>) {
  return <NavigationTreeRoot {...props} />;
}

export const NavigationTree = Object.assign(NavigationTreeDefault, {
  Root: NavigationTreeRoot,
  Item: NavigationTreeItem,
  Indicator: NavigationTreeIndicator,
  Content: NavigationTreeItemContent,
  Section: NavigationTreeSection,
  Header: NavigationTreeHeader,
});
