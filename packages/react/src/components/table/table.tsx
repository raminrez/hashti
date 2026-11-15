"use client";

import { type ReactNode, type Ref } from "react";
import {
  Table as RACTable,
  TableLoadMoreItem as RACTableLoadMoreItem,
  Column as RACColumn,
  TableHeader,
  TableBody,
  TableFooter,
  Row,
  Cell,
  ColumnResizer,
  ResizableTableContainer,
  composeRenderProps,
  type TableProps as RACTableProps,
  type TableLoadMoreItemProps as RACTableLoadMoreItemProps,
  type ColumnProps as RACColumnProps,
  type TableHeaderProps,
  type TableBodyProps,
  type RowProps,
  type CellProps,
} from "react-aria-components";
import { Button } from "../button";
import { classes, cx, type ControlSize } from "../../utils";

export interface TableProps extends RACTableProps {
  size?: ControlSize | "xl";
  ref?: Ref<HTMLDivElement | HTMLTableElement>;
}

function TableDefault({ className, size = "lg", ...props }: TableProps) {
  // Wide tables cannot shrink below their columns, so the table scrolls inside its own
  // container instead of being clipped by whatever card wraps it (DESIGN: fit the container).
  return (
    <div className="hashti-table-scroll" data-slot="scroll">
      <RACTable {...props} data-size={size} className={classes("hashti-table", className)} />
    </div>
  );
}

export interface TableLoadMoreProps extends Omit<
  RACTableLoadMoreItemProps,
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

export function TableLoadMore({
  isLoading,
  isError = false,
  errorMessage = "Failed to load more rows",
  retryLabel = "Retry",
  onRetry,
  label = "Loading more rows…",
  className,
  children,
  ...props
}: TableLoadMoreProps) {
  const isVisible = Boolean(isLoading || isError);

  return (
    <RACTableLoadMoreItem
      {...props}
      isLoading={isVisible}
      className={cx("hashti-table-load-more", className)}
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
    </RACTableLoadMoreItem>
  );
}

export interface ColumnProps extends RACColumnProps {
  ref?: Ref<HTMLTableCellElement | HTMLDivElement>;
}

export function Column({ className, children, id, ...props }: ColumnProps) {
  const derivedId = id ?? (typeof children === "string" ? children : undefined);
  return (
    <RACColumn {...props} id={derivedId} className={classes("hashti-column", className)}>
      {composeRenderProps(children, (content, { allowsSorting, sortDirection }) => (
        <>
          {content}
          {allowsSorting && (
            <span className="hashti-sort-icon" aria-hidden="true" data-direction={sortDirection}>
              {sortDirection === "ascending" ? "↑" : "↓"}
            </span>
          )}
        </>
      ))}
    </RACColumn>
  );
}

export interface TableBatchActionsProps {
  totalSelected: number;
  onCancel?: () => void;
  cancelLabel?: string;
  selectedLabel?: (count: number) => ReactNode;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function TableBatchActions({
  totalSelected,
  onCancel,
  cancelLabel = "Cancel",
  selectedLabel,
  children,
  className,
  ref,
}: TableBatchActionsProps) {
  if (totalSelected <= 0) return null;

  const countText = selectedLabel
    ? selectedLabel(totalSelected)
    : `${totalSelected} item${totalSelected === 1 ? "" : "s"} selected`;

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label="Table batch actions"
      className={cx("hashti-table-batch-actions", className)}
    >
      <div className="hashti-table-batch-bar">
        <span className="hashti-table-batch-count">{countText}</span>
        <div className="hashti-table-batch-action-list">
          {children}
          {onCancel && (
            <Button variant="ghost" size="sm" onPress={onCancel}>
              {cancelLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export const Table = Object.assign(TableDefault, {
  LoadMore: TableLoadMore,
  BatchActions: TableBatchActions,
});

export { TableHeader, TableBody, TableFooter, Row, Cell, ColumnResizer, ResizableTableContainer };
export type { TableHeaderProps, TableBodyProps, RowProps, CellProps };
