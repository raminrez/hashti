"use client";

// TICK-008: the queue/provider half of toast/, rebuilt on @ui-sdk/react/toast.
// The css-only InlineNotification / Alert / ActionableNotification live in
// ./notifications.tsx (TICK-012). The shared status vocabulary comes from
// notifications.tsx; it maps onto ui-sdk's toast `type` (a subset of it), and
// the rendered toast emits both ui-sdk's `data-type` and Hashti's
// `data-status` so the swept stylesheets keep working (docs/attribute-map.md).

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  Toast as UiSdkToast,
  ToastAction as UiSdkToastAction,
  ToastClose as UiSdkToastClose,
  ToastDescription as UiSdkToastDescription,
  ToastRegion as UiSdkToastRegion,
  ToastTitle as UiSdkToastTitle,
  createToaster,
  type Toaster,
  type ToastActionDetails,
  type ToastDismissDetails,
  type ToastOptions as UiSdkToastOptions,
} from "@ui-sdk/react/toast";
import { Button } from "../button";
import { Icon } from "../../icons";
import { cx } from "../../utils";
import { useOverlayTheme } from "../../theme";
import type { NotificationStatus, NotificationVariant } from "./notifications";

export interface ToastAction {
  label: ReactNode;
  onAction?: (details: ToastActionDetails) => unknown;
  href?: string;
  /** Whether pressing the action dismisses the toast. Default true. */
  dismiss?: boolean;
}

export interface ToastMessage {
  title: ReactNode;
  description?: ReactNode;
  /** Announced urgency and status colouring. Default "info". */
  status?: NotificationStatus;
  /** Surface treatment: subtle (default), solid or bordered. */
  variant?: NotificationVariant;
  /** A button in the toast, like Undo. */
  action?: ToastAction;
  /** How long the toast shows, in ms. `Infinity` keeps it until dismissed. */
  duration?: number;
  /** Runs when the toast closes, with why. `details.cancel()` keeps it. */
  onDismiss?: (details: ToastDismissDetails) => void;
}

export interface ToastAddOptions {
  /** Reuses a toast: a still-showing toast with this id is updated instead. */
  id?: string;
  duration?: number;
}

type ToastApi = {
  add: (message: ToastMessage, options?: ToastAddOptions) => string;
  close: (key: string) => void;
  dismiss: (key?: string) => void;
};

/** Carried on the ui-sdk toast's `data` field for the region renderer. */
type ToastRenderData = {
  status: NotificationStatus;
  variant?: NotificationVariant;
};

const ToastContext = createContext<ToastApi | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** How many toasts show at once; older ones wait for room. Default 3. */
  maxVisible?: number;
  /** Default toast duration in ms. Default 5000 (ui-sdk's default). */
  duration?: number;
  /** The edge of the viewport the region sits on. Default "bottom". */
  side?: "top" | "bottom";
  /** Where along that edge. Start and end follow the writing direction. Default "end". */
  align?: "start" | "center" | "end";
}

export function ToastProvider({
  children,
  maxVisible = 3,
  duration,
  side = "bottom",
  align = "end",
}: ToastProviderProps) {
  const [toaster] = useState<Toaster<ReactNode>>(() =>
    createToaster<ReactNode>(duration === undefined ? undefined : { duration }),
  );
  const { appearanceClassName, ...theme } = useOverlayTheme();

  const api: ToastApi = useMemo(
    () => ({
      add: (message, options) => {
        const status = message.status ?? "info";
        const toastOptions: UiSdkToastOptions<ReactNode> = {
          title: message.title,
          description: message.description,
          type: status,
          duration: options?.duration ?? message.duration,
          id: options?.id,
          action: message.action
            ? {
                label: message.action.label,
                onAction: message.action.onAction
                  ? (_event, details) => message.action!.onAction!(details)
                  : undefined,
                href: message.action.href,
                dismiss: message.action.dismiss,
              }
            : undefined,
          onDismiss: message.onDismiss,
          data: { status, variant: message.variant } satisfies ToastRenderData,
        };
        return toaster(toastOptions);
      },
      close: (key) => toaster.dismiss(key),
      dismiss: (key) => toaster.dismiss(key),
    }),
    [toaster],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <UiSdkToastRegion
        toaster={toaster}
        side={side}
        align={align}
        maxVisible={maxVisible}
        {...theme}
        className={cx("hashti-toast-region", appearanceClassName)}
      >
        {(toast) => {
          const renderData = toast.data as ToastRenderData | undefined;
          const status = renderData?.status ?? "info";
          return (
            <UiSdkToast
              className="hashti-toast"
              data-status={status}
              data-variant={renderData?.variant ?? "subtle"}
            >
              <Icon name={status} size={20} />
              <div className="hashti-toast-content">
                <UiSdkToastTitle />
                <UiSdkToastDescription />
                {toast.action && <UiSdkToastAction />}
              </div>
              <UiSdkToastClose
                render={
                  <Button
                    variant="ghost"
                    size="lg"
                    iconOnly
                    aria-label="Dismiss notification"
                  >
                    <Icon name="close" />
                  </Button>
                }
              />
            </UiSdkToast>
          );
        }}
      </UiSdkToastRegion>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside a Hashti ToastProvider.");
  return api;
}
