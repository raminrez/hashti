"use client";

import type { ReactNode, Ref } from "react";
import {
  Dialog as RACDialog,
  Heading,
  type DialogProps as RACDialogProps,
  type ModalOverlayProps,
} from "react-aria-components";
import { Modal } from "../modal";
import type { ModalBackdrop } from "../modal";
import { Button } from "../button";
import { Icon } from "../../icons";
import { classes } from "../../utils";

export interface DialogProps extends RACDialogProps {
  ref?: Ref<HTMLElement>;
}

export function Dialog({ className, ...props }: DialogProps) {
  return (
    <RACDialog
      {...props}
      data-slot="root"
      className={["hashti-dialog", className].filter(Boolean).join(" ")}
    />
  );
}

export type AlertDialogKind = "danger" | "warning" | "info";

export interface AlertDialogProps extends Omit<ModalOverlayProps, "children"> {
  title: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  kind?: AlertDialogKind;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isPending?: boolean;
  /** The scrim behind the dialog. Matches Modal: `dim` (default), `blur`, or `none`. */
  backdrop?: ModalBackdrop;
  dir?: "ltr" | "rtl";
  ref?: Ref<HTMLDivElement>;
}

export function AlertDialog({
  title,
  children,
  description,
  kind = "danger",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isPending = false,
  dir,
  className,
  ref,
  ...props
}: AlertDialogProps) {
  const iconName = kind === "danger" ? "alert" : kind === "warning" ? "warning" : "info";
  const bodyContent = children ?? description;

  return (
    <Modal
      {...props}
      dir={dir}
      size="sm"
      isDismissable={false}
      className={classes("hashti-alert-modal", className)}
    >
      <Dialog role="alertdialog" className="hashti-alert-dialog" ref={ref}>
        {({ close }) => (
          <>
            <div className="hashti-alert-dialog-header" data-kind={kind}>
              <Icon name={iconName} size={24} />
              <div>
                <Heading slot="title">{title}</Heading>
              </div>
            </div>
            {bodyContent && <div className="hashti-alert-dialog-body">{bodyContent}</div>}
            <div className="hashti-alert-dialog-footer">
              <Button
                variant="secondary"
                onPress={() => {
                  onCancel?.();
                  close();
                }}
                isDisabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={kind === "danger" ? "danger" : "primary"}
                isPending={isPending}
                onPress={() => {
                  onConfirm?.();
                  close();
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </Modal>
  );
}
