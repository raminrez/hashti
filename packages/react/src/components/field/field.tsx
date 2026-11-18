"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../utils";
import { useFieldPresentation, FieldPresentationProvider } from "./field-context";
import {
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldHelp,
  FieldLabel,
  FieldStatusIcon,
  FieldStatusMessage,
} from "./field-parts";
import type { FieldContentProps } from "./field-layout";
import type { FieldPresentationProps, FieldStatusPlacement } from "./field-context";

/**
 * The class string every field root wears. Built here so the two halves cannot
 * drift apart — the review found four components rendering
 * `hashti-field hashti-x hashti-field hashti-x`.
 */
export function fieldClassName(name: string): string {
  return `hashti-field hashti-${name}`;
}

export interface FieldProps
  extends
    FieldContentProps,
    FieldPresentationProps,
    Omit<ComponentPropsWithRef<"div">, "children"> {
  children?: ReactNode;
  /** Place the status icon inline with the control instead of at the end of the row. */
  inlineIcon?: boolean;
  className?: string;
}

/**
 * The field anatomy as a component: label, guidance, control, then recovery
 * and status. Use it when the control is not one of the typed fields — a
 * native select, a custom widget — or compose the parts yourself. Remaining
 * DOM props land on the root, so `data-size` / `data-invalid` / `data-disabled`
 * reach the CSS that keys on them.
 */
function FieldRoot({
  label,
  labelTooltip,
  description,
  errorMessage,
  status,
  statusVariant,
  isOptional,
  inlineIcon,
  className,
  children,
  ...props
}: FieldProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <div
      {...presentation.props}
      {...props}
      data-slot="root"
      className={cx("hashti-field", className)}
    >
      <FieldPresentationProvider
        status={status}
        statusVariant={presentation.statusVariant}
        isOptional={isOptional}
      >
        {label != null && <FieldLabel labelTooltip={labelTooltip}>{label}</FieldLabel>}
        {description != null && <FieldDescription>{description}</FieldDescription>}
        {children}
        {inlineIcon && <FieldStatusIcon />}
        <FieldHelp>
          {errorMessage != null && <FieldErrorMessage>{errorMessage}</FieldErrorMessage>}
          <FieldStatusMessage />
        </FieldHelp>
      </FieldPresentationProvider>
    </div>
  );
}

export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Description: FieldDescription,
  ErrorMessage: FieldErrorMessage,
  Help: FieldHelp,
  Control: FieldControl,
  StatusIcon: FieldStatusIcon,
  StatusMessage: FieldStatusMessage,
});

export type { FieldStatusPlacement };
