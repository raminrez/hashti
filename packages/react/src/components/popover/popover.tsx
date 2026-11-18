"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  Popover as UiSdkPopover,
  PopoverTrigger as UiSdkPopoverTrigger,
  PopoverContent as UiSdkPopoverContent,
  PopoverArrow as UiSdkPopoverArrow,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverShortcut,
  createPopoverController,
} from "@ui-sdk/react/popover";
import { useOverlayTheme } from "../../theme";
import { uiClass } from "../../utils";

export type PopoverSize = "sm" | "md" | "lg";

export type PopoverRootProps = ComponentProps<typeof UiSdkPopover>;

function PopoverRoot(props: PopoverRootProps) {
  return <UiSdkPopover {...props} />;
}

export type PopoverTriggerProps = ComponentProps<typeof UiSdkPopoverTrigger>;

function PopoverTrigger({ className, ...props }: PopoverTriggerProps) {
  return (
    <UiSdkPopoverTrigger {...props} className={uiClass(className, "hashti-popover-trigger")} />
  );
}

export interface PopoverContentProps extends ComponentProps<typeof UiSdkPopoverContent> {
  size?: PopoverSize;
}

function PopoverContent({ size, className, ...props }: PopoverContentProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <UiSdkPopoverContent
      {...props}
      {...theme}
      data-size={size}
      className={uiClass(className, "hashti-popover", appearanceClassName)}
    />
  );
}

export type PopoverArrowProps = ComponentProps<typeof UiSdkPopoverArrow>;

function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  return <UiSdkPopoverArrow {...props} className={uiClass(className, "hashti-popover-arrow")} />;
}

interface PopoverCompound {
  (props: PopoverRootProps): ReactNode;
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Arrow: typeof PopoverArrow;
  Title: typeof PopoverTitle;
  Description: typeof PopoverDescription;
  Close: typeof PopoverClose;
  Shortcut: typeof PopoverShortcut;
}

export const Popover: PopoverCompound = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  Shortcut: PopoverShortcut,
});

export {
  createPopoverController,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverShortcut,
};
