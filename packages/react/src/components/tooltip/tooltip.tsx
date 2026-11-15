"use client";

import type { Ref } from "react";
import {
  Tooltip as RACTooltip,
  TooltipTrigger,
  OverlayArrow,
  type TooltipProps as RACTooltipProps,
} from "react-aria-components";
import { classes } from "../../utils";
import { useOverlayTheme } from "../../theme";

export interface TooltipProps extends RACTooltipProps {
  ref?: Ref<HTMLDivElement>;
}

export function Tooltip({ children, className, ...props }: TooltipProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <RACTooltip
      offset={8}
      {...props}
      {...theme}
      lang={props.lang ?? theme.lang}
      className={classes("hashti-tooltip", classes(appearanceClassName ?? "", className))}
    >
      {(state) => (
        <>
          <OverlayArrow>
            <svg width="8" height="8" viewBox="0 0 8 8">
              <path d="M0 0h8L4 4Z" />
            </svg>
          </OverlayArrow>
          {typeof children === "function" ? children(state) : children}
        </>
      )}
    </RACTooltip>
  );
}

export { TooltipTrigger };
