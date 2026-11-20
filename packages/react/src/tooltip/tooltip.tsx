"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Tooltip as UiTooltip,
  TooltipContent as UiTooltipContent,
  TooltipTrigger as UiTooltipTrigger,
} from "@ui-sdk/react/tooltip";
import { useOverlayTheme } from "../theme";

function Tooltip(props: ComponentProps<typeof UiTooltip>) {
  const theme = useOverlayTheme();
  return <UiTooltip container={theme?.container} {...props} />;
}

function TooltipTrigger(props: ComponentProps<typeof UiTooltipTrigger>) {
  return (
    <UiTooltipTrigger
      {...props}
      className={join("hashti-tooltip-trigger", props.className)}
    />
  );
}

function TooltipContent(props: ComponentProps<typeof UiTooltipContent>) {
  return (
    <UiTooltipContent
      {...props}
      className={join("hashti-tooltip-content", props.className)}
    />
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };
