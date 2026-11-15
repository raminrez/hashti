"use client";

import {
  Autocomplete as RACAutocomplete,
  useFilter,
  type AutocompleteProps as RACAutocompleteProps,
} from "react-aria-components";

export interface AutocompleteProps<T extends object = object> extends RACAutocompleteProps<T> {}

/**
 * Filters its wrapped collection as the user types. Without a `filter` prop React Aria treats the
 * items as already filtered (async search), so the default here is the locale-aware `contains`.
 */
export function Autocomplete<T extends object = object>({
  filter,
  children,
  ...props
}: AutocompleteProps<T>) {
  const { contains } = useFilter({ sensitivity: "base" });
  return (
    <RACAutocomplete {...props} filter={filter ?? contains}>
      {children}
    </RACAutocomplete>
  );
}
