"use client";

import { type ComponentPropsWithRef, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { cx } from "../../utils";

export type CardElevation = "flat" | "raised" | "overlay";

export interface CardProps extends ComponentPropsWithRef<"div"> {
  elevation?: CardElevation;
  isPressable?: boolean;
  onPress?: () => void;
  ref?: Ref<HTMLDivElement>;
}

export function Card({
  elevation = "flat",
  isPressable = false,
  onPress,
  children,
  className,
  ref,
  onClick,
  onKeyDown,
  ...props
}: CardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (isPressable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onPress?.();
    }
  };

  if (isPressable) {
    return (
      <div
        {...props}
        ref={ref}
        role="button"
        tabIndex={0}
        data-elevation={elevation}
        data-interactive="true"
        onClick={(e) => {
          onClick?.(e);
          onPress?.();
        }}
        onKeyDown={handleKeyDown}
        className={cx("hashti-card", className)}
      >
        {children}
      </div>
    );
  }

  return (
    <div {...props} ref={ref} data-elevation={elevation} className={cx("hashti-card", className)}>
      {children}
    </div>
  );
}

export interface CardHeaderProps extends Omit<ComponentPropsWithRef<"div">, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function CardHeader({
  title,
  description,
  action,
  children,
  className,
  ref,
  ...props
}: CardHeaderProps) {
  return (
    <div {...props} ref={ref} className={cx("hashti-card-header", className)}>
      {title || description ? (
        <div className="hashti-card-header-content">
          {title &&
            (typeof title === "string" ? <h3 className="hashti-card-title">{title}</h3> : title)}
          {description &&
            (typeof description === "string" ? (
              <p className="hashti-card-description">{description}</p>
            ) : (
              description
            ))}
        </div>
      ) : (
        children
      )}
      {action}
    </div>
  );
}

export interface CardBodyProps extends ComponentPropsWithRef<"div"> {
  ref?: Ref<HTMLDivElement>;
}

export function CardBody({ children, className, ref, ...props }: CardBodyProps) {
  return (
    <div {...props} ref={ref} className={cx("hashti-card-body", className)}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends ComponentPropsWithRef<"div"> {
  ref?: Ref<HTMLDivElement>;
}

export function CardFooter({ children, className, ref, ...props }: CardFooterProps) {
  return (
    <div {...props} ref={ref} className={cx("hashti-card-footer", className)}>
      {children}
    </div>
  );
}
