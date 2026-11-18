"use client";

import type { ComponentProps, ReactNode, Ref } from "react";
import { Field as UiSdkField, type FieldState } from "@ui-sdk/react/field";
import {
  OTPInput as UiSdkOTPInput,
  OTPInputGroup,
  OTPInputSlot,
} from "@ui-sdk/react/otp-input";
import {
  FieldLayout,
  FieldPresentationProvider,
  fieldClassName,
  useFieldPresentation,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { cx, type ControlSize } from "../../utils";

export interface OtpInputRootProps
  extends Omit<ComponentProps<typeof UiSdkOTPInput>, "children" | "className">,
    FieldPresentationProps {
  size?: ControlSize;
  /** Mark the field invalid (ui-sdk Field-level). */
  invalid?: boolean;
  className?: string | ((state: FieldState) => string | undefined);
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function OtpInputRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  invalid,
  required,
  ...props
}: OtpInputRootProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      disabled={props.disabled}
      invalid={invalid}
      data-size={size}
      {...presentation.props}
      className={cx(fieldClassName("input-otp"), className as string)}
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

export interface OtpInputProps extends Omit<OtpInputRootProps, "children">, FieldContentProps {
  /** How many characters the code has; one slot each. Defaults to 6. */
  length?: number;
  children?: ReactNode;
}

function OtpInputDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  length,
  className,
  children,
  maxLength,
  ...props
}: OtpInputProps) {
  const count = maxLength ?? length ?? 6;
  return (
    <OtpInputRoot {...props} size={size} className={className}>
      {children ?? (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          {/* The ui-sdk control is a sibling of the label, not its parent. */}
          <UiSdkOTPInput {...props} maxLength={count}>
            <OTPInputGroup>
              {Array.from({ length: count }, (_, index) => (
                <OTPInputSlot key={index} index={index} />
              ))}
            </OTPInputGroup>
          </UiSdkOTPInput>
        </FieldLayout>
      )}
    </OtpInputRoot>
  );
}

export const OtpInput: typeof OtpInputDefault & {
  Root: typeof OtpInputRoot;
  Group: typeof OTPInputGroup;
  Slot: typeof OTPInputSlot;
} = Object.assign(OtpInputDefault, {
  Root: OtpInputRoot,
  Group: OTPInputGroup,
  Slot: OTPInputSlot,
});
