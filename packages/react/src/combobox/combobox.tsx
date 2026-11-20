"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Combobox as UiCombobox,
  ComboboxChip as UiComboboxChip,
  ComboboxChipRemove as UiComboboxChipRemove,
  ComboboxChips as UiComboboxChips,
  ComboboxContent as UiComboboxContent,
  ComboboxInput as UiComboboxInput,
  ComboboxItem as UiComboboxItem,
  ComboboxLabel as UiComboboxLabel,
  ComboboxList as UiComboboxList,
  ComboboxValue,
  type ComboboxProps,
} from "@ui-sdk/react/combobox";
import { useOverlayTheme } from "../theme";

function Combobox<T = string, Multiple extends boolean | undefined = false>(
  props: ComboboxProps<T, Multiple>,
) {
  const theme = useOverlayTheme();
  return <UiCombobox<T, Multiple> container={theme?.container} {...props} />;
}

// The root renders no element of its own; the wrapper only injects container.
function ComboboxLabel(props: ComponentProps<typeof UiComboboxLabel>) {
  return (
    <UiComboboxLabel
      {...props}
      className={join("hashti-combobox__label", props.className)}
    />
  );
}

function ComboboxInput(props: ComponentProps<typeof UiComboboxInput>) {
  return (
    <UiComboboxInput
      {...props}
      className={join("hashti-combobox-input", props.className)}
    />
  );
}

function ComboboxContent(props: ComponentProps<typeof UiComboboxContent>) {
  return (
    <UiComboboxContent
      {...props}
      className={join("hashti-combobox-content", props.className)}
    />
  );
}

function ComboboxList(props: ComponentProps<typeof UiComboboxList>) {
  return (
    <UiComboboxList
      {...props}
      className={join("hashti-combobox-list", props.className)}
    />
  );
}

// Generic, so value types survive; ComponentProps would infer {}.
function ComboboxItem<T = string>(
  props: ComponentProps<typeof UiComboboxItem<T>>,
) {
  return (
    <UiComboboxItem
      {...props}
      className={join("hashti-combobox-item", props.className)}
    />
  );
}

function ComboboxChips(props: ComponentProps<typeof UiComboboxChips>) {
  return (
    <UiComboboxChips
      {...props}
      className={join("hashti-combobox-chips", props.className)}
    />
  );
}

function ComboboxChip<T = string>(
  props: ComponentProps<typeof UiComboboxChip<T>>,
) {
  return (
    <UiComboboxChip
      {...props}
      className={join("hashti-combobox-chip", props.className)}
    />
  );
}

function ComboboxChipRemove(
  props: ComponentProps<typeof UiComboboxChipRemove>,
) {
  return (
    <UiComboboxChipRemove
      {...props}
      className={join("hashti-combobox-chip-remove", props.className)}
    />
  );
}

export {
  Combobox,
  ComboboxLabel,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxChips,
  // Renders no element of its own, so it is re-exported directly.
  ComboboxValue,
  ComboboxChip,
  ComboboxChipRemove,
};
