"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  AlertDialog,
  AlertDialogBackdrop as UiAlertDialogBackdrop,
  AlertDialogClose as UiAlertDialogClose,
  AlertDialogContent as UiAlertDialogContent,
  AlertDialogDescription as UiAlertDialogDescription,
  AlertDialogTitle as UiAlertDialogTitle,
  AlertDialogTrigger as UiAlertDialogTrigger,
} from "@ui-sdk/react/alert-dialog";

function AlertDialogTrigger(
  props: ComponentProps<typeof UiAlertDialogTrigger>,
) {
  return (
    <UiAlertDialogTrigger
      {...props}
      className={join("hashti-alert-dialog-trigger", props.className)}
    />
  );
}

function AlertDialogBackdrop(
  props: ComponentProps<typeof UiAlertDialogBackdrop>,
) {
  return (
    <UiAlertDialogBackdrop
      {...props}
      className={join("hashti-alert-dialog-backdrop", props.className)}
    />
  );
}

function AlertDialogContent(
  props: ComponentProps<typeof UiAlertDialogContent>,
) {
  return (
    <UiAlertDialogContent
      {...props}
      className={join("hashti-alert-dialog-content", props.className)}
    />
  );
}

function AlertDialogTitle(props: ComponentProps<typeof UiAlertDialogTitle>) {
  return (
    <UiAlertDialogTitle
      {...props}
      className={join("hashti-alert-dialog__title", props.className)}
    />
  );
}

function AlertDialogDescription(
  props: ComponentProps<typeof UiAlertDialogDescription>,
) {
  return (
    <UiAlertDialogDescription
      {...props}
      className={join("hashti-alert-dialog__description", props.className)}
    />
  );
}

function AlertDialogClose(props: ComponentProps<typeof UiAlertDialogClose>) {
  return (
    <UiAlertDialogClose
      {...props}
      className={join("hashti-alert-dialog-close", props.className)}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
};
