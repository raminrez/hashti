"use client";

/**
 * Autocomplete is a straight re-export of ui-sdk's autocomplete: an input with
 * a suggestion popup (list, groups, empty/status parts). Hashti styles target
 * its `data-slot` and state attributes. For a picker that commits values into
 * a form, use `ComboBox`.
 */
export {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemIcon,
  AutocompleteItemText,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  createAutocompleteController,
  type AutocompleteProps,
} from "@ui-sdk/react/autocomplete";
