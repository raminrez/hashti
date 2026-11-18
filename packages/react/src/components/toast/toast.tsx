"use client";

// TICK-012 split (docs/component-inventory.md, decisions log item 10):
// - InlineNotification / Alert / ActionableNotification are css-only and now live in
//   ./notifications.tsx.
// - This file keeps the RAC Toast queue for TICK-008 (rebuild on @ui-sdk/react/toast,
//   data-type value set per docs/attribute-map.md).
// - AlertDialog-style confirm parts move to dialog/ with TICK-007.

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  Text,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as ToastContent,
  type ToastOptions,
} from "react-aria-components";
import { Button } from "../button";
import { Icon } from "../../icons";
import { classes } from "../../utils";
import { useOverlayTheme } from "../../theme";
import type { NotificationStatus, NotificationVariant } from "./notifications";

export interface ToastMessage {
  title: string;
  description?: string;
  status?: NotificationStatus;
  variant?: NotificationVariant;
}

type ToastApi = {
  add: (message: ToastMessage, options?: ToastOptions) => string;
  close: (key: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue] = useState(() => new ToastQueue<ToastMessage>({ maxVisibleToasts: 3 }));
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <ToastContext.Provider value={queue}>
      {children}
      <ToastRegion
        queue={queue}
        {...theme}
        className={classes("hashti-toast-region", appearanceClassName)}
      >
        {({ toast }) => (
          <RACToast
            toast={toast}
            className="hashti-toast"
            data-status={toast.content.status ?? "info"}
            data-variant={toast.content.variant ?? "subtle"}
          >
            <Icon name={toast.content.status ?? "info"} size={20} />
            <ToastContent>
              <Text slot="title">{toast.content.title}</Text>
              {toast.content.description && (
                <Text slot="description">{toast.content.description}</Text>
              )}
            </ToastContent>
            <Button
              slot="close"
              variant="ghost"
              size="lg"
              iconOnly
              aria-label="Dismiss notification"
            >
              <Icon name="close" />
            </Button>
          </RACToast>
        )}
      </ToastRegion>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const queue = useContext(ToastContext);
  if (!queue) throw new Error("useToast must be used inside a Hashti ToastProvider.");
  return queue;
}
