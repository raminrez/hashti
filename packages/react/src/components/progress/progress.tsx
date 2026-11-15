"use client";

import type { ReactNode, Ref, ComponentPropsWithRef } from "react";
import {
  ProgressBar as RACProgressBar,
  Label,
  type ProgressBarProps as RACProgressBarProps,
} from "react-aria-components";
import { Icon } from "../../icons";
import { Button } from "../button";
import { classes } from "../../utils";

export interface ProgressBarProps extends RACProgressBarProps {
  label?: ReactNode;
  helperText?: ReactNode;
  status?: "active" | "success" | "warning" | "error";
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
    <RACProgressBar
      {...props}
      data-status={status}
      className={classes("hashti-progress", className)}
    >
      {children ??
        (({ percentage, valueText, isIndeterminate }) => (
          <>
            <div className="hashti-progress-label">
              <Label>{label}</Label>
              {valueText && <span>{valueText}</span>}
            </div>
            <div
              className="hashti-progress-track"
              data-indeterminate={isIndeterminate || undefined}
            >
              <div
                className="hashti-progress-fill"
                style={{ width: percentage == null ? "30%" : `${percentage}%` }}
              />
            </div>
            {helperText && <span className="hashti-description">{helperText}</span>}
          </>
        ))}
    </RACProgressBar>
  );
}

export interface ProgressCircleProps extends RACProgressBarProps {
  size?: "sm" | "md" | "lg";
  status?: "active" | "success" | "warning" | "error";
  showValueLabel?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function ProgressCircle({
  size = "md",
  status = "active",
  showValueLabel = false,
  value,
  minValue = 0,
  maxValue = 100,
  isIndeterminate = false,
  className,
  ref,
  ...props
}: ProgressCircleProps) {
  const pixelSize = size === "sm" ? 32 : size === "lg" ? 64 : 48;
  const strokeWidth = size === "sm" ? 2.5 : size === "lg" ? 4.5 : 3.5;
  const radius = (pixelSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const currentVal = value ?? 0;
  const percent = Math.min(Math.max((currentVal - minValue) / (maxValue - minValue), 0), 1);
  const strokeDashoffset = isIndeterminate ? circumference * 0.25 : circumference * (1 - percent);

  return (
    <RACProgressBar
      {...props}
      ref={ref}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      isIndeterminate={isIndeterminate}
      data-size={size}
      data-status={status}
      data-indeterminate={isIndeterminate || undefined}
      className={classes("hashti-progress-circle", className)}
    >
      {({ valueText }) => (
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
          {showValueLabel && !isIndeterminate && (
            <span className="hashti-progress-circle-value">{valueText}</span>
          )}
        </>
      )}
    </RACProgressBar>
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
      className={["hashti-loading", className].filter(Boolean).join(" ")}
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
      className={["hashti-skeleton", className].filter(Boolean).join(" ")}
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
      className={["hashti-progress-indicator", className].filter(Boolean).join(" ")}
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
                isDisabled={step.disabled}
                onPress={() => onStepChange(step.id)}
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
