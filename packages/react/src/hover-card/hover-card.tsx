"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  HoverCard as UiHoverCard,
  HoverCardContent as UiHoverCardContent,
  HoverCardTrigger as UiHoverCardTrigger,
} from "@ui-sdk/react/hover-card";
import { useOverlayTheme } from "../theme";

function HoverCard(props: ComponentProps<typeof UiHoverCard>) {
  const theme = useOverlayTheme();
  return <UiHoverCard container={theme?.container} {...props} />;
}

function HoverCardTrigger(props: ComponentProps<typeof UiHoverCardTrigger>) {
  return (
    <UiHoverCardTrigger
      {...props}
      className={join("hashti-hover-card-trigger", props.className)}
    />
  );
}

function HoverCardContent(props: ComponentProps<typeof UiHoverCardContent>) {
  return (
    <UiHoverCardContent
      {...props}
      className={join("hashti-hover-card-content", props.className)}
    />
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
