"use client";

import { useMemo, type ComponentProps } from "react";
import { Button as UiSdkButton } from "@ui-sdk/react/button";
import type { ButtonState } from "@ui-sdk/react/button";
import { cx } from "../../utils";

export interface LinkProps
  extends Omit<ComponentProps<typeof UiSdkButton>, "render" | "type"> {
  /** Destination. A disabled or href-less link renders a span with link semantics. */
  href?: string;
  target?: string;
  rel?: string;
  /** Renders the link as this element instead, e.g. a router's link component. */
  render?: ComponentProps<typeof UiSdkButton>["render"];
  /** Always underline links within prose; navigation behavior is unchanged. */
  inline?: boolean;
}

export function Link({ href, target, rel, disabled, className, inline, render, ...props }: LinkProps) {
  const classHook =
    typeof className === "function"
      ? (state: ButtonState) => cx("hashti-link", className(state))
      : cx("hashti-link", className);

  // A ui-sdk Button keeps link behavior when it renders an anchor, including
  // blocking navigation while disabled. Without an href it falls back to a span
  // with link semantics, which still responds to Enter.
  const anchor = useMemo(
    () =>
      disabled || href === undefined ? (
        <span role="link" />
      ) : (
        <a href={href} target={target} rel={rel} />
      ),
    [href, target, rel, disabled],
  );

  return (
    <UiSdkButton
      {...props}
      disabled={disabled}
      className={classHook}
      data-inline={inline || undefined}
      render={render ?? anchor}
    />
  );
}
