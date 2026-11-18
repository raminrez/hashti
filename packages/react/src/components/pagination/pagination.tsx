"use client";

import { useId, type ComponentProps, type ComponentPropsWithRef, type ReactNode } from "react";
import {
  Pagination as UiSdkPagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/react/pagination";
import { Field } from "../field";
import { Icon } from "../../icons";
import { cx, type ControlSize } from "../../utils";

export interface NativeSelectProps extends Omit<ComponentPropsWithRef<"select">, "size"> {
  label: ReactNode;
  size?: ControlSize;
  description?: ReactNode;
  errorMessage?: ReactNode;
}

/** A native `<select>` in the field anatomy, used here as the page-size picker. */
export function NativeSelect({
  label,
  size = "md",
  description,
  errorMessage,
  className,
  id: providedId,
  ...props
}: NativeSelectProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = errorMessage ? `${id}-error` : undefined;
  return (
    <Field
      className={cx("hashti-native-select", className)}
      data-size={size}
      data-disabled={props.disabled || undefined}
      data-invalid={Boolean(errorMessage) || undefined}
    >
      <Field.Label htmlFor={id}>{label}</Field.Label>
      {description != null && <Field.Description id={descriptionId}>{description}</Field.Description>}
      <div className="hashti-native-select-control">
        <select
          {...props}
          id={id}
          aria-invalid={props["aria-invalid"] ?? Boolean(errorMessage)}
          aria-describedby={
            [props["aria-describedby"], descriptionId, errorId].filter(Boolean).join(" ") ||
            undefined
          }
        />
        <Icon name="chevronDown" />
      </div>
      {errorMessage != null && (
        <Field.Help>
          <Field.ErrorMessage id={errorId}>{errorMessage}</Field.ErrorMessage>
        </Field.Help>
      )}
    </Field>
  );
}

/** The range math the parts use, kept for consumers that page their own data. */
export function paginationRange(totalItems: number, pageSize: number, page: number) {
  const total = Number.isFinite(totalItems) ? Math.max(0, Math.floor(totalItems)) : 0;
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10;
  const pages = Math.max(1, Math.ceil(total / size));
  const current = Math.max(1, Math.min(Number.isFinite(page) ? Math.floor(page) : 1, pages));
  return {
    page: current,
    pageSize: size,
    pages,
    start: total ? (current - 1) * size + 1 : 0,
    end: Math.min(current * size, total),
    total,
  };
}

export interface PaginationProps
  extends Omit<ComponentProps<typeof UiSdkPagination>, "children" | "className" | "page" | "onPageChange"> {
  /** Controlled current page. */
  page: number;
  /** Called with the requested page. */
  onPageChange: (page: number) => void;
  /** Total number of items across every page. */
  totalItems: number;
  /** How many items fit on a page. */
  pageSize?: number;
  /** The page sizes offered in the picker. */
  pageSizes?: number[];
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export function Pagination({
  totalItems,
  page,
  pageSize,
  pageSizes = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  "aria-label": label = "Pagination",
  className,
  ...props
}: PaginationProps) {
  const range = paginationRange(totalItems, pageSize ?? 10, page);
  const sizes = Array.from(
    new Set([...pageSizes.filter((size) => size > 0 && Number.isInteger(size)), range.pageSize]),
  ).sort((a, b) => a - b);
  return (
    <nav aria-label={label} className={cx("hashti-pagination", className)}>
      {onPageSizeChange && (
        <NativeSelect
          label="Items per page"
          size="sm"
          value={range.pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {sizes.map((size) => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </NativeSelect>
      )}
      <span className="hashti-pagination-count" aria-live="polite">
        {range.start}–{range.end} of {range.total} items
      </span>
      <span>
        {range.page} of {range.pages} pages
      </span>
      <UiSdkPagination
        aria-label={label}
        page={range.page}
        pageCount={range.pages}
        onPageChange={onPageChange}
        {...props}
        className="hashti-pagination-pages"
      >
        <PaginationList className="hashti-pagination-actions">
          <PaginationItem>
            <PaginationPrevious
              aria-label="Previous page"
              className="hashti-button"
              data-variant="ghost"
            >
              <Icon name="chevronLeft" />
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              aria-label="Next page"
              className="hashti-button"
              data-variant="ghost"
            >
              <Icon name="chevronRight" />
            </PaginationNext>
          </PaginationItem>
        </PaginationList>
      </UiSdkPagination>
    </nav>
  );
}

export { PaginationItem, PaginationLink, PaginationList };
