"use client";

import { createContext, useContext, type ComponentProps, type ReactNode, type Ref } from "react";
import {
  Disclosure as RACDisclosure,
  DisclosureGroup as RACDisclosureGroup,
  DisclosurePanel as RACDisclosurePanel,
  Heading,
  type DisclosureProps as RACDisclosureProps,
  type DisclosureGroupProps as RACDisclosureGroupProps,
  type DisclosurePanelProps as RACDisclosurePanelProps,
} from "react-aria-components";
import { Button } from "../button";
import { Icon } from "../../icons";
import { classes, cx, type ControlSize } from "../../utils";

export interface DisclosureContextValue {
  size?: ControlSize;
  variant?: "default" | "card" | "flush";
}

export const DisclosureContext = createContext<DisclosureContextValue>({
  size: "md",
  variant: "default",
});

export interface DisclosureProps extends Omit<RACDisclosureProps, "className"> {
  size?: ControlSize;
  variant?: "default" | "card" | "flush";
  className?: RACDisclosureProps["className"];
  ref?: Ref<HTMLDivElement>;
}

export function DisclosureRoot({ size, variant, className, children, ...props }: DisclosureProps) {
  const groupContext = useContext(DisclosureContext);
  const resolvedSize = size ?? groupContext.size ?? "md";
  const resolvedVariant = variant ?? groupContext.variant ?? "default";

  const contextValue: DisclosureContextValue = {
    size: resolvedSize,
    variant: resolvedVariant,
  };

  return (
    <DisclosureContext.Provider value={contextValue}>
      <RACDisclosure
        {...props}
        data-size={resolvedSize}
        data-variant={resolvedVariant}
        className={classes("hashti-disclosure", className)}
      >
        {children}
      </RACDisclosure>
    </DisclosureContext.Provider>
  );
}

export interface DisclosureTriggerProps extends Omit<ComponentProps<typeof Button>, "slot"> {
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  ref?: Ref<HTMLButtonElement>;
}

export function DisclosureTrigger({
  headingLevel,
  children,
  className,
  size,
  variant = "ghost",
  ...props
}: DisclosureTriggerProps) {
  const disclosureContext = useContext(DisclosureContext);
  const resolvedSize = size ?? disclosureContext.size ?? "md";

  const button = (
    <Button
      slot="trigger"
      variant={variant}
      size={resolvedSize}
      {...props}
      className={classes("hashti-disclosure-trigger", className)}
    >
      {children}
    </Button>
  );

  if (headingLevel) {
    return <Heading level={headingLevel}>{button}</Heading>;
  }

  return button;
}

export interface DisclosureIndicatorProps extends ComponentProps<"span"> {
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

export function DisclosureIndicator({ children, className, ...props }: DisclosureIndicatorProps) {
  return (
    <span aria-hidden="true" {...props} className={cx("hashti-disclosure-indicator", className)}>
      {children ?? <Icon name="chevronRight" />}
    </span>
  );
}

export interface DisclosurePanelProps extends Omit<RACDisclosurePanelProps, "className"> {
  className?: RACDisclosurePanelProps["className"];
  ref?: Ref<HTMLDivElement>;
}

export function DisclosurePanel({ className, children, ...props }: DisclosurePanelProps) {
  return (
    <RACDisclosurePanel
      {...props}
      className={classes("react-aria-DisclosurePanel hashti-disclosure-panel", className)}
    >
      <div className="hashti-disclosure-panel-inner">{children}</div>
    </RACDisclosurePanel>
  );
}

export interface DisclosureGroupProps extends Omit<RACDisclosureGroupProps, "className"> {
  size?: ControlSize;
  variant?: "default" | "card" | "flush";
  className?: RACDisclosureGroupProps["className"];
  ref?: Ref<HTMLDivElement>;
}

export function DisclosureGroup({
  size = "md",
  variant = "default",
  className,
  children,
  ...props
}: DisclosureGroupProps) {
  const contextValue: DisclosureContextValue = {
    size,
    variant,
  };

  return (
    <DisclosureContext.Provider value={contextValue}>
      <RACDisclosureGroup
        {...props}
        data-size={size}
        data-variant={variant}
        className={classes("hashti-disclosure-group", className)}
      >
        {children}
      </RACDisclosureGroup>
    </DisclosureContext.Provider>
  );
}

export const Disclosure = Object.assign(DisclosureRoot, {
  Root: DisclosureRoot,
  Trigger: DisclosureTrigger,
  Indicator: DisclosureIndicator,
  Panel: DisclosurePanel,
  Group: DisclosureGroup,
});
