"use client";

import {
  createContext,
  useContext,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from "react";
import {
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  ListBoxSection as RACListBoxSection,
  ListBoxLoadMoreItem as RACListBoxLoadMoreItem,
  Header as RACHeader,
  Button as RACButton,
  type ListBoxProps as RACListBoxProps,
  type ListBoxItemProps as RACListBoxItemProps,
  type ListBoxSectionProps as RACListBoxSectionProps,
  type ListBoxLoadMoreItemProps as RACListBoxLoadMoreItemProps,
  type ListBoxRenderProps,
  type ListBoxItemRenderProps,
  type ButtonProps as RACButtonProps,
  type CheckboxProps as RACCheckboxProps,
  type ButtonRenderProps,
  type CheckboxRenderProps,
} from "react-aria-components";
import { classes, cx, type ControlSize } from "../../utils";
import { Checkbox } from "../checkbox";
import { Icon } from "../../icons";

export interface ListBoxContextValue {
  size?: ControlSize;
  variant?: "flat" | "bordered" | "card";
}

export const ListBoxContext = createContext<ListBoxContextValue>({});

export interface ListBoxRootProps<T extends object> extends Omit<RACListBoxProps<T>, "className"> {
  size?: ControlSize;
  variant?: "flat" | "bordered" | "card";
  emptyContent?: ReactNode;
  className?: string | ((values: ListBoxRenderProps) => string);
  ref?: Ref<HTMLDivElement>;
}

export function ListBoxRoot<T extends object>({
  size = "md",
  variant = "bordered",
  emptyContent,
  renderEmptyState,
  className,
  children,
  ref,
  ...props
}: ListBoxRootProps<T>) {
  const resolvedEmptyState =
    renderEmptyState ??
    (emptyContent
      ? () => <div className="hashti-listbox-empty-content">{emptyContent}</div>
      : undefined);

  return (
    <ListBoxContext.Provider value={{ size, variant }}>
      <RACListBox
        {...props}
        ref={ref}
        renderEmptyState={resolvedEmptyState}
        data-size={size}
        data-variant={variant}
        className={classes(
          cx("hashti-listbox", `hashti-listbox--${size}`, `hashti-listbox--${variant}`),
          className,
        )}
      >
        {children as any}
      </RACListBox>
    </ListBoxContext.Provider>
  );
}

export interface ListBoxItemProps<T extends object = object> extends Omit<
  RACListBoxItemProps<T>,
  "className"
> {
  className?: string | ((values: ListBoxItemRenderProps) => string);
  ref?: Ref<HTMLDivElement>;
}

export function ListBoxItem<T extends object = object>({
  className,
  children,
  ref,
  ...props
}: ListBoxItemProps<T>) {
  const { size, variant } = useContext(ListBoxContext);

  return (
    <RACListBoxItem
      {...props}
      ref={ref}
      data-size={size}
      data-variant={variant}
      className={classes(
        // RAC's own class carries the default item styling every stylesheet keys on;
        // passing className alone would drop it.
        cx("react-aria-ListBoxItem", "hashti-listbox-item", size && `hashti-listbox-item--${size}`),
        className,
      )}
    >
      {children as any}
    </RACListBoxItem>
  );
}

export interface ListBoxSectionProps<T extends object = object> extends RACListBoxSectionProps<T> {
  title?: ReactNode;
}

export function ListBoxSection<T extends object = object>({
  className,
  title,
  children,
  ...props
}: ListBoxSectionProps<T>) {
  return (
    <RACListBoxSection
      {...props}
      className={cx("react-aria-ListBoxSection", "hashti-listbox-section", className)}
    >
      {title && <RACHeader className="hashti-listbox-header">{title}</RACHeader>}
      {children as any}
    </RACListBoxSection>
  );
}

export interface ListBoxHeaderProps extends ComponentPropsWithRef<typeof RACHeader> {}

export function ListBoxHeader({ className, children, ...props }: ListBoxHeaderProps) {
  return (
    <RACHeader {...props} className={cx("hashti-listbox-header", className)}>
      {children as any}
    </RACHeader>
  );
}

export interface ListBoxDragHandleProps extends Omit<RACButtonProps, "className"> {
  "aria-label"?: string;
  className?: string | ((values: ButtonRenderProps) => string);
}

export function ListBoxDragHandle({
  className,
  "aria-label": ariaLabel = "Reorder item",
  children,
  ...props
}: ListBoxDragHandleProps) {
  return (
    <RACButton
      slot="drag"
      aria-label={ariaLabel}
      {...props}
      className={classes("hashti-listbox-drag-handle", className)}
    >
      {children ?? <Icon name="menu" size={16} />}
    </RACButton>
  );
}

export interface ListBoxCheckboxProps extends Omit<RACCheckboxProps, "className"> {
  className?: string | ((values: CheckboxRenderProps) => string);
}

export function ListBoxCheckbox({ className, children, ...props }: ListBoxCheckboxProps) {
  return (
    <Checkbox slot="selection" {...props} className={classes("hashti-listbox-checkbox", className)}>
      {children as any}
    </Checkbox>
  );
}

export interface ListBoxEmptyStateProps {
  children?: ReactNode;
  className?: string;
}

export function ListBoxEmptyState({ children, className }: ListBoxEmptyStateProps) {
  return <div className={cx("hashti-listbox-empty-state", className)}>{children as any}</div>;
}

export interface ListBoxLoadMoreProps extends Omit<
  RACListBoxLoadMoreItemProps,
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

export function ListBoxLoadMore({
  isLoading,
  isError = false,
  errorMessage = "Failed to load more items",
  retryLabel = "Retry",
  onRetry,
  label = "Loading more items…",
  className,
  children,
  ...props
}: ListBoxLoadMoreProps) {
  const isVisible = Boolean(isLoading || isError);

  return (
    <RACListBoxLoadMoreItem
      {...props}
      isLoading={isVisible}
      className={cx("hashti-listbox-load-more", className)}
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
    </RACListBoxLoadMoreItem>
  );
}

export interface ListBoxProps<T extends object> extends ListBoxRootProps<T> {}

function ListBoxDefault<T extends object>(props: ListBoxProps<T>) {
  return <ListBoxRoot {...props} />;
}

export const ListBox = Object.assign(ListBoxDefault, {
  Root: ListBoxRoot,
  Item: ListBoxItem,
  Section: ListBoxSection,
  Header: ListBoxHeader,
  DragHandle: ListBoxDragHandle,
  Checkbox: ListBoxCheckbox,
  EmptyState: ListBoxEmptyState,
  LoadMore: ListBoxLoadMore,
});
