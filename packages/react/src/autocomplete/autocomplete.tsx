"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Autocomplete as UiAutocomplete,
  AutocompleteContent as UiAutocompleteContent,
  AutocompleteEmpty as UiAutocompleteEmpty,
  AutocompleteInput as UiAutocompleteInput,
  AutocompleteItem as UiAutocompleteItem,
  AutocompleteLabel as UiAutocompleteLabel,
  AutocompleteList as UiAutocompleteList,
} from "@ui-sdk/react/autocomplete";
import { useOverlayTheme } from "../theme";

function Autocomplete(props: ComponentProps<typeof UiAutocomplete>) {
  const theme = useOverlayTheme();
  return <UiAutocomplete container={theme?.container} {...props} />;
}

// The root renders no element of its own; the wrapper only injects container.
function AutocompleteLabel(props: ComponentProps<typeof UiAutocompleteLabel>) {
  return (
    <UiAutocompleteLabel
      {...props}
      className={join("hashti-autocomplete__label", props.className)}
    />
  );
}

function AutocompleteInput(props: ComponentProps<typeof UiAutocompleteInput>) {
  return (
    <UiAutocompleteInput
      {...props}
      className={join("hashti-autocomplete-input", props.className)}
    />
  );
}

function AutocompleteContent(
  props: ComponentProps<typeof UiAutocompleteContent>,
) {
  return (
    <UiAutocompleteContent
      {...props}
      className={join("hashti-autocomplete-content", props.className)}
    />
  );
}

function AutocompleteList(props: ComponentProps<typeof UiAutocompleteList>) {
  return (
    <UiAutocompleteList
      {...props}
      className={join("hashti-autocomplete-list", props.className)}
    />
  );
}

function AutocompleteItem(props: ComponentProps<typeof UiAutocompleteItem>) {
  return (
    <UiAutocompleteItem
      {...props}
      className={join("hashti-autocomplete-item", props.className)}
    />
  );
}

function AutocompleteEmpty(props: ComponentProps<typeof UiAutocompleteEmpty>) {
  return (
    <UiAutocompleteEmpty
      {...props}
      className={join("hashti-autocomplete-empty", props.className)}
    />
  );
}

export {
  Autocomplete,
  AutocompleteLabel,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
};
