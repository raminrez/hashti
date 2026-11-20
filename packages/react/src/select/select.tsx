"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Select as UiSelect,
  SelectContent as UiSelectContent,
  SelectEmpty as UiSelectEmpty,
  SelectGroup as UiSelectGroup,
  SelectGroupLabel as UiSelectGroupLabel,
  SelectItem as UiSelectItem,
  SelectItemIndicator as UiSelectItemIndicator,
  SelectLabel as UiSelectLabel,
  SelectSeparator as UiSelectSeparator,
  SelectTrigger as UiSelectTrigger,
  SelectValue as UiSelectValue,
  type SelectProps,
} from "@ui-sdk/react/select";
import { useOverlayTheme } from "../theme";

function Select<T = string, Multiple extends boolean | undefined = false>(
  props: SelectProps<T, Multiple>,
) {
  const theme = useOverlayTheme();
  return <UiSelect<T, Multiple> container={theme?.container} {...props} />;
}

function SelectLabel(props: ComponentProps<typeof UiSelectLabel>) {
  return (
    <UiSelectLabel
      {...props}
      className={join("hashti-select__label", props.className)}
    />
  );
}

function SelectTrigger(props: ComponentProps<typeof UiSelectTrigger>) {
  return (
    <UiSelectTrigger
      {...props}
      className={join("hashti-select-trigger", props.className)}
    />
  );
}

function SelectValue(props: ComponentProps<typeof UiSelectValue>) {
  return (
    <UiSelectValue
      {...props}
      className={join("hashti-select__value", props.className)}
    />
  );
}

function SelectContent(props: ComponentProps<typeof UiSelectContent>) {
  return (
    <UiSelectContent
      {...props}
      className={join("hashti-select-content", props.className)}
    />
  );
}

function SelectGroup(props: ComponentProps<typeof UiSelectGroup>) {
  return (
    <UiSelectGroup
      {...props}
      className={join("hashti-select__group", props.className)}
    />
  );
}

function SelectGroupLabel(props: ComponentProps<typeof UiSelectGroupLabel>) {
  return (
    <UiSelectGroupLabel
      {...props}
      className={join("hashti-select__group-label", props.className)}
    />
  );
}

function SelectItem(props: ComponentProps<typeof UiSelectItem>) {
  return (
    <UiSelectItem
      {...props}
      className={join("hashti-select-item", props.className)}
    />
  );
}

function SelectItemIndicator(
  props: ComponentProps<typeof UiSelectItemIndicator>,
) {
  return (
    <UiSelectItemIndicator
      {...props}
      className={join("hashti-select-item__indicator", props.className)}
    />
  );
}

function SelectSeparator(props: ComponentProps<typeof UiSelectSeparator>) {
  return (
    <UiSelectSeparator
      {...props}
      className={join("hashti-select-separator", props.className)}
    />
  );
}

function SelectEmpty(props: ComponentProps<typeof UiSelectEmpty>) {
  return (
    <UiSelectEmpty
      {...props}
      className={join("hashti-select-empty", props.className)}
    />
  );
}

export {
  Select,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectSeparator,
  SelectEmpty,
};
