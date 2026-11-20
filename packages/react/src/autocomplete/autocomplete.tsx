"use client"

import type { ComponentProps } from "react"
import {
  Autocomplete,
  AutocompleteContent as UiAutocompleteContent,
  AutocompleteEmpty as UiAutocompleteEmpty,
  AutocompleteInput as UiAutocompleteInput,
  AutocompleteItem as UiAutocompleteItem,
  AutocompleteLabel as UiAutocompleteLabel,
  AutocompleteList as UiAutocompleteList,
} from "@ui-sdk/react/autocomplete"

const join = <State,>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined,
): string | ((state: State) => string | undefined) => {
  if (typeof className === "function") {
    return (state: State) => {
      const extra = className(state)
      return extra ? `${base} ${extra}` : base
    }
  }
  return className ? `${base} ${className}` : base
}

// The root renders no element of its own, so it is re-exported directly.
function AutocompleteLabel(props: ComponentProps<typeof UiAutocompleteLabel>) {
  return (
    <UiAutocompleteLabel
      {...props}
      className={join("hashti-autocomplete__label", props.className)}
    />
  )
}

function AutocompleteInput(props: ComponentProps<typeof UiAutocompleteInput>) {
  return (
    <UiAutocompleteInput
      {...props}
      className={join("hashti-autocomplete-input", props.className)}
    />
  )
}

function AutocompleteContent(props: ComponentProps<typeof UiAutocompleteContent>) {
  return (
    <UiAutocompleteContent
      {...props}
      className={join("hashti-autocomplete-content", props.className)}
    />
  )
}

function AutocompleteList(props: ComponentProps<typeof UiAutocompleteList>) {
  return (
    <UiAutocompleteList
      {...props}
      className={join("hashti-autocomplete-list", props.className)}
    />
  )
}

function AutocompleteItem(props: ComponentProps<typeof UiAutocompleteItem>) {
  return (
    <UiAutocompleteItem
      {...props}
      className={join("hashti-autocomplete-item", props.className)}
    />
  )
}

function AutocompleteEmpty(props: ComponentProps<typeof UiAutocompleteEmpty>) {
  return (
    <UiAutocompleteEmpty
      {...props}
      className={join("hashti-autocomplete-empty", props.className)}
    />
  )
}

export {
  Autocomplete,
  AutocompleteLabel,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
}
