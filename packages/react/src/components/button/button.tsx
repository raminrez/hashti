"use client";

import { useContext, type ComponentProps } from "react";
import { Button as UiSdkButton } from "@ui-sdk/react/button";
import type { ButtonState } from "@ui-sdk/react/button";
import { cx, type ControlSize } from "../../utils";
import { ToolbarContext } from "../toolbar/toolbar";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";

export interface ButtonProps
  extends Omit<ComponentProps<typeof UiSdkButton>, "pendingAnnouncement"> {
  /** Core choices: primary, secondary, danger, ghost, outline. */
  variant?: ButtonVariant;
  /** Frame defaults to 44px; older themes default to 48px. Sizes are minimums. */
  size?: ControlSize;
  /** Square target for an icon. Supply an accessible name on the Button. */
  iconOnly?: boolean;
  /** What screen readers hear once the button has been pending for a second. Localize it. */
  pendingLabel?: string;
  /** A sentence that tells an agent this action changes something; it waits for a person. */
  agentConfirm?: string;
}

export function Button({
  variant = "primary",
  size: requestedSize,
  iconOnly = false,
  pendingLabel,
  agentConfirm,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const size = requestedSize ?? "lg";
  const toolbar = useContext(ToolbarContext);

  const classHook =
    typeof className === "function"
      ? (state: ButtonState) => cx("hashti-button", className(state))
      : cx("hashti-button", className);

  const spinner = (
    <span className="hashti-spinner" data-show="pending" aria-hidden="true" />
  );

  return (
    <UiSdkButton
      {...props}
      // A disabled Toolbar disables its actions, matching its presentation.
      disabled={disabled ?? toolbar.disabled}
      className={classHook}
      data-variant={variant}
      data-size={size}
      data-hashti-size-default={requestedSize === undefined ? "" : undefined}
      data-icon-only={iconOnly || undefined}
      pendingAnnouncement={pendingLabel}
      data-agent-confirm={agentConfirm}
    >
      {(state: ButtonState) => (
        <>
          {typeof children === "function" ? children(state) : children}
          {state.pending && spinner}
        </>
      )}
    </UiSdkButton>
  );
}
