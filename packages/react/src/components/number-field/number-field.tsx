"use client";

import type { ComponentProps, ReactNode, Ref } from "react";
import { Field as UiSdkField, type FieldState } from "@ui-sdk/react/field";
import {
  NumberInput as UiSdkNumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@ui-sdk/react/number-input";
import {
  FieldLayout,
  FieldPresentationProvider,
  fieldClassName,
  useFieldPresentation,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { Icon } from "../../icons";
import { cx, type ControlSize } from "../../utils";

export interface NumberInputRootProps
  extends Omit<ComponentProps<typeof UiSdkNumberInput>, "children" | "className">,
    FieldPresentationProps {
  size?: ControlSize;
  /** Mark the field invalid (ui-sdk Field-level). */
  invalid?: boolean;
  className?: string | ((state: FieldState) => string | undefined);
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function NumberInputRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  invalid,
  required,
  ...props
}: NumberInputRootProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      name={props.name}
      disabled={props.disabled}
      invalid={invalid}
      data-size={size}
      {...presentation.props}
      className={cx(fieldClassName("number-field"), className as string)}
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

export interface NumberInputProps extends Omit<NumberInputRootProps, "children">, FieldContentProps {
  children?: ReactNode;
}

function NumberInputDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  className,
  children,
  ...props
}: NumberInputProps) {
  return (
    <NumberInputRoot {...props} size={size} className={className}>
      {children ?? (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          {/* The ui-sdk control wraps only the group; the label stays a sibling. */}
          <UiSdkNumberInput {...props}>
            <NumberInputGroup className="hashti-field__control hashti-input-group">
              <NumberInputDecrement aria-label="Decrease" className="hashti-button" data-variant="ghost">
                <Icon name="minus" />
              </NumberInputDecrement>
              <NumberInputControl />
              <NumberInputIncrement aria-label="Increase" className="hashti-button" data-variant="ghost">
                <Icon name="plus" />
              </NumberInputIncrement>
            </NumberInputGroup>
          </UiSdkNumberInput>
        </FieldLayout>
      )}
    </NumberInputRoot>
  );
}

export const NumberInput: typeof NumberInputDefault & {
  Root: typeof NumberInputRoot;
  Group: typeof NumberInputGroup;
  Control: typeof NumberInputControl;
  Decrement: typeof NumberInputDecrement;
  Increment: typeof NumberInputIncrement;
} = Object.assign(NumberInputDefault, {
  Root: NumberInputRoot,
  Group: NumberInputGroup,
  Control: NumberInputControl,
  Decrement: NumberInputDecrement,
  Increment: NumberInputIncrement,
});
