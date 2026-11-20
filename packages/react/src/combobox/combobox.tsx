"use client"

import type { ComponentProps } from "react"
import {
  Combobox,
  ComboboxContent as UiComboboxContent,
  ComboboxInput as UiComboboxInput,
  ComboboxItem as UiComboboxItem,
  ComboboxLabel as UiComboboxLabel,
  ComboboxList as UiComboboxList,
} from "@ui-sdk/react/combobox"

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
function ComboboxLabel(props: ComponentProps<typeof UiComboboxLabel>) {
  return (
    <UiComboboxLabel
      {...props}
      className={join("hashti-combobox__label", props.className)}
    />
  )
}

function ComboboxInput(props: ComponentProps<typeof UiComboboxInput>) {
  return (
    <UiComboboxInput
      {...props}
      className={join("hashti-combobox-input", props.className)}
    />
  )
}

function ComboboxContent(props: ComponentProps<typeof UiComboboxContent>) {
  return (
    <UiComboboxContent
      {...props}
      className={join("hashti-combobox-content", props.className)}
    />
  )
}

function ComboboxList(props: ComponentProps<typeof UiComboboxList>) {
  return (
    <UiComboboxList
      {...props}
      className={join("hashti-combobox-list", props.className)}
    />
  )
}

// Generic, so value types survive; ComponentProps would infer {}.
function ComboboxItem<T = string>(props: ComponentProps<typeof UiComboboxItem<T>>) {
  return (
    <UiComboboxItem
      {...props}
      className={join("hashti-combobox-item", props.className)}
    />
  )
}

export { Combobox, ComboboxLabel, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem }
