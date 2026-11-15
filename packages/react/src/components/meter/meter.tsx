"use client";

import {
  createContext,
  useContext,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from "react";
import {
  Meter as RACMeter,
  Label,
  type MeterProps as RACMeterProps,
  type MeterRenderProps,
} from "react-aria-components";
import { classes, cx } from "../../utils";

export type MeterTone = "auto" | "neutral" | "success" | "warning" | "error";

export interface MeterSegment {
  value: number;
  color?: string;
  label?: string;
}

export interface MeterContextValue {
  tone?: MeterTone;
  derivedTone?: "neutral" | "success" | "warning" | "error";
  percentage?: number;
  valueText?: string;
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

  // Case 1: Optimum is in the low range (optimum <= low)
  // E.g., CPU load or disk usage - lower is better
  if (effectiveOptimum <= effectiveLow) {
    if (value <= effectiveLow) return "success";
    if (value >= effectiveHigh) return "error";
    return "warning";
  }

  // Case 2: Optimum is in the high range (optimum >= high)
  // E.g., battery life or test score - higher is better
  if (effectiveOptimum >= effectiveHigh) {
    if (value >= effectiveHigh) return "success";
    if (value <= effectiveLow) return "error";
    return "warning";
  }

  // Case 3: Optimum is in the medium range (low < optimum < high)
  // E.g., room temperature - medium is best, outer regions are suboptimal
  if (value >= effectiveLow && value <= effectiveHigh) {
    return "success";
  }
  return "warning";
}

export interface MeterRootProps extends Omit<RACMeterProps, "className" | "children"> {
  low?: number;
  high?: number;
  optimum?: number;
  tone?: MeterTone;
  size?: "sm" | "md" | "lg";
  variant?: "bar" | "circular";
  className?: string | ((values: MeterRenderProps) => string);
  children?:
    | ReactNode
    | ((
        values: MeterRenderProps & { derivedTone: "neutral" | "success" | "warning" | "error" },
      ) => ReactNode);
  ref?: Ref<HTMLDivElement>;
}

export function MeterRoot({
  value = 0,
  minValue = 0,
  maxValue = 100,
  low,
  high,
  optimum,
  tone = "auto",
  size = "md",
  variant = "bar",
  className,
  children,
  ref,
  ...props
}: MeterRootProps) {
  const derivedTone =
    tone === "auto"
      ? deriveMeterTone({
          value,
          min: minValue,
          max: maxValue,
          low,
          high,
          optimum,
        })
      : tone;

  return (
    <RACMeter
      {...props}
      ref={ref}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      data-tone={derivedTone}
      data-size={size}
      data-variant={variant}
      className={classes(
        cx("hashti-progress hashti-meter", variant === "circular" && "hashti-meter--circular"),
        className,
      )}
    >
      {(renderProps) => {
        const contextValue: MeterContextValue = {
          tone,
          derivedTone,
          percentage: renderProps.percentage,
          valueText: renderProps.valueText,
          size,
          variant,
        };
        return (
          <MeterContext.Provider value={contextValue}>
            {typeof children === "function"
              ? (
                  children as (
                    values: MeterRenderProps & {
                      derivedTone: "neutral" | "success" | "warning" | "error";
                    },
                  ) => ReactNode
                )({
                  ...renderProps,
                  derivedTone,
                })
              : children}
          </MeterContext.Provider>
        );
      }}
    </RACMeter>
  );
}

export interface MeterLabelProps extends ComponentPropsWithRef<typeof Label> {}
export function MeterLabel({ className, ...props }: MeterLabelProps) {
  return <Label {...props} className={cx("hashti-meter-label-text", className)} />;
}

export interface MeterValueProps extends ComponentPropsWithRef<"span"> {
  children?: ReactNode;
}
export function MeterValue({ children, className, ...props }: MeterValueProps) {
  const { valueText } = useContext(MeterContext);
  return (
    <span {...props} className={cx("hashti-meter-value-text", className)}>
      {children ?? valueText}
    </span>
  );
}

export interface MeterTrackProps extends ComponentPropsWithRef<"div"> {
  children?: ReactNode;
}
export function MeterTrack({ children, className, ...props }: MeterTrackProps) {
  return (
    <div {...props} className={cx("hashti-progress-track hashti-meter-track", className)}>
      {children}
    </div>
  );
}

export interface MeterFillProps extends ComponentPropsWithRef<"div"> {
  percentage?: number;
}
export function MeterFill({
  percentage: propPercentage,
  style,
  className,
  ...props
}: MeterFillProps) {
  const { percentage: ctxPercentage } = useContext(MeterContext);
  const percent = propPercentage ?? ctxPercentage ?? 0;
  return (
    <div
      {...props}
      className={cx("hashti-progress-fill hashti-meter-fill", className)}
      style={{ width: `${percent}%`, ...style }}
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
  const {
    percentage = 0,
    valueText,
    size = "md",
    derivedTone = "neutral",
  } = useContext(MeterContext);
  const pixelSize = size === "sm" ? 36 : size === "lg" ? 64 : 48;
  const strokeWidth = size === "sm" ? 3 : size === "lg" ? 5 : 4;
  const radius = (pixelSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(Math.max(percentage / 100, 0), 1));

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
      {showValueLabel && <span className="hashti-meter-circle-value">{valueText}</span>}
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
  minValue = 0,
  maxValue = 100,
  ...props
}: MeterProps) {
  return (
    <MeterRoot {...props} minValue={minValue} maxValue={maxValue} variant={variant}>
      {children ??
        (({ percentage, valueText }) => {
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

          const totalRange = maxValue - minValue;

          return (
            <>
              {(label || valueText) && (
                <div className="hashti-progress-label hashti-meter-header">
                  {label && <MeterLabel>{label}</MeterLabel>}
                  {valueText && <MeterValue>{valueText}</MeterValue>}
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
                  <MeterFill percentage={percentage} />
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
