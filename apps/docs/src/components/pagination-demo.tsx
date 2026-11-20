"use client";

import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@hashti/react";

export function PaginationDemo() {
  return (
    <Pagination aria-label="Results pages" pageCount={10} defaultPage={6}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationItem>
              <PaginationPrevious aria-label="Previous page" />
            </PaginationItem>
            {items.map((item) => (
              <PaginationItem key={item}>
                {typeof item === "number" ? (
                  <PaginationLink page={item} />
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext aria-label="Next page" />
            </PaginationItem>
          </>
        )}
      </PaginationList>
    </Pagination>
  );
}
