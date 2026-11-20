"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Pagination as UiPagination,
  PaginationEllipsis as UiPaginationEllipsis,
  PaginationFirst as UiPaginationFirst,
  PaginationItem as UiPaginationItem,
  PaginationLast as UiPaginationLast,
  PaginationLink as UiPaginationLink,
  PaginationList as UiPaginationList,
  PaginationNext as UiPaginationNext,
  PaginationPrevious as UiPaginationPrevious,
} from "@ui-sdk/react/pagination";

function Pagination(props: ComponentProps<typeof UiPagination>) {
  return (
    <UiPagination
      {...props}
      className={join("hashti-pagination", props.className)}
    />
  );
}

function PaginationList(props: ComponentProps<typeof UiPaginationList>) {
  return (
    <UiPaginationList
      {...props}
      className={join("hashti-pagination-list", props.className)}
    />
  );
}

function PaginationItem(props: ComponentProps<typeof UiPaginationItem>) {
  return (
    <UiPaginationItem
      {...props}
      className={join("hashti-pagination__item", props.className)}
    />
  );
}

function PaginationLink(props: ComponentProps<typeof UiPaginationLink>) {
  return (
    <UiPaginationLink
      {...props}
      className={join("hashti-pagination-link", props.className)}
    />
  );
}

function PaginationEllipsis(
  props: ComponentProps<typeof UiPaginationEllipsis>,
) {
  return (
    <UiPaginationEllipsis
      {...props}
      className={join("hashti-pagination-ellipsis", props.className)}
    />
  );
}

function PaginationPrevious(
  props: ComponentProps<typeof UiPaginationPrevious>,
) {
  return (
    <UiPaginationPrevious
      {...props}
      className={join("hashti-pagination-step", props.className)}
    />
  );
}

function PaginationNext(props: ComponentProps<typeof UiPaginationNext>) {
  return (
    <UiPaginationNext
      {...props}
      className={join("hashti-pagination-step", props.className)}
    />
  );
}

function PaginationFirst(props: ComponentProps<typeof UiPaginationFirst>) {
  return (
    <UiPaginationFirst
      {...props}
      className={join("hashti-pagination-step", props.className)}
    />
  );
}

function PaginationLast(props: ComponentProps<typeof UiPaginationLast>) {
  return (
    <UiPaginationLast
      {...props}
      className={join("hashti-pagination-step", props.className)}
    />
  );
}

export {
  Pagination,
  PaginationList,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
};
