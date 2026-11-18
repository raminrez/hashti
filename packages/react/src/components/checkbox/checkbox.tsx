"use client";

import { type ComponentProps, type ReactNode } from "react";
import {
  Checkbox as UiSdkCheckbox,
  CheckboxGroup as UiSdkCheckboxGroup,
  CheckboxIndicator,
  type CheckboxState,
  type CheckboxGroupState,
} from "@ui-sdk/react/checkbox";
import { Field as UiSdkField } from "@ui-sdk/react/field";
import { Icon } from "../../icons";
import { cx, type ControlSize } from "../../utils";
import {
  FieldLayout,
  FieldPresentationProvider,
  fieldClassName,
  useFieldPresentation,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";

export type SelectionColor = "primary" | "secondary" | "success" | "warning" | "danger";

export interface CheckboxProps extends ComponentProps<typeof UiSdkCheckbox> {
  color?: SelectionColor;
  size?: ControlSize;
}

export function Checkbox({ className, children, color, size, ...props }: CheckboxProps) {
  const classHook =
    typeof className === "function"
      ? (state: CheckboxState) => cx("hashti-checkbox", className(state))
      : cx("hashti-checkbox", className);
  return (
    <UiSdkCheckbox {...props} data-color={color} data-size={size} className={classHook}>
      {(state) => (
        <>
          <span className="hashti-checkbox-control" aria-hidden="true">
            <CheckboxIndicator keepMounted>
              <Icon name={state.indeterminate ? "minus" : "check"} />
            </CheckboxIndicator>
          </span>
          {typeof children === "function"
            ? children(state)
            : children != null && <span>{children}</span>}
        </>
      )}
    </UiSdkCheckbox>
  );
}

export interface CheckboxGroupRootProps
  extends
    Omit<ComponentProps<typeof UiSdkCheckboxGroup>, "children" | "className">,
    FieldPresentationProps {
  color?: SelectionColor;
  className?: string;
  children?: ReactNode;
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
  const presentation = useFieldPresentation(
    { status, statusVariant, isOptional },
    props["aria-describedby"],
    "detached",
  );
  return (
    <div
      {...presentation.props}
      data-color={color}
      className={cx(fieldClassName("checkbox-group"), className)}
    >
      <UiSdkField disabled={props.disabled} name={props.name}>
        <FieldPresentationProvider
          status={status}
          statusVariant={presentation.statusVariant}
          isOptional={isOptional}
          isRequired={props.required}
          fieldGated
        >
          <UiSdkCheckboxGroup {...props}>{children}</UiSdkCheckboxGroup>
        </FieldPresentationProvider>
      </UiSdkField>
    </div>
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
      <FieldLayout
        label={label}
        labelTooltip={labelTooltip}
        description={description}
        errorMessage={errorMessage}
      >
        {children}
      </FieldLayout>
    </CheckboxGroupRoot>
  );
}

export const CheckboxGroup = Object.assign(CheckboxGroupDefault, {
  Root: CheckboxGroupRoot,
  ...fieldParts,
  Checkbox,
});
