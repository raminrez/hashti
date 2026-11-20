"use client";

import type { ComponentProps } from "react";
import type { ListboxProps } from "@ui-sdk/react/listbox";
import { join } from "@hashti/utils";
import {
  Listbox as UiListbox,
  ListboxGroup as UiListboxGroup,
  ListboxGroupLabel as UiListboxGroupLabel,
  ListboxItem as UiListboxItem,
  ListboxItemIndicator as UiListboxItemIndicator,
  ListboxSeparator as UiListboxSeparator,
} from "@ui-sdk/react/listbox";

// Generic, so value types survive; ComponentProps would infer {}.
function Listbox<T = string, Multiple extends boolean | undefined = false>(
  props: ListboxProps<T, Multiple>,
) {
  // Cast: spreading a conditional multiple-value union into the generic root breaks inference.
  return (
    <UiListbox
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      {...(props as ListboxProps<T>)}
      className={join("hashti-listbox", props.className)}
    />
  );
}

function ListboxItem(props: ComponentProps<typeof UiListboxItem>) {
  return (
    <UiListboxItem
      {...props}
      className={join("hashti-listbox-item", props.className)}
    />
  );
}

function ListboxItemIndicator(
  props: ComponentProps<typeof UiListboxItemIndicator>,
) {
  return (
    <UiListboxItemIndicator
      {...props}
      className={join("hashti-listbox-item__indicator", props.className)}
    />
  );
}

function ListboxGroup(props: ComponentProps<typeof UiListboxGroup>) {
  return (
    <UiListboxGroup
      {...props}
      className={join("hashti-listbox-group", props.className)}
    />
  );
}

function ListboxGroupLabel(props: ComponentProps<typeof UiListboxGroupLabel>) {
  return (
    <UiListboxGroupLabel
      {...props}
      className={join("hashti-listbox__group-label", props.className)}
    />
  );
}

function ListboxSeparator(props: ComponentProps<typeof UiListboxSeparator>) {
  return (
    <UiListboxSeparator
      {...props}
      className={join("hashti-listbox-separator", props.className)}
    />
  );
}

export {
  Listbox,
  ListboxItem,
  ListboxItemIndicator,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxSeparator,
};
