"use client";

import { type ComponentPropsWithRef, type ReactNode, type Ref } from "react";
import { cx } from "../../utils";

export interface EmptyStateProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  actions?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  actions,
  children,
  className,
  ref,
  ...props
}: EmptyStateProps) {
  const actionContent = action ?? actions;
  return (
    <div {...props} ref={ref} className={cx("hashti-empty-state", className)}>
      {icon && <div className="hashti-empty-state-icon">{icon}</div>}
      {typeof title === "string" ? <h3 className="hashti-empty-state-title">{title}</h3> : title}
      {description &&
        (typeof description === "string" ? (
          <p className="hashti-empty-state-description">{description}</p>
        ) : (
          description
        ))}
      {actionContent && <div className="hashti-empty-state-actions">{actionContent}</div>}
      {children}
    </div>
  );
}
