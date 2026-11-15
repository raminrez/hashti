"use client";

import type { ReactNode, Ref } from "react";
import {
  Heading,
  ModalOverlay,
  Modal as RACModal,
  Dialog as RACDialog,
  type ModalOverlayProps,
} from "react-aria-components";
import { Button } from "../button";
import { Icon } from "../../icons";
import { useOverlayTheme } from "../../theme";
import { classes } from "../../utils";
import { type ModalBackdrop } from "../modal";

export type DrawerPlacement = "left" | "right" | "top" | "bottom" | "start" | "end";
export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps extends Omit<ModalOverlayProps, "children"> {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  /** The scrim behind the drawer. Matches Modal: `dim` (default), `blur`, or `none`. */
  backdrop?: ModalBackdrop;
  isDismissable?: boolean;
  dir?: "ltr" | "rtl";
  className?: string;
  overlayClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Drawer({
  title,
  description,
  children,
  footer,
  placement = "end",
  size = "md",
  backdrop = "dim",
  isDismissable = true,
  dir,
  className,
  overlayClassName,
  ref,
  ...props
}: DrawerProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  const resolvedDir = dir ?? theme.dir;

  return (
    <ModalOverlay
      {...props}
      {...theme}
      dir={resolvedDir}
      isDismissable={isDismissable}
      data-backdrop={backdrop}
      className={classes(
        "hashti-drawer-overlay",
        classes(appearanceClassName ?? "", overlayClassName),
      )}
    >
      <RACModal
        ref={ref}
        dir={resolvedDir}
        data-placement={placement}
        data-size={size}
        className={classes("hashti-drawer", className)}
      >
        <RACDialog role="dialog" className="hashti-drawer-dialog">
          {({ close }) => (
            <>
              {(title != null || isDismissable) && (
                <div className="hashti-drawer-header">
                  <div className="hashti-drawer-header-content">
                    {title != null && (
                      <Heading slot="title" className="hashti-drawer-title">
                        {title}
                      </Heading>
                    )}
                    {description != null && (
                      <div className="hashti-drawer-description">{description}</div>
                    )}
                  </div>
                  {isDismissable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label="Close drawer"
                      className="hashti-drawer-close"
                      onPress={close}
                    >
                      <Icon name="close" />
                    </Button>
                  )}
                </div>
              )}
              <div className="hashti-drawer-body">{children}</div>
              {footer != null && <div className="hashti-drawer-footer">{footer}</div>}
            </>
          )}
        </RACDialog>
      </RACModal>
    </ModalOverlay>
  );
}
