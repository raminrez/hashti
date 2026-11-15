"use client";

import type { ReactNode, Ref } from "react";
import {
  NumberField as RACNumberField,
  NumberFieldContext,
  type NumberFieldProps as RACNumberFieldProps,
} from "react-aria-components";
import { Icon } from "../../icons";
import {
  FieldLayout,
  FieldGroupInput,
  FieldButton,
  FieldControl,
  useFieldAnatomy,
  fieldClassName,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { classes, type ControlSize } from "../../utils";

export interface NumberFieldRootProps extends RACNumberFieldProps, FieldPresentationProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

function NumberFieldRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  ...props
}: NumberFieldRootProps) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    NumberFieldContext as Parameters<typeof useFieldAnatomy>[1],
  );
  return (
    <RACNumberField
      {...props}
      {...anatomy.props}
      data-size={size}
      className={classes(fieldClassName("number-field"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children as ReactNode)}
    </RACNumberField>
  );
}

export interface NumberFieldProps extends NumberFieldRootProps, FieldContentProps {}

function NumberFieldDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  className,
  children,
  ...props
}: NumberFieldProps) {
  return (
    <NumberFieldRoot {...props} size={size} className={className}>
      {children ?? (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <FieldControl>
            <FieldGroupInput />
            <FieldButton slot="decrement" size={size}>
              <Icon name="minus" />
            </FieldButton>
            <FieldButton slot="increment" size={size}>
              <Icon name="plus" />
            </FieldButton>
          </FieldControl>
        </FieldLayout>
      )}
    </NumberFieldRoot>
  );
}

export const NumberField = Object.assign(NumberFieldDefault, {
  Root: NumberFieldRoot,
  ...fieldParts,
  Input: FieldGroupInput,
  Control: FieldControl,
  Button: FieldButton,
});
