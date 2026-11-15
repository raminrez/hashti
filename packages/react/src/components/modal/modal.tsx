"use client";

import type { Ref } from "react";
import { Modal as RACModal, ModalOverlay, type ModalOverlayProps } from "react-aria-components";
import { classes } from "../../utils";
import { useOverlayTheme } from "../../theme";

export type ModalBackdrop = "dim" | "blur" | "none";

export interface ModalProps extends ModalOverlayProps {
  size?: "xs" | "sm" | "md" | "lg";
  /**
   * The scrim behind the surface. `dim` is DESIGN's `rgb(18 22 32 / 50%)` token, `blur` adds a
   * 6px blur on top of it, `none` leaves the page untouched for surfaces with their own scrim.
   *
   * @default "dim"
   */
  backdrop?: ModalBackdrop;
  ref?: Ref<HTMLDivElement>;
  overlayClassName?: ModalOverlayProps["className"];
  overlayRef?: Ref<HTMLDivElement>;
  modalStyle?: ModalOverlayProps["style"];
}

export function Modal({
  size = "md",
  backdrop = "dim",
  children,
  className,
  ref,
  overlayClassName,
  overlayRef,
  modalStyle,
  ...props
}: ModalProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  const resolvedDir = (props as { dir?: "ltr" | "rtl" }).dir ?? theme.dir;
  return (
    <ModalOverlay
      {...props}
      {...theme}
      dir={resolvedDir}
      lang={props.lang ?? theme.lang}
      ref={overlayRef}
      data-backdrop={backdrop}
      className={classes(
        "hashti-modal-overlay",
        classes(appearanceClassName ?? "", overlayClassName),
      )}
    >
      <RACModal
        data-slot="root"
        ref={ref}
        dir={resolvedDir}
        data-size={size}
        className={classes("hashti-modal", className)}
        style={modalStyle}
      >
        {children}
      </RACModal>
    </ModalOverlay>
  );
}
