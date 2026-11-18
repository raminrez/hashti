"use client";

import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  Listbox as UiSdkListbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem as UiSdkListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxSeparator,
  createListboxController,
  type ListboxProps as UiSdkListboxProps,
  type ListboxState,
  type ListboxItemState,
} from "@ui-sdk/react/listbox";
import { cx, uiClass, type ControlSize } from "../../utils";
import { Icon } from "../../icons";

export interface ListboxContextValue {
  size?: ControlSize;
  variant?: "flat" | "bordered" | "card";
}

export const ListboxContext = createContext<ListboxContextValue>({});

const UiSdkListboxEither = UiSdkListbox as (
  props: UiSdkListboxProps<string, boolean | undefined>,
) => ReactNode;

export type ListboxRootProps = Omit<
  UiSdkListboxProps<string, boolean | undefined>,
  "children"
> & {
  size?: ControlSize;
  variant?: "flat" | "bordered" | "card";
  /** Content shown when the list has no options to render. */
  emptyContent?: ReactNode;
  /** Render the empty state; wins over `emptyContent`. Called when the list has no children. */
  renderEmptyState?: () => ReactNode;
  children?: ReactNode;
};

function ListboxRoot({
  size = "md",
  variant = "bordered",
  emptyContent,
  renderEmptyState,
  className,
  children,
  ...props
}: ListboxRootProps) {
  const emptyState = renderEmptyState?.() ?? (emptyContent != null ? (
    <div className="hashti-listbox-empty-content">{emptyContent}</div>
  ) : null);

  return (
    <ListboxContext.Provider value={{ size, variant }}>
      <UiSdkListboxEither
        {...props}
        data-size={size}
        data-variant={variant}
        className={uiClass(
          className as string | ((state: ListboxState) => string | undefined) | undefined,
          "hashti-listbox",
          `hashti-listbox--${size}`,
          `hashti-listbox--${variant}`,
        )}
      >
        {children}
        {emptyState}
      </UiSdkListboxEither>
    </ListboxContext.Provider>
  );
}

export interface ListboxItemProps extends ComponentProps<typeof UiSdkListboxItem> {}

function ListboxItem({ className, children, ...props }: ListboxItemProps) {
  const { size, variant } = useContext(ListboxContext);
  return (
    <UiSdkListboxItem
      {...props}
      data-size={size}
      data-variant={variant}
      className={uiClass(
        className as string | ((state: ListboxItemState) => string | undefined) | undefined,
        "hashti-listbox-item",
        size && `hashti-listbox-item--${size}`,
      )}
    >
      {children}
    </UiSdkListboxItem>
  );
}

export interface ListboxSectionProps
  extends Omit<ComponentProps<typeof ListboxGroup>, "children" | "title"> {
  /** Section heading, rendered as the group label. */
  title?: ReactNode;
  children?: ReactNode;
}

function ListboxSection({ className, title, children, ...props }: ListboxSectionProps) {
  return (
    <ListboxGroup {...props} className={cx("hashti-listbox-section", className as string)}>
      {title != null && (
        <ListboxGroupLabel className="hashti-listbox-header">{title}</ListboxGroupLabel>
      )}
      {children}
    </ListboxGroup>
  );
}

export type ListboxHeaderProps = ComponentProps<typeof ListboxGroupLabel>;

function ListboxHeader({ className, children, ...props }: ListboxHeaderProps) {
  return (
    <ListboxGroupLabel {...props} className={cx("hashti-listbox-header", className as string)}>
      {children}
    </ListboxGroupLabel>
  );
}

export interface ListboxEmptyStateProps {
  children?: ReactNode;
  className?: string;
}

function ListboxEmptyState({ children, className }: ListboxEmptyStateProps) {
  return <div className={cx("hashti-listbox-empty-state", className)}>{children}</div>;
}

export interface ListboxLoadMoreProps {
  id?: string;
  label?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
  children?: ReactNode;
}

/**
 * The pagination sentinel row. It is presentational: wire the actual loading
 * through the listbox's `onLoadMore`, which fires when the highlight or
 * scrolling reaches the last item.
 */
function ListboxLoadMore({
  isLoading,
  isError = false,
  errorMessage = "Failed to load more items",
  retryLabel = "Retry",
  onRetry,
  label = "Loading more items…",
  className,
  children,
}: ListboxLoadMoreProps) {
  if (!isLoading && !isError) return null;

  return (
    <div role="presentation" data-testid="loadMoreSentinel" className={cx("hashti-listbox-load-more", className)}>
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
    </div>
  );
}

/**
 * The selected-item check. Renders ui-sdk's indicator part with Hashti's
 * check icon inside.
 */
function ListboxCheck() {
  return (
    <ListboxItemIndicator className="hashti-listbox-item-check">
      <Icon name="check" aria-hidden="true" />
    </ListboxItemIndicator>
  );
}

export interface ListboxProps extends ListboxRootProps {}

function ListboxDefault(props: ListboxProps) {
  return <ListboxRoot {...props} />;
}

interface ListboxCompound {
  (props: ListboxProps): ReactNode;
  Root: typeof ListboxRoot;
  Item: typeof ListboxItem;
  Section: typeof ListboxSection;
  Header: typeof ListboxHeader;
  EmptyState: typeof ListboxEmptyState;
  LoadMore: typeof ListboxLoadMore;
  Check: typeof ListboxCheck;
  ItemIndicator: typeof ListboxItemIndicator;
  ItemIcon: typeof ListboxItemIcon;
  Separator: typeof ListboxSeparator;
}

export const Listbox: ListboxCompound = Object.assign(ListboxDefault, {
  Root: ListboxRoot,
  Item: ListboxItem,
  Section: ListboxSection,
  Header: ListboxHeader,
  EmptyState: ListboxEmptyState,
  LoadMore: ListboxLoadMore,
  Check: ListboxCheck,
  ItemIndicator: ListboxItemIndicator,
  ItemIcon: ListboxItemIcon,
  Separator: ListboxSeparator,
});

export {
  ListboxRoot,
  ListboxItem,
  ListboxSection,
  ListboxHeader,
  ListboxEmptyState,
  ListboxLoadMore,
  ListboxCheck,
  ListboxItemIndicator,
  ListboxItemIcon,
  ListboxSeparator,
  createListboxController,
};
