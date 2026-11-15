"use client";

import { type ComponentProps, type Ref } from "react";
import {
  RadioGroup as RACRadioGroup,
  Radio as RACRadio,
  RadioGroupContext,
  composeRenderProps,
  type RadioProps as RACRadioProps,
  type RadioGroupProps as RACRadioGroupProps,
} from "react-aria-components";
import { classes } from "../../utils";
import {
  FieldLayout,
  fieldClassName,
  useFieldAnatomy,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import type { SelectionColor } from "../checkbox";

export interface RadioGroupRootProps extends RACRadioGroupProps, FieldPresentationProps {
  color?: SelectionColor;
  ref?: Ref<HTMLDivElement>;
}

function RadioGroupRoot({
  className,
  children,
  status,
  statusVariant,
  isOptional,
  color,
  ...props
}: RadioGroupRootProps) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    RadioGroupContext,
    "detached",
  );
  return (
    <RACRadioGroup
      {...props}
      {...anatomy.props}
      data-color={color}
      className={classes(fieldClassName("radio-group"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children)}
    </RACRadioGroup>
  );
}

function RadioOptions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={["hashti-radio-options", className].filter(Boolean).join(" ")} />
  );
}

export interface RadioGroupProps extends RadioGroupRootProps, FieldContentProps {
  color?: SelectionColor;
}

function RadioGroupDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  className,
  children,
  color,
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupRoot {...props} color={color} className={className}>
      {composeRenderProps(children, (content) => (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <RadioOptions>{content}</RadioOptions>
        </FieldLayout>
      ))}
    </RadioGroupRoot>
  );
}

export interface RadioProps extends RACRadioProps {
  color?: SelectionColor;
  ref?: Ref<HTMLLabelElement>;
}

export function Radio({ className, children, color, ...props }: RadioProps) {
  return (
    <RACRadio {...props} data-color={color} className={classes("hashti-radio", className)}>
      {composeRenderProps(children, (content) => (
        <>
          <span className="hashti-radio-control" aria-hidden="true" />
          <span>{content}</span>
        </>
      ))}
    </RACRadio>
  );
}

export const RadioGroup = Object.assign(RadioGroupDefault, {
  Root: RadioGroupRoot,
  ...fieldParts,
  Radio,
  Options: RadioOptions,
});
