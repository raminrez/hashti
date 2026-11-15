"use client";

import type { ReactNode, Ref } from "react";
import {
  Popover as RACPopover,
  MenuTrigger,
  Menu,
  type PopoverProps as RACPopoverProps,
  type Key,
} from "react-aria-components";
import { Button } from "../button";
import { Icon } from "../../icons";
import { classes, type ControlSize } from "../../utils";
import { useOverlayTheme } from "../../theme";

export interface PopoverProps extends RACPopoverProps {
  ref?: Ref<HTMLElement>;
}

export function Popover({ className, ...props }: PopoverProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <RACPopover
      {...props}
      {...theme}
      lang={props.lang ?? theme.lang}
      className={classes("hashti-popover", classes(appearanceClassName ?? "", className))}
    />
  );
}

export interface OverflowMenuProps {
  "aria-label": string;
  children: ReactNode;
  onAction?: (key: Key) => void;
  disabledKeys?: Iterable<Key>;
  size?: ControlSize;
  className?: string;
  popoverClassName?: string;
}

export function OverflowMenu({
  "aria-label": ariaLabel,
  children,
  onAction,
  disabledKeys,
  size = "md",
  className,
  popoverClassName,
}: OverflowMenuProps) {
  return (
    <MenuTrigger>
      <Button variant="ghost" iconOnly size={size} aria-label={ariaLabel} className={className}>
        <Icon name="overflow" />
      </Button>
      <Popover className={popoverClassName}>
        <Menu onAction={onAction} disabledKeys={disabledKeys}>
          {children}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
