"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Dialog as UiDialog,
  DialogBackdrop as UiDialogBackdrop,
  DialogClose as UiDialogClose,
  DialogContent as UiDialogContent,
  DialogDescription as UiDialogDescription,
  DialogTitle as UiDialogTitle,
  DialogTrigger as UiDialogTrigger,
} from "@ui-sdk/react/dialog";
import { useOverlayTheme } from "../theme";

function Dialog(props: ComponentProps<typeof UiDialog>) {
  const theme = useOverlayTheme();
  return <UiDialog container={theme?.container} {...props} />;
}

function DialogTrigger(props: ComponentProps<typeof UiDialogTrigger>) {
  return (
    <UiDialogTrigger
      {...props}
      className={join("hashti-dialog-trigger", props.className)}
    />
  );
}

function DialogBackdrop(props: ComponentProps<typeof UiDialogBackdrop>) {
  return (
    <UiDialogBackdrop
      {...props}
      className={join("hashti-dialog-backdrop", props.className)}
    />
  );
}

function DialogContent(props: ComponentProps<typeof UiDialogContent>) {
  return (
    <UiDialogContent
      {...props}
      className={join("hashti-dialog-content", props.className)}
    />
  );
}

function DialogTitle(props: ComponentProps<typeof UiDialogTitle>) {
  return (
    <UiDialogTitle
      {...props}
      className={join("hashti-dialog__title", props.className)}
    />
  );
}

function DialogDescription(props: ComponentProps<typeof UiDialogDescription>) {
  return (
    <UiDialogDescription
      {...props}
      className={join("hashti-dialog__description", props.className)}
    />
  );
}

function DialogClose(props: ComponentProps<typeof UiDialogClose>) {
  return (
    <UiDialogClose
      {...props}
      className={join("hashti-dialog-close", props.className)}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogBackdrop,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
