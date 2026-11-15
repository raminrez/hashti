"use client";

import { createContext, useContext, type ReactNode, type Ref } from "react";
import {
  GridList as RACGridList,
  GridListItem as RACGridListItem,
  GridListSection as RACGridListSection,
  GridListHeader as RACGridListHeader,
  GridListLoadMoreItem as RACGridListLoadMoreItem,
  Button as RACButton,
  type GridListProps as RACGridListProps,
  type GridListItemProps as RACGridListItemProps,
  type GridListSectionProps as RACGridListSectionProps,
  type GridListHeaderProps as RACGridListHeaderProps,
  type GridListLoadMoreItemProps as RACGridListLoadMoreItemProps,
  type GridListRenderProps,
  type GridListItemRenderProps,
  type ButtonProps as RACButtonProps,
  type CheckboxProps as RACCheckboxProps,
  type ButtonRenderProps,
  type CheckboxRenderProps,
} from "react-aria-components";
import { classes, cx, type ControlSize } from "../../utils";
import { Checkbox } from "../checkbox";
import { Icon } from "../../icons";

export interface GridListContextValue {
  size?: ControlSize;
  variant?: "flat" | "bordered" | "card";
}

export const GridListContext = createContext<GridListContextValue>({});

export interface GridListRootProps<T extends object> extends Omit<
  RACGridListProps<T>,
  "className"
> {
  size?: ControlSize;
  variant?: "flat" | "bordered" | "card";
  className?: string | ((values: GridListRenderProps) => string);
  emptyContent?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function GridListRoot<T extends object>({
  size = "md",
  variant = "bordered",
  emptyContent,
  renderEmptyState,
  className,
  children,
  ref,
  ...props
}: GridListRootProps<T>) {
  const resolvedEmptyState =
    renderEmptyState ??
    (emptyContent
      ? () => <div className="hashti-grid-list-empty-content">{emptyContent}</div>
      : undefined);

  return (
    <GridListContext.Provider value={{ size, variant }}>
      <RACGridList
        {...props}
        ref={ref}
        renderEmptyState={resolvedEmptyState}
        data-size={size}
        data-variant={variant}
        className={classes(
          cx(
            "react-aria-GridList",
            "hashti-grid-list",
            `hashti-grid-list--${size}`,
            `hashti-grid-list--${variant}`,
          ),
          className,
        )}
      >
        {children}
      </RACGridList>
    </GridListContext.Provider>
  );
}

export interface GridListItemProps<T extends object = object> extends Omit<
  RACGridListItemProps<T>,
  "className"
> {
  className?: string | ((values: GridListItemRenderProps) => string);
  ref?: Ref<HTMLDivElement>;
}

export function GridListItem<T extends object = object>({
  className,
  children,
  ref,
  ...props
}: GridListItemProps<T>) {
  const { size, variant } = useContext(GridListContext);

  return (
    <RACGridListItem
      {...props}
      ref={ref}
      data-size={size}
      data-variant={variant}
      className={classes(
        cx(
          "react-aria-GridListItem",
          "hashti-grid-list-item",
          size && `hashti-grid-list-item--${size}`,
        ),
        className,
      )}
    >
      {children}
    </RACGridListItem>
  );
}

export interface GridListSectionProps<
  T extends object = object,
> extends RACGridListSectionProps<T> {
  title?: ReactNode;
  className?: string;
}

export function GridListSection<T extends object = object>({
  className,
  title,
  children,
  ...props
}: GridListSectionProps<T>) {
  return (
    <RACGridListSection
      {...props}
      className={cx("react-aria-GridListSection", "hashti-grid-list-section", className)}
    >
      {title && <RACGridListHeader className="hashti-grid-list-header">{title}</RACGridListHeader>}
      {children as any}
    </RACGridListSection>
  );
}

export interface GridListHeaderProps extends RACGridListHeaderProps {
  className?: string;
}

export function GridListHeader({ className, children, ...props }: GridListHeaderProps) {
  return (
    <RACGridListHeader className={cx("hashti-grid-list-header", className)} {...props}>
      {children as any}
    </RACGridListHeader>
  );
}

export interface GridListDragHandleProps extends Omit<RACButtonProps, "className"> {
  "aria-label"?: string;
  className?: string | ((values: ButtonRenderProps) => string);
}

export function GridListDragHandle({
  className,
  "aria-label": ariaLabel = "Reorder item",
  children,
  ...props
}: GridListDragHandleProps) {
  return (
    <RACButton
      slot="drag"
      aria-label={ariaLabel}
      {...props}
      className={classes("hashti-grid-list-drag-handle", className)}
    >
      {children ?? <Icon name="menu" size={16} />}
    </RACButton>
  );
}

export interface GridListCheckboxProps extends Omit<RACCheckboxProps, "className"> {
  className?: string | ((values: CheckboxRenderProps) => string);
}

export function GridListCheckbox({ className, children, ...props }: GridListCheckboxProps) {
  return (
    <Checkbox
      slot="selection"
      {...props}
      className={classes("hashti-grid-list-checkbox", className)}
    >
      {children}
    </Checkbox>
  );
}

export interface GridListEmptyStateProps {
  children?: ReactNode;
  className?: string;
}

export function GridListEmptyState({ children, className }: GridListEmptyStateProps) {
  return <div className={cx("hashti-grid-list-empty-state", className)}>{children}</div>;
}

export interface GridListLoadMoreProps extends Omit<
  RACGridListLoadMoreItemProps,
  "className" | "children"
> {
  id?: string;
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
  children?: ReactNode;
}

export function GridListLoadMore({
  isLoading,
  isError = false,
  errorMessage = "Failed to load more items",
  retryLabel = "Retry",
  onRetry,
  label = "Loading more items…",
  className,
  children,
  ...props
}: GridListLoadMoreProps) {
  const isVisible = Boolean(isLoading || isError);

  return (
    <RACGridListLoadMoreItem
      {...props}
      isLoading={isVisible}
      className={cx("hashti-grid-list-load-more", className)}
    >
      {children ?? (
        <div className="hashti-load-more-content" role="status">
          {isError ? (
            <div className="hashti-load-more-error">
              <span className="hashti-load-more-error-message">{errorMessage}</span>
              {onRetry && (
                <button
                  type="button"
                  className="hashti-load-more-retry"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry();
                  }}
                >
                  {retryLabel}
                </button>
              )}
            </div>
          ) : (
            <div className="hashti-load-more-loading">
              <span className="hashti-spinner" aria-hidden="true" />
              <span>{label}</span>
            </div>
          )}
        </div>
      )}
    </RACGridListLoadMoreItem>
  );
}

export interface GridListProps<T extends object> extends GridListRootProps<T> {}

function GridListDefault<T extends object>(props: GridListProps<T>) {
  return <GridListRoot {...props} />;
}

export const GridList = Object.assign(GridListDefault, {
  Root: GridListRoot,
  Item: GridListItem,
  Section: GridListSection,
  Header: GridListHeader,
  DragHandle: GridListDragHandle,
  Checkbox: GridListCheckbox,
  EmptyState: GridListEmptyState,
  LoadMore: GridListLoadMore,
});
