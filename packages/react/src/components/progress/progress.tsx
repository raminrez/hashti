"use client";

import type { ComponentProps, ComponentPropsWithRef, ReactNode, Ref } from "react";
import {
  Progress as UiSdkProgress,
  ProgressIndicator as UiSdkProgressBarFill,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/react/progress";
import { Icon } from "../../icons";
import { Button } from "../button";
import { cx } from "../../utils";

export type ProgressStatus = "active" | "success" | "warning" | "error";

export interface ProgressBarProps
  extends Omit<ComponentProps<typeof UiSdkProgress>, "className" | "children"> {
  label?: ReactNode;
  helperText?: ReactNode;
  status?: ProgressStatus;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function ProgressBar({
  label,
  helperText,
  status = "active",
  children,
  className,
  ...props
}: ProgressBarProps) {
  return (
    <UiSdkProgress
      {...props}
      data-status={status}
      className={cx("hashti-progress", className)}
    >
      {children ?? (
        <>
          <div className="hashti-progress-label">
            <ProgressLabel>{label}</ProgressLabel>
            <ProgressValue />
          </div>
          <ProgressTrack className="hashti-progress-track">
            <UiSdkProgressBarFill className="hashti-progress-fill" />
          </ProgressTrack>
          {helperText && <span className="hashti-description">{helperText}</span>}
        </>
      )}
    </UiSdkProgress>
  );
}

export interface ProgressCircleProps {
  size?: "sm" | "md" | "lg";
  status?: ProgressStatus;
  showValueLabel?: boolean;
  value?: number;
  min?: number;
  max?: number;
  /** `aria-label` naming the circle for screen readers. */
  "aria-label"?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A circular progress indicator. ui-sdk's progress covers the bar; the circle
 * stays a Hashti styled variant that shows the same value.
 */
export function ProgressCircle({
  size = "md",
  status = "active",
  showValueLabel = false,
  value,
  min = 0,
  max = 100,
  className,
  ref,
  ...props
}: ProgressCircleProps) {
  const pixelSize = size === "sm" ? 32 : size === "lg" ? 64 : 48;
  const strokeWidth = size === "sm" ? 2.5 : size === "lg" ? 4.5 : 3.5;
  const radius = (pixelSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const currentVal = value ?? 0;
  const percent = Math.min(Math.max((currentVal - min) / (max - min), 0), 1);
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <UiSdkProgress
      {...props}
      value={value ?? null}
      min={min}
      max={max}
      data-size={size}
      data-status={status}
      className={cx("hashti-progress-circle", className)}
    >
      <ProgressValue>
        {(state) => (
          <>
            <svg
              width={pixelSize}
              height={pixelSize}
              viewBox={`0 0 ${pixelSize} ${pixelSize}`}
              aria-hidden="true"
            >
              <circle
                className="hashti-progress-circle-track"
                cx={pixelSize / 2}
                cy={pixelSize / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <circle
                className="hashti-progress-circle-fill"
                cx={pixelSize / 2}
                cy={pixelSize / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            {showValueLabel && value != null && (
              <span className="hashti-progress-circle-value">{state.text}</span>
            )}
          </>
        )}
      </ProgressValue>
    </UiSdkProgress>
  );
}

export interface LoadingProps {
  label?: string;
  size?: "sm" | "lg";
  className?: string;
}

export function Loading({ label = "Loading", size = "lg", className }: LoadingProps) {
  return (
    <div
      role="status"
      className={cx("hashti-loading", className)}
      data-size={size}
    >
      <span className="hashti-spinner" aria-hidden="true" />
      <span className="hashti-visually-hidden">{label}</span>
    </div>
  );
}

export interface InlineLoadingProps {
  children?: ReactNode;
  status?: "active" | "success" | "error";
}

export function InlineLoading({ children = "Loading…", status = "active" }: InlineLoadingProps) {
  return (
    <div role="status" className="hashti-inline-loading" data-status={status}>
      {status === "active" ? (
        <span className="hashti-spinner" aria-hidden="true" />
      ) : (
        <Icon name={status} />
      )}
      <span>{children}</span>
    </div>
  );
}

export interface SkeletonProps extends ComponentPropsWithRef<"div"> {
  width?: string;
  height?: string;
  lines?: number;
}

export function Skeleton({ width, height, lines = 1, style, className, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      className={cx("hashti-skeleton", className)}
      aria-hidden="true"
      style={{ width, ...style }}
    >
      {Array.from({ length: Math.max(1, lines) }, (_, index) => (
        <span key={index} style={{ height }} />
      ))}
    </div>
  );
}

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  status?: "complete" | "current" | "incomplete" | "invalid";
  disabled?: boolean;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  onStepChange?: (id: string) => void;
  orientation?: "horizontal" | "vertical";
  "aria-label"?: string;
  className?: string;
}

/** A step-by-step progress list, distinct from the bar. */
export function ProgressIndicator({
  steps,
  onStepChange,
  orientation = "horizontal",
  "aria-label": label = "Progress",
  className,
}: ProgressIndicatorProps) {
  return (
    <ol
      aria-label={label}
      className={cx("hashti-progress-indicator", className)}
      data-orientation={orientation}
    >
      {steps.map((step) => (
        <li
          key={step.id}
          data-status={step.status ?? "incomplete"}
          aria-current={step.status === "current" ? "step" : undefined}
        >
          <span className="hashti-step-marker" aria-hidden="true">
            {step.status === "complete" ? (
              <Icon name="check" />
            ) : step.status === "invalid" ? (
              <Icon name="error" />
            ) : (
              <span />
            )}
          </span>
          <div className="hashti-step-details">
            {onStepChange ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={step.disabled}
                onClick={() => onStepChange(step.id)}
              >
                {step.label}
              </Button>
            ) : (
              <span className="hashti-step-label">{step.label}</span>
            )}
            <span className="hashti-visually-hidden"> — {step.status ?? "incomplete"}</span>
            {step.description && <p className="hashti-step-description">{step.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
