"use client";

import {
  createContext,
  useContext,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from "react";
import {
  Meter as UiSdkMeter,
  MeterIndicator as UiSdkMeterIndicator,
  MeterLabel as UiSdkMeterLabel,
  MeterTrack as UiSdkMeterTrack,
  MeterValue as UiSdkMeterValue,
} from "@ui-sdk/react/meter";
import { cx } from "../../utils";

/** Joins the component's CSS hook with a possibly state-function className. */
function classes<S>(
  base: string,
  custom: string | ((state: S) => string | undefined) | undefined,
): string | ((state: S) => string) {
  return typeof custom === "function"
    ? (state: S) => cx(base, custom(state))
    : cx(base, custom);
}

export type MeterTone = "auto" | "neutral" | "success" | "warning" | "error";

export interface MeterSegment {
  value: number;
  color?: string;
  label?: string;
}

export interface MeterContextValue {
  tone?: MeterTone;
  derivedTone?: "neutral" | "success" | "warning" | "error";
  percent?: number | null;
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "bar" | "circular";
}

export const MeterContext = createContext<MeterContextValue>({});

export function deriveMeterTone({
  value,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
}: {
  value: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
}): "neutral" | "success" | "warning" | "error" {
  // If thresholds are not defined, neutral is default
  if (low == null && high == null && optimum == null) {
    return "neutral";
  }

  const effectiveLow = low ?? min;
  const effectiveHigh = high ?? max;
  const effectiveOptimum = optimum ?? (effectiveLow + effectiveHigh) / 2;

  // Optimum in the low range (optimum <= low): lower is better (CPU, disk).
  if (effectiveOptimum <= effectiveLow) {
    if (value <= effectiveLow) return "success";
    if (value >= effectiveHigh) return "error";
    return "warning";
  }

  // Optimum in the high range (optimum >= high): higher is better (battery, score).
  if (effectiveOptimum >= effectiveHigh) {
    if (value >= effectiveHigh) return "success";
    if (value <= effectiveLow) return "error";
    return "warning";
  }

  // Optimum in the middle: the low..high band is best (room temperature).
  if (value >= effectiveLow && value <= effectiveHigh) {
    return "success";
  }
  return "warning";
}

export interface MeterRootProps
  extends Omit<ComponentProps<typeof UiSdkMeter>, "className" | "children"> {
  low?: number;
  high?: number;
  optimum?: number;
  tone?: MeterTone;
  size?: "sm" | "md" | "lg";
  variant?: "bar" | "circular";
  className?: string;
  children?: ReactNode | ((state: { percent: number | null; text: string; derivedTone: MeterContextValue["derivedTone"] }) => ReactNode);
  ref?: Ref<HTMLDivElement>;
}

export function MeterRoot({
  value = 0,
  min = 0,
  max = 100,
  low,
  high,
  optimum,
  tone = "auto",
  size = "md",
  variant = "bar",
  className,
  children,
  ...props
}: MeterRootProps) {
  const derivedTone =
    tone === "auto" ? deriveMeterTone({ value, min, max, low, high, optimum }) : tone;

  return (
    <UiSdkMeter
      {...props}
      value={value}
      min={min}
      max={max}
      data-tone={derivedTone}
      data-size={size}
      data-variant={variant}
      className={cx(
        "hashti-progress hashti-meter",
        variant === "circular" && "hashti-meter--circular",
        className,
      )}
    >
      {(state) => {
        const contextValue: MeterContextValue = {
          tone,
          derivedTone,
          percent: state.percent,
          text: (state as { text?: string }).text,
          size,
          variant,
        };
        return (
          <MeterContext.Provider value={contextValue}>
            {typeof children === "function"
              ? children({ percent: state.percent, text: (state as { text?: string }).text ?? "", derivedTone })
              : children}
          </MeterContext.Provider>
        );
      }}
    </UiSdkMeter>
  );
}

export interface MeterLabelProps extends ComponentProps<typeof UiSdkMeterLabel> {}
export function MeterLabel({ className, ...props }: MeterLabelProps) {
  return <UiSdkMeterLabel {...props} className={classes("hashti-meter-label-text", className)} />;
}

export interface MeterValueProps extends ComponentProps<typeof UiSdkMeterValue> {}
export function MeterValue({ children, className, ...props }: MeterValueProps) {
  return (
    <UiSdkMeterValue {...props} className={classes("hashti-meter-value-text", className)}>
      {children}
    </UiSdkMeterValue>
  );
}

export interface MeterTrackProps extends ComponentProps<typeof UiSdkMeterTrack> {}
export function MeterTrack({ children, className, ...props }: MeterTrackProps) {
  return (
    <UiSdkMeterTrack {...props} className={classes("hashti-progress-track hashti-meter-track", className)}>
      {children}
    </UiSdkMeterTrack>
  );
}

export interface MeterFillProps extends ComponentProps<typeof UiSdkMeterIndicator> {
  percentage?: number;
}
export function MeterFill({ percentage, className, style, ...props }: MeterFillProps) {
  return (
    <UiSdkMeterIndicator
      {...props}
      className={classes("hashti-progress-fill hashti-meter-fill", className)}
      style={percentage != null ? { width: `${percentage}%` } : undefined}
    />
  );
}

export interface MeterHelperTextProps extends ComponentPropsWithRef<"span"> {
  children?: ReactNode;
}
export function MeterHelperText({ children, className, ...props }: MeterHelperTextProps) {
  return (
    <span {...props} className={cx("hashti-description hashti-meter-helper", className)}>
      {children}
    </span>
  );
}

export interface MeterCircleProps extends ComponentPropsWithRef<"div"> {
  showValueLabel?: boolean;
}
export function MeterCircle({ showValueLabel = true, className, ...props }: MeterCircleProps) {
  const { percent = 0, text, size = "md", derivedTone = "neutral" } = useContext(MeterContext);
  const pixelSize = size === "sm" ? 36 : size === "lg" ? 64 : 48;
  const strokeWidth = size === "sm" ? 3 : size === "lg" ? 5 : 4;
  const radius = (pixelSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(Math.max((percent ?? 0) / 100, 0), 1));

  return (
    <div
      {...props}
      className={cx("hashti-meter-circle-container", className)}
      data-size={size}
      data-tone={derivedTone}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox={`0 0 ${pixelSize} ${pixelSize}`}
        aria-hidden="true"
        className="hashti-meter-circle-svg"
      >
        <circle
          className="hashti-meter-circle-track"
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="hashti-meter-circle-fill"
          cx={pixelSize / 2}
          cy={pixelSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      {showValueLabel && <span className="hashti-meter-circle-value">{text}</span>}
    </div>
  );
}

export interface MeterProps extends MeterRootProps {
  label?: ReactNode;
  helperText?: ReactNode;
  segments?: MeterSegment[];
}

function MeterDefault({
  label,
  helperText,
  segments,
  variant = "bar",
  children,
  min = 0,
  max = 100,
  ...props
}: MeterProps) {
  return (
    <MeterRoot {...props} min={min} max={max} variant={variant}>
      {children ??
        (({ percent }) => {
          if (variant === "circular") {
            return (
              <>
                {label && (
                  <div className="hashti-progress-label hashti-meter-header">
                    <MeterLabel>{label}</MeterLabel>
                  </div>
                )}
                <MeterCircle />
                {helperText && <MeterHelperText>{helperText}</MeterHelperText>}
              </>
            );
          }

          const totalRange = max - min;

          return (
            <>
              {label && (
                <div className="hashti-progress-label hashti-meter-header">
                  <MeterLabel>{label}</MeterLabel>
                  <MeterValue />
                </div>
              )}
              <MeterTrack>
                {segments && segments.length > 0 ? (
                  segments.map((seg, i) => {
                    const segPercent = totalRange > 0 ? (seg.value / totalRange) * 100 : 0;
                    return (
                      <div
                        key={i}
                        className="hashti-meter-segment"
                        style={{
                          width: `${segPercent}%`,
                          backgroundColor: seg.color,
                        }}
                        title={seg.label ? `${seg.label}: ${seg.value}` : undefined}
                      />
                    );
                  })
                ) : (
                  <MeterFill percentage={percent ?? undefined} />
                )}
              </MeterTrack>
              {helperText && <MeterHelperText>{helperText}</MeterHelperText>}
            </>
          );
        })}
    </MeterRoot>
  );
}

export const Meter = Object.assign(MeterDefault, {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
  Fill: MeterFill,
  HelperText: MeterHelperText,
  Circle: MeterCircle,
});
