"use client";

import { type Ref } from "react";
import {
  Switch as RACSwitch,
  composeRenderProps,
  type SwitchProps as RACSwitchProps,
} from "react-aria-components";
import { classes } from "../../utils";
import type { SelectionColor } from "../checkbox";

export interface SwitchProps extends RACSwitchProps {
  color?: SelectionColor;
  size?: "sm" | "md";
  ref?: Ref<HTMLLabelElement>;
}

export function Switch({ className, children, size = "md", color, ...props }: SwitchProps) {
  return (
    <RACSwitch
      {...props}
      data-size={size}
      data-color={color}
      className={classes("hashti-switch", className)}
    >
      {composeRenderProps(children, (content) => (
        <>
          <span className="hashti-switch-track" aria-hidden="true">
            <span className="hashti-switch-thumb" />
          </span>
          {content != null && <span>{content}</span>}
        </>
      ))}
    </RACSwitch>
  );
}
