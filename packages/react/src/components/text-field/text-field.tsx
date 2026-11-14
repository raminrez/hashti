"use client";

import { useState, type ReactNode, type Ref } from "react";
import { useAgentSurface, type ChangeDetails, type ChangeSource } from "@hashti/agent";
import {
  TextField as RACTextField,
  TextFieldContext,
  type TextFieldProps as RACTextFieldProps,
} from "react-aria-components";
import {
  FieldLayout,
  FieldInput,
  FieldTextArea,
  FieldControl,
  useFieldAnatomy,
  fieldClassName,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { classes, type ControlSize } from "../../utils";

export interface TextFieldRootProps extends RACTextFieldProps, FieldPresentationProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

function TextFieldRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  ...props
}: TextFieldRootProps) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    TextFieldContext as Parameters<typeof useFieldAnatomy>[1],
  );
  return (
    <RACTextField
      {...props}
      {...anatomy.props}
      data-size={size}
      className={classes(fieldClassName("text-field"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children as ReactNode)}
    </RACTextField>
  );
}

export interface TextFieldProps extends Omit<TextFieldRootProps, "onChange">, FieldContentProps {
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  /** Keeps the value out of the agent's snapshot; set it on password and code fields. */
  agentSecret?: boolean;
  /** `details.source` tells an agent's change from a person's; `details.cancel()` refuses it. */
  onChange?: (value: string, details: ChangeDetails) => void;
}

function TextFieldDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  placeholder,
  inputRef,
  className,
  children,
  agentSecret,
  ...props
}: TextFieldProps) {
  const [mirror, setMirror] = useState<string>(
    props.value ?? props.defaultValue ?? "",
  );
  const handleChange = (
    value: string,
    source: ChangeSource = "user",
    reason?: string,
  ) => {
    let cancelled = false;
    props.onChange?.(value, {
      source,
      reason,
      cancel: () => {
        cancelled = true;
      },
    });
    if (!cancelled) setMirror(value);
  };

  // The component owns the value when the consumer does not, so an agent's write repaints the
  // control instead of only the snapshot. See the ADR's "one owner of the value" consequence.
  const value = props.value ?? mirror;

  useAgentSurface({
    component: "text-field",
    label: typeof label === "string" ? label : props["aria-label"],
    value,
    actions: {
      setValue: ([value]) => handleChange(String(value), "agent", "setValue"),
      clear: () => handleChange("", "agent", "clear"),
    },
    mark: { secret: agentSecret ?? props.type === "password" },
  });

  return (
    <TextFieldRoot
      {...props}
      value={value}
      // RAC warns when a field is both controlled and given a default; the mirror already seeded from it.
      defaultValue={undefined}
      onChange={handleChange}
      size={size}
      className={className}
      data-hashti-input-icon={children == null ? "" : undefined}
    >
      {children ?? (
        <FieldLayout
          inlineIcon
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <FieldInput placeholder={placeholder} ref={inputRef} />
        </FieldLayout>
      )}
    </TextFieldRoot>
  );
}

export const TextField = Object.assign(TextFieldDefault, {
  Root: TextFieldRoot,
  ...fieldParts,
  Input: FieldInput,
  TextArea: FieldTextArea,
  Control: FieldControl,
});

export interface TextAreaRootProps extends RACTextFieldProps, FieldPresentationProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

function TextAreaRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  ...props
}: TextAreaRootProps) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    TextFieldContext as Parameters<typeof useFieldAnatomy>[1],
  );
  return (
    <RACTextField
      {...props}
      {...anatomy.props}
      data-size={size}
      className={classes(fieldClassName("text-area"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children as ReactNode)}
    </RACTextField>
  );
}

export interface TextAreaProps extends TextAreaRootProps, FieldContentProps {
  placeholder?: string;
  rows?: number;
  inputRef?: Ref<HTMLTextAreaElement>;
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
  ...props
}: TextAreaProps) {
  return (
    <TextAreaRoot
      {...props}
      size={size}
      className={className}
      data-hashti-input-icon={children == null ? "" : undefined}
    >
      {children ?? (
        <FieldLayout
          inlineIcon
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <FieldTextArea rows={rows} placeholder={placeholder} ref={inputRef} />
        </FieldLayout>
      )}
    </TextAreaRoot>
  );
}

export const TextArea = Object.assign(TextAreaDefault, {
  Root: TextAreaRoot,
  ...fieldParts,
  Input: FieldTextArea,
  Control: FieldControl,
});
