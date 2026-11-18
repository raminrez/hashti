"use client";

import type { ReactNode, Ref } from "react";
import {
  Field as UiSdkField,
  type FieldState,
} from "@ui-sdk/react/field";
import { Input as UiSdkInput, type InputState } from "@ui-sdk/react/input";
import { Textarea as UiSdkTextarea, type TextareaState } from "@ui-sdk/react/textarea";
import {
  FieldLayout,
  FieldPresentationProvider,
  fieldClassName,
  useFieldPresentation,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { cx, type ControlSize } from "../../utils";

/**
 * Where a change came from. ui-sdk reports its own reasons through the
 * `details` argument of `onValueChange`; these remain for the Hashti
 * onChange API the old TextField exposed.
 */
export type ChangeSource = "user" | "agent";
export interface ChangeDetails {
  source: ChangeSource;
}

export interface InputRootProps extends FieldPresentationProps {
  size?: "sm" | "md" | "lg";
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  className?: string | ((state: FieldState) => string | undefined);
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function InputRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  name,
  disabled,
  invalid,
  required,
  ...props
}: InputRootProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      name={name}
      disabled={disabled}
      invalid={invalid}
      data-size={size}
      {...presentation.props}
      className={cx(fieldClassName("text-field"), className as string)}
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

export interface InputProps extends Omit<InputRootProps, "children">, FieldContentProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  children?: ReactNode;
}

/**
 * Hashti's text input: a ui-sdk Input inside the field anatomy.
 */
function InputDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  placeholder,
  inputRef,
  className,
  children,
  value,
  defaultValue,
  onValueChange,
  type,
  required,
  readOnly,
  autoComplete,
  ...props
}: InputProps) {
  return (
    <InputRoot {...props} required={required} size={size} className={className}>
      {children ?? (
        <FieldLayout
          inlineIcon
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <UiSdkInput
            type={type}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            ref={inputRef}
          />
        </FieldLayout>
      )}
    </InputRoot>
  );
}

export const Input = Object.assign(InputDefault, {
  Root: InputRoot,
});

export interface TextAreaRootProps extends FieldPresentationProps {
  size?: "sm" | "md" | "lg";
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  className?: string | ((state: FieldState) => string | undefined);
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function TextAreaRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  name,
  disabled,
  invalid,
  required,
  ...props
}: TextAreaRootProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      name={name}
      disabled={disabled}
      invalid={invalid}
      data-size={size}
      {...presentation.props}
      className={cx(fieldClassName("text-area"), className as string)}
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

export interface TextAreaProps extends Omit<TextAreaRootProps, "children">, FieldContentProps {
  placeholder?: string;
  rows?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  inputRef?: Ref<HTMLTextAreaElement>;
  required?: boolean;
  readOnly?: boolean;
  autoResize?: boolean;
  children?: ReactNode;
}

function TextAreaDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  placeholder,
  rows = 4,
  size = "md",
  inputRef,
  className,
  children,
  value,
  defaultValue,
  onValueChange,
  required,
  readOnly,
  autoResize,
  ...props
}: TextAreaProps) {
  return (
    <TextAreaRoot {...props} required={required} size={size} className={className}>
      {children ?? (
        <FieldLayout
          inlineIcon
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <UiSdkTextarea
            rows={rows}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            required={required}
            readOnly={readOnly}
            autoResize={autoResize}
            ref={inputRef}
          />
        </FieldLayout>
      )}
    </TextAreaRoot>
  );
}

export const TextArea = Object.assign(TextAreaDefault, {
  Root: TextAreaRoot,
});

export type { InputState, TextareaState };
