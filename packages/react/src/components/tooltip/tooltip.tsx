"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  Tooltip as UiSdkTooltip,
  TooltipTrigger as UiSdkTooltipTrigger,
  TooltipContent as UiSdkTooltipContent,
  TooltipArrow as UiSdkTooltipArrow,
  TooltipShortcut,
  createTooltipController,
} from "@ui-sdk/react/tooltip";
import { useOverlayTheme } from "../../theme";
import { uiClass } from "../../utils";

export type TooltipRootProps = ComponentProps<typeof UiSdkTooltip>;

/**
 * Groups a trigger and its hint. Hashti's default `delay` is 300ms (ui-sdk's
 * is 600ms); keyboard focus always opens the tooltip at once.
 */
function TooltipRoot({ delay = 300, ...props }: TooltipRootProps) {
  return <UiSdkTooltip delay={delay} {...props} />;
}

export type TooltipTriggerProps = ComponentProps<typeof UiSdkTooltipTrigger>;

function TooltipTrigger(props: TooltipTriggerProps) {
  return <UiSdkTooltipTrigger {...props} />;
}

export interface TooltipContentProps
  extends Omit<ComponentProps<typeof UiSdkTooltipContent>, "children"> {
  /** Point at the trigger with an arrow. Default true. */
  arrow?: boolean;
  children?: ReactNode;
}

function TooltipContent({ arrow = true, className, children, ...props }: TooltipContentProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <UiSdkTooltipContent
      {...props}
      {...theme}
      className={uiClass(className, "hashti-tooltip", appearanceClassName)}
    >
      {arrow ? (
        <UiSdkTooltipArrow>
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path d="M0 0h8L4 4Z" />
          </svg>
        </UiSdkTooltipArrow>
      ) : null}
      {children}
    </UiSdkTooltipContent>
  );
}

export type TooltipArrowProps = ComponentProps<typeof UiSdkTooltipArrow>;

const TooltipArrow: typeof UiSdkTooltipArrow = UiSdkTooltipArrow;

interface TooltipCompound {
  (props: TooltipRootProps): ReactNode;
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
  Arrow: typeof TooltipArrow;
  Shortcut: typeof TooltipShortcut;
}

export const Tooltip: TooltipCompound = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  Shortcut: TooltipShortcut,
});

export {
  createTooltipController,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipShortcut,
};
