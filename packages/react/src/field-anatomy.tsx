"use client";

/**
 * Legacy field-anatomy hook for the components still on React Aria Components
 * (select, combobox, date-picker, token-field — TICK-006 and TICK-016). It
 * reads a RAC slotted context and wires the Hashti presentation layer around
 * a RAC root. Delete this file once those components move to ui-sdk.
 */

import type { Context, ReactNode } from "react";
import {
  composeRenderProps,
  useSlottedContext,
  DateInput as RACDateInput,
  type DateInputProps as RACDateInputProps,
  type RenderProps,
} from "react-aria-components";
import {
  FieldPresentationContext,
  useFieldPresentation,
  type FieldPresentationProps,
  type FieldStatusPlacement,
} from "./components/field/field-context";
import { cx } from "./utils";

type SlottedContext = Context<any>;

export function useFieldAnatomy(
  props: FieldPresentationProps & { slot?: string | null; "aria-describedby"?: string },
  context: SlottedContext,
  defaultVariant: FieldStatusPlacement = "attached",
) {
  const slotted = useSlottedContext(context, props.slot) as {
    "aria-describedby"?: string;
    children?: ReactNode;
  } | null;
  const presentation = useFieldPresentation(
    { ...props },
    slotted?.["aria-describedby"],
    defaultVariant,
  );
  return {
    slotted,
    ...presentation,
    wrap<T extends object>(
      children: RenderProps<T>["children"],
      inheritedChildren?: RenderProps<T>["children"],
    ) {
      return composeRenderProps(
        children === undefined ? inheritedChildren : children,
        (content, state) => (
          <FieldPresentationContext.Provider
            value={{
              status: props.status,
              statusVariant: presentation.statusVariant,
              statusRef: presentation.statusRef,
              isOptional: props.isOptional,
              isRequired: "isRequired" in state ? Boolean(state.isRequired) : undefined,
            }}
          >
            {content}
          </FieldPresentationContext.Provider>
        ),
      );
    },
  };
}

export type FieldDateInputProps = RACDateInputProps;

/** The date-picker's RAC date input, with the field surface class. */
export function FieldDateInput({ className, ...props }: FieldDateInputProps) {
  return (
    <RACDateInput
      {...props}
      className={cx("hashti-field__control react-aria-DateInput", className as string)}
    />
  );
}

/** The date-picker's RAC date input inside a FieldControl group. */
export function FieldGroupDateInput({ className, ...props }: FieldDateInputProps) {
  return <RACDateInput {...props} className={cx("react-aria-DateInput", className as string)} />;
}
