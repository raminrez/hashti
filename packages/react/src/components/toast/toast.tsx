"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type ComponentPropsWithRef,
} from "react";
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
import { classes, cx } from "../../utils";
import { useOverlayTheme } from "../../theme";

export type NotificationKind = "info" | "success" | "warning" | "error";
export type NotificationVariant = "subtle" | "solid" | "bordered";

export interface InlineNotificationProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  kind?: NotificationKind;
  variant?: NotificationVariant;
  title: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  action?: ReactNode;
  lowContrast?: boolean;
}

export function InlineNotification({
  kind = "info",
  variant,
  title,
  children,
  onDismiss,
  action,
  lowContrast = true,
  className,
  role = "status",
  ...props
}: InlineNotificationProps) {
  const resolvedVariant = variant ?? (lowContrast ? "subtle" : "solid");
  return (
    <div
      {...props}
      role={role}
      data-kind={kind}
      data-variant={resolvedVariant}
      data-low-contrast={lowContrast || undefined}
      className={["hashti-notification", className].filter(Boolean).join(" ")}
    >
      <Icon name={kind} size={20} />
      <div className="hashti-notification-content">
        <strong>{title}</strong>
        {children && <div>{children}</div>}
        {action}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="lg"
          iconOnly
          aria-label="Dismiss notification"
          onPress={onDismiss}
        >
          <Icon name="close" />
        </Button>
      )}
    </div>
  );
}

export interface AlertProps extends InlineNotificationProps {}
export function Alert(props: AlertProps) {
  return <InlineNotification role="alert" {...props} />;
}

export interface ActionableNotificationProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  kind?: NotificationKind;
  variant?: NotificationVariant;
  title: ReactNode;
  action: ReactNode;
  onDismiss?: () => void;
  closeButtonLabel?: string;
  autoFocusAction?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function ActionableNotification({
  kind = "info",
  variant = "subtle",
  title,
  action,
  onDismiss,
  closeButtonLabel = "Dismiss notification",
  autoFocusAction = true,
  children,
  className,
  ref,
  ...props
}: ActionableNotificationProps) {
  const titleId = useId();
  const descId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocusAction && containerRef.current) {
      const btn = containerRef.current.querySelector<HTMLButtonElement>(
        ".hashti-actionable-notification-actions button",
      );
      btn?.focus();
    }
  }, [autoFocusAction]);

  return (
    <div
      {...props}
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as any).current = node;
      }}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={children ? descId : undefined}
      data-kind={kind}
      data-variant={variant}
      className={cx("hashti-actionable-notification", className)}
    >
      <Icon name={kind} size={20} />
      <div className="hashti-actionable-notification-content">
        <strong id={titleId}>{title}</strong>
        {children && <div id={descId}>{children}</div>}
        <div className="hashti-actionable-notification-actions">{action}</div>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={closeButtonLabel}
          onPress={onDismiss}
        >
          <Icon name="close" />
        </Button>
      )}
    </div>
  );
}

export interface ToastMessage {
  title: string;
  description?: string;
  kind?: NotificationKind;
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
            data-kind={toast.content.kind ?? "info"}
            data-variant={toast.content.variant ?? "subtle"}
          >
            <Icon name={toast.content.kind ?? "info"} size={20} />
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
