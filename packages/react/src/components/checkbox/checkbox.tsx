"use client";

import { type Ref } from "react";
import {
  Checkbox as RACCheckbox,
  CheckboxGroup as RACCheckboxGroup,
  CheckboxGroupContext,
  composeRenderProps,
  type CheckboxProps as RACCheckboxProps,
  type CheckboxGroupProps as RACCheckboxGroupProps,
} from "react-aria-components";
import { Icon } from "../../icons";
import { classes } from "../../utils";
import {
  FieldLayout,
  fieldClassName,
  useFieldAnatomy,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";

export type SelectionColor = "primary" | "secondary" | "success" | "warning" | "danger";

export interface CheckboxProps extends RACCheckboxProps {
  color?: SelectionColor;
  ref?: Ref<HTMLLabelElement>;
}

export function Checkbox({ children, className, color, ...props }: CheckboxProps) {
  return (
    <RACCheckbox {...props} data-color={color} className={classes("hashti-checkbox", className)}>
      {composeRenderProps(children, (content, state) => (
        <>
          <span className="hashti-checkbox-control" aria-hidden="true">
            {state.isIndeterminate ? (
              <Icon name="minus" />
            ) : state.isSelected ? (
              <Icon name="check" />
            ) : null}
          </span>
          {content != null && <span>{content}</span>}
        </>
      ))}
    </RACCheckbox>
  );
}

export interface CheckboxGroupRootProps extends RACCheckboxGroupProps, FieldPresentationProps {
  color?: SelectionColor;
  ref?: Ref<HTMLDivElement>;
}

function CheckboxGroupRoot({
  className,
  children,
  status,
  statusVariant,
  isOptional,
  color,
  ...props
}: CheckboxGroupRootProps) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    CheckboxGroupContext,
    "detached",
  );
  return (
    <RACCheckboxGroup
      {...props}
      {...anatomy.props}
      data-color={color}
      className={classes(fieldClassName("checkbox-group"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children)}
    </RACCheckboxGroup>
  );
}

export interface CheckboxGroupProps extends CheckboxGroupRootProps, FieldContentProps {
  color?: SelectionColor;
}

function CheckboxGroupDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  className,
  children,
  color,
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupRoot {...props} color={color} className={className}>
      {composeRenderProps(children, (content) => (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          {content}
        </FieldLayout>
      ))}
    </CheckboxGroupRoot>
  );
}

export const CheckboxGroup = Object.assign(CheckboxGroupDefault, {
  Root: CheckboxGroupRoot,
  ...fieldParts,
  Checkbox,
});
