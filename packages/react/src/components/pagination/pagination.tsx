import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import { Button } from "../button";
import { Field } from "../field";
import { Icon } from "../../icons";
import { cx, type ControlSize } from "../../utils";

export interface NativeSelectProps extends Omit<ComponentPropsWithRef<"select">, "size"> {
  label: ReactNode;
  size?: ControlSize;
  description?: ReactNode;
  errorMessage?: ReactNode;
}
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
      {/* Guidance stays visible while recovery is shown: it sits outside the help row. */}
      {description != null && (
        <Field.Description id={descriptionId}>{description}</Field.Description>
      )}
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

export interface PaginationProps {
  totalItems: number;
  page: number;
  pageSize: number;
  pageSizes?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  "aria-label"?: string;
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
}: PaginationProps) {
  const range = paginationRange(totalItems, pageSize, page);
  const sizes = Array.from(
    new Set([...pageSizes.filter((size) => size > 0 && Number.isInteger(size)), range.pageSize]),
  ).sort((a, b) => a - b);
  return (
    <nav aria-label={label} className={["hashti-pagination", className].filter(Boolean).join(" ")}>
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
      <div className="hashti-pagination-actions">
        <Button
          variant="ghost"
          size="md"
          iconOnly
          aria-label="Previous page"
          isDisabled={range.page <= 1}
          onPress={() => onPageChange(range.page - 1)}
        >
          <Icon name="chevronLeft" />
        </Button>
        <Button
          variant="ghost"
          size="md"
          iconOnly
          aria-label="Next page"
          isDisabled={range.page >= range.pages}
          onPress={() => onPageChange(range.page + 1)}
        >
          <Icon name="chevronRight" />
        </Button>
      </div>
    </nav>
  );
}
