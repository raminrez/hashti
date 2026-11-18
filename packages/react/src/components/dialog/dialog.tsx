"use client";

import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import {
  Dialog as UiSdkDialog,
  DialogTrigger as UiSdkDialogTrigger,
  DialogBackdrop as UiSdkDialogBackdrop,
  DialogContent as UiSdkDialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogShortcut,
  createDialogController,
} from "@ui-sdk/react/dialog";
import {
  AlertDialog as UiSdkAlertDialog,
  AlertDialogBackdrop as UiSdkAlertDialogBackdrop,
  AlertDialogClose as UiSdkAlertDialogClose,
  AlertDialogContent as UiSdkAlertDialogContent,
  AlertDialogDescription as UiSdkAlertDialogDescription,
  AlertDialogTitle as UiSdkAlertDialogTitle,
  AlertDialogTrigger as UiSdkAlertDialogTrigger,
  createAlertDialogController,
  createConfirm,
} from "@ui-sdk/react/alert-dialog";
import { useOverlayTheme } from "../../theme";
import { cx, uiClass } from "../../utils";
import { Button } from "../button";
import { Icon } from "../../icons";

export type DialogBackdropVariant = "dim" | "blur" | "none";
export type DialogSize = "xs" | "sm" | "md" | "lg";

interface DialogContextValue {
  backdrop: DialogBackdropVariant;
  appearanceClassName?: string;
  theme: { dir?: string; lang?: string; [attribute: string]: unknown };
}

const DialogContext = createContext<DialogContextValue>({ backdrop: "dim", theme: {} });

export interface DialogRootProps extends ComponentProps<typeof UiSdkDialog> {
  /** The scrim behind the surface: `dim` (default), `blur`, or `none`. */
  backdrop?: DialogBackdropVariant;
}

function DialogRoot({ backdrop = "dim", children, ...props }: DialogRootProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <DialogContext.Provider value={{ backdrop, appearanceClassName, theme }}>
      <UiSdkDialog {...props}>{children}</UiSdkDialog>
    </DialogContext.Provider>
  );
}

export type DialogTriggerProps = ComponentProps<typeof UiSdkDialogTrigger>;

function DialogTrigger({ className, ...props }: DialogTriggerProps) {
  return (
    <UiSdkDialogTrigger {...props} className={uiClass(className, "hashti-dialog-trigger")} />
  );
}

export type DialogBackdropProps = ComponentProps<typeof UiSdkDialogBackdrop>;

function DialogBackdrop({ className, ...props }: DialogBackdropProps) {
  const { backdrop, appearanceClassName, theme } = useContext(DialogContext);
  return (
    <UiSdkDialogBackdrop
      {...props}
      {...theme}
      data-backdrop={backdrop}
      className={uiClass(className, "hashti-overlay", appearanceClassName)}
    />
  );
}

export interface DialogContentProps extends ComponentProps<typeof UiSdkDialogContent> {
  size?: DialogSize;
}

function DialogContent({ size = "md", className, ...props }: DialogContentProps) {
  const { appearanceClassName, theme } = useContext(DialogContext);
  return (
    <UiSdkDialogContent
      {...props}
      {...theme}
      data-size={size}
      className={uiClass(className, "hashti-dialog", appearanceClassName)}
    />
  );
}

interface DialogCompound {
  (props: DialogRootProps): ReactNode;
  Trigger: typeof DialogTrigger;
  Backdrop: typeof DialogBackdrop;
  Content: typeof DialogContent;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Close: typeof DialogClose;
  Shortcut: typeof DialogShortcut;
}

export const Dialog: DialogCompound = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Backdrop: DialogBackdrop,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Shortcut: DialogShortcut,
});

export {
  createDialogController,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogShortcut,
  DialogRoot,
  DialogTrigger,
  DialogBackdrop,
  DialogContent,
};

// TICK-007: AlertDialog here is the modal-confirm half of the toast/ split
// (docs/component-inventory.md decisions log item 10); toast/notifications.tsx keeps
// the inline css-only Alert/InlineNotification/ActionableNotification variants.
export type AlertDialogKind = "danger" | "warning" | "info";

export interface AlertDialogProps
  extends Omit<ComponentProps<typeof UiSdkAlertDialog>, "children"> {
  title: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  variant?: AlertDialogKind;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  /** The scrim behind the dialog. Matches Dialog: `dim` (default), `blur`, or `none`. */
  backdrop?: DialogBackdropVariant;
}

export function AlertDialog({
  title,
  children,
  description,
  variant = "danger",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  backdrop = "dim",
  ...props
}: AlertDialogProps) {
  const iconName = variant === "danger" ? "alert" : variant === "warning" ? "warning" : "info";
  const bodyContent = children ?? description;
  const { appearanceClassName, ...theme } = useOverlayTheme();

  return (
    <UiSdkAlertDialog {...props}>
      <UiSdkAlertDialogBackdrop
        {...theme}
        data-backdrop={backdrop}
        className={cx("hashti-overlay", appearanceClassName)}
      />
      <UiSdkAlertDialogContent
        {...theme}
        data-size="sm"
        className={cx("hashti-dialog hashti-alert-dialog", appearanceClassName)}
      >
        <div className="hashti-alert-dialog-header" data-variant={variant}>
          <Icon name={iconName} size={24} />
          <UiSdkAlertDialogTitle>{title}</UiSdkAlertDialogTitle>
        </div>
        {bodyContent != null && (
          <UiSdkAlertDialogDescription className="hashti-alert-dialog-body">
            {bodyContent}
          </UiSdkAlertDialogDescription>
        )}
        <div className="hashti-alert-dialog-footer">
          <UiSdkAlertDialogClose
            render={
              <Button variant="secondary" onClick={onCancel}>
                {cancelLabel}
              </Button>
            }
          />
          <UiSdkAlertDialogClose
            value="confirm"
            action={onConfirm}
            render={
              <Button variant={variant === "danger" ? "danger" : "primary"}>{confirmLabel}</Button>
            }
          />
        </div>
      </UiSdkAlertDialogContent>
    </UiSdkAlertDialog>
  );
}

export {
  createAlertDialogController,
  createConfirm,
  UiSdkAlertDialog as AlertDialogRoot,
  UiSdkAlertDialogTrigger as AlertDialogTrigger,
  UiSdkAlertDialogBackdrop as AlertDialogBackdrop,
  UiSdkAlertDialogContent as AlertDialogContent,
  UiSdkAlertDialogTitle as AlertDialogTitle,
  UiSdkAlertDialogDescription as AlertDialogDescription,
  UiSdkAlertDialogClose as AlertDialogClose,
};
