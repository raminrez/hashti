"use client";

import { type ComponentProps, type ReactNode } from "react";
import {
  Radio as UiSdkRadio,
  RadioGroup as UiSdkRadioGroup,
  RadioIndicator,
  type RadioState,
} from "@ui-sdk/react/radio";
import { Field as UiSdkField } from "@ui-sdk/react/field";
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
import type { SelectionColor } from "../checkbox";

export interface RadioGroupRootProps
  extends
    Omit<ComponentProps<typeof UiSdkRadioGroup>, "children" | "className">,
    FieldPresentationProps {
  color?: SelectionColor;
  size?: ControlSize;
  className?: string;
  children?: ReactNode;
}

function RadioGroupRoot({
  className,
  children,
  status,
  statusVariant,
  isOptional,
  color,
  size,
  ...props
}: RadioGroupRootProps) {
  const presentation = useFieldPresentation(
    { status, statusVariant, isOptional },
    props["aria-describedby"],
    "detached",
  );
  return (
    <div
      {...presentation.props}
      data-color={color}
      data-size={size}
      className={cx(fieldClassName("radio-group"), className)}
    >
      <UiSdkField disabled={props.disabled} name={props.name}>
        <FieldPresentationProvider
          status={status}
          statusVariant={presentation.statusVariant}
          isOptional={isOptional}
          isRequired={props.required}
          fieldGated
        >
          <UiSdkRadioGroup {...props}>{children}</UiSdkRadioGroup>
        </FieldPresentationProvider>
      </UiSdkField>
    </div>
  );
}

function RadioOptions({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("hashti-radio-options", className)} />;
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
      <FieldLayout
        label={label}
        labelTooltip={labelTooltip}
        description={description}
        errorMessage={errorMessage}
      >
        <RadioOptions>{children}</RadioOptions>
      </FieldLayout>
    </RadioGroupRoot>
  );
}

export interface RadioProps extends ComponentProps<typeof UiSdkRadio> {
  color?: SelectionColor;
}

export function Radio({ className, children, color, ...props }: RadioProps) {
  const classHook =
    typeof className === "function"
      ? (state: RadioState) => cx("hashti-radio", className(state))
      : cx("hashti-radio", className);
  return (
    <UiSdkRadio {...props} data-color={color} className={classHook}>
      {(state) => (
        <>
          <span className="hashti-radio-control" aria-hidden="true">
            <RadioIndicator keepMounted />
          </span>
          {typeof children === "function"
            ? children(state)
            : children != null && <span>{children}</span>}
        </>
      )}
    </UiSdkRadio>
  );
}

export const RadioGroup = Object.assign(RadioGroupDefault, {
  Root: RadioGroupRoot,
  ...fieldParts,
  Radio,
  Options: RadioOptions,
});
