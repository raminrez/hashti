"use client";

import { useEffect, useId, useRef, type ReactNode, type Ref, type ComponentPropsWithRef } from "react";
import { Button } from "../button";
import { Icon } from "../../icons";
import { cx } from "../../utils";

export type NotificationStatus = "info" | "success" | "warning" | "error";
export type NotificationVariant = "subtle" | "solid" | "bordered";

export interface InlineNotificationProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  status?: NotificationStatus;
  variant?: NotificationVariant;
  title: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  action?: ReactNode;
  lowContrast?: boolean;
}

export function InlineNotification({
  status = "info",
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
      data-status={status}
      data-variant={resolvedVariant}
      data-low-contrast={lowContrast || undefined}
      className={cx("hashti-notification", className)}
    >
      <Icon name={status} size={20} />
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
          onClick={onDismiss}
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
  status?: NotificationStatus;
  variant?: NotificationVariant;
  title: ReactNode;
  action: ReactNode;
  onDismiss?: () => void;
  closeButtonLabel?: string;
  autoFocusAction?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function ActionableNotification({
  status = "info",
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
        else if (ref) ref.current = node;
      }}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={children ? descId : undefined}
      data-status={status}
      data-variant={variant}
      className={cx("hashti-actionable-notification", className)}
    >
      <Icon name={status} size={20} />
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
          onClick={onDismiss}
        >
          <Icon name="close" />
        </Button>
      )}
    </div>
  );
}
