"use client";

import type { ComponentProps, ReactNode, Ref } from "react";
import { Field as UiSdkField, type FieldState } from "@ui-sdk/react/field";
import {
  TimeInput as UiSdkTimeInput,
  TimeInputSegment,
} from "@ui-sdk/react/time-input";
// The DateField half: ui-sdk's date-input is re-exported for TICK-016, which
// builds the full DateField/DatePicker around it.
export { DateInput, DateInputSegment } from "@ui-sdk/react/date-input";
import {
  FieldLayout,
  FieldPresentationProvider,
  fieldClassName,
  useFieldPresentation,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { cx, type ControlSize } from "../../utils";

export interface TimeInputRootProps
  extends Omit<ComponentProps<typeof UiSdkTimeInput>, "children" | "className">,
    FieldPresentationProps {
  size?: ControlSize;
  /** Mark the field invalid (ui-sdk Field-level). */
  invalid?: boolean;
  className?: string | ((state: FieldState) => string | undefined);
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function TimeInputRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  invalid,
  required,
  ...props
}: TimeInputRootProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      disabled={props.disabled}
      invalid={invalid}
      data-size={size}
      {...presentation.props}
      className={cx(`${fieldClassName("time-field")} hashti-date-field`, className as string)}
    >
      <FieldPresentationProvider
        status={status}
        statusVariant={presentation.statusVariant}
        isOptional={isOptional}
        isRequired={required}
        fieldGated
      >
        {children}
      </FieldPresentationProvider>
    </UiSdkField>
  );
}

export interface TimeInputProps extends Omit<TimeInputRootProps, "children">, FieldContentProps {
  children?: ReactNode;
}

function TimeInputDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  className,
  children,
  ...props
}: TimeInputProps) {
  return (
    <TimeInputRoot {...props} size={size} className={className}>
      {children ?? (
        <FieldLayout
          inlineIcon
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          {/* ui-sdk renders the segments itself when it has no children. */}
          <UiSdkTimeInput {...props} />
        </FieldLayout>
      )}
    </TimeInputRoot>
  );
}

export const TimeInput = Object.assign(TimeInputDefault, {
  Root: TimeInputRoot,
  Segment: TimeInputSegment,
});
