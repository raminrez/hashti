"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Popover,
  PopoverClose as UiPopoverClose,
  PopoverContent as UiPopoverContent,
  PopoverDescription as UiPopoverDescription,
  PopoverTitle as UiPopoverTitle,
  PopoverTrigger as UiPopoverTrigger,
} from "@ui-sdk/react/popover";

function PopoverTrigger(props: ComponentProps<typeof UiPopoverTrigger>) {
  return (
    <UiPopoverTrigger
      {...props}
      className={join("hashti-popover-trigger", props.className)}
    />
  );
}

function PopoverContent(props: ComponentProps<typeof UiPopoverContent>) {
  return (
    <UiPopoverContent
      {...props}
      className={join("hashti-popover-content", props.className)}
    />
  );
}

function PopoverTitle(props: ComponentProps<typeof UiPopoverTitle>) {
  return (
    <UiPopoverTitle
      {...props}
      className={join("hashti-popover__title", props.className)}
    />
  );
}

function PopoverDescription(
  props: ComponentProps<typeof UiPopoverDescription>,
) {
  return (
    <UiPopoverDescription
      {...props}
      className={join("hashti-popover__description", props.className)}
    />
  );
}

function PopoverClose(props: ComponentProps<typeof UiPopoverClose>) {
  return (
    <UiPopoverClose
      {...props}
      className={join("hashti-popover-close", props.className)}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
};
