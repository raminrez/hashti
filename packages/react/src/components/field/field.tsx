"use client";

import { type ComponentProps, type Context, type ReactNode, type Ref } from "react";
import { useSlottedContext } from "react-aria-components";
import { cx } from "../../utils";
import { type FieldContentProps } from "./field-layout";
import {
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldHelp,
  FieldLabel,
  FieldStatusIcon,
  FieldStatusMessage,
  FieldPresentationProvider,
  useFieldPresentation,
  type FieldPresentationProps,
  type FieldStatusPlacement,
} from "./field-parts";

/**
 * The class string every field root wears. Built here so the two halves cannot drift apart —
 * the review found four components rendering `hashti-field hashti-x hashti-field hashti-x`.
 */
export function fieldClassName(name: string): string {
  return `hashti-field hashti-${name}`;
}

// React contexts are invariant in their value, so the parameter has to stay open: a RAC context
// such as SelectContext is `Context<ContextValue<SelectProps, Element>>`, not `Context<unknown>`.
type SlottedContext = Context<any>;

/**
 * The four lines every field used to repeat by hand: read the slotted context, resolve the
 * presentation props, and wrap children so status and requiredness reach the parts.
 * Component authors keep their RAC root, generic parameters and control subtree; this owns
 * the anatomy wiring.
 */
export function useFieldAnatomy(
  props: FieldPresentationProps & { slot?: string | null; "aria-describedby"?: string },
  context: SlottedContext,
  defaultVariant: FieldStatusPlacement = "attached",
) {
  const slotted = useSlottedContext(context, props.slot) as {
    "aria-describedby"?: string;
    // Narrower than reality (a slotted child can be a render function), because `wrap` reads the
    // render props it is given: a function type here would override the call site's own inference.
    children?: ReactNode;
  } | null;
  const presentation = useFieldPresentation(
    { ...props },
    slotted?.["aria-describedby"],
    defaultVariant,
  );
  return { slotted, ...presentation };
}

export interface FieldProps
  extends
    FieldContentProps,
    FieldPresentationProps,
    Omit<ComponentProps<"div">, "children" | "className" | "ref"> {
  children?: ReactNode;
  /** Place the status icon inline with the control instead of at the end of the row. */
  inlineIcon?: boolean;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The field anatomy as a component: label, guidance, control, then recovery and status.
 * Use it when the control is not one of the typed fields — a native select, a custom widget —
 * or compose the parts yourself inside any React Aria field root. Remaining DOM props land on
 * the root, so `data-size` / `data-invalid` / `data-disabled` reach the CSS that keys on them.
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
  ref,
  ...props
}: FieldProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  const content = (
    <>
      {label != null && <FieldLabel labelTooltip={labelTooltip}>{label}</FieldLabel>}
      {description != null && <FieldDescription>{description}</FieldDescription>}
      {children}
      {inlineIcon && <FieldStatusIcon />}
      <FieldHelp>
        {typeof errorMessage !== "function" && errorMessage != null && (
          <span data-slot="error" role="alert" className="hashti-field__error">
            {errorMessage}
          </span>
        )}
        <FieldStatusMessage />
      </FieldHelp>
    </>
  );
  return (
    <div
      {...presentation.props}
      {...props}
      ref={ref}
      data-slot="root"
      className={cx("hashti-field", className)}
    >
      <FieldPresentationProvider
        status={status}
        statusVariant={presentation.statusVariant}
        isOptional={isOptional}
      >
        {content}
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
