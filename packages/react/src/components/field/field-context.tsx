"use client";

/**
 * Hashti's field anatomy on top of `@ui-sdk/react/field`.
 *
 * The ui-sdk `Field` connects a control to its label, description and errors
 * (ids, `for`, `aria-describedby`, native validation). Hashti adds its own
 * presentation layer around it: the `status`/`statusVariant`/`isOptional`
 * props, the localized necessity marker on labels, the label tooltip, and the
 * `FieldLayout` reading order every typed field inherits.
 *
 * Status is presentation only. It never changes the field's validity: an
 * invalid ui-sdk `Field` (or a submitted form that finds the control invalid)
 * wins over a status of any type, and the control keeps its own value.
 */

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ReactNode,
  type RefCallback,
} from "react";

export type FieldStatusPlacement = "attached" | "detached";

export interface FieldStatus {
  /** Presentation only. Use ui-sdk `invalid` or native constraints for validation. */
  type: "warning" | "error" | "success";
  message?: ReactNode;
  variant?: FieldStatusPlacement;
}

export interface FieldPresentationProps {
  status?: FieldStatus;
  statusVariant?: FieldStatusPlacement;
  isOptional?: boolean;
}

export const FieldPresentationContext = createContext<
  FieldPresentationProps & {
    statusRef?: RefCallback<HTMLElement>;
    isRequired?: boolean;
    /** Set by roots that render a real ui-sdk Field, so errors gate on validity. */
    fieldGated?: boolean;
  }
>({});

/**
 * Resolves the presentation props into the root's data attributes and a
 * provider value for the parts. `inheritedDescription` is an `aria-describedby`
 * the owner already computed; the status message's id joins it.
 */
export function useFieldPresentation(
  {
    status,
    statusVariant,
    isOptional,
    "aria-describedby": describedBy,
  }: FieldPresentationProps & { "aria-describedby"?: string },
  inheritedDescription?: string,
  defaultVariant: FieldStatusPlacement = "attached",
) {
  const resolvedVariant = statusVariant ?? status?.variant ?? defaultVariant;
  const description = describedBy ?? inheritedDescription;
  const [statusId, setStatusId] = useState<string>();
  const statusRef = useCallback((node: HTMLElement | null) => setStatusId(node?.id), []);
  return {
    statusVariant: resolvedVariant,
    statusRef,
    props: {
      "data-hashti-status": status?.type,
      "data-hashti-status-variant": resolvedVariant,
      "aria-describedby":
        [description, status ? statusId : undefined].filter(Boolean).join(" ") || description,
    },
    wrap(children: ReactNode) {
      return (
        <FieldPresentationContext.Provider
          value={{ status, statusVariant: resolvedVariant, statusRef, isOptional }}
        >
          {children}
        </FieldPresentationContext.Provider>
      );
    },
  };
}

/**
 * Provides status/requiredness to the parts without a render prop. Needed when
 * the anatomy wraps a control that is not a ui-sdk field control.
 */
export function FieldPresentationProvider({
  status,
  statusVariant,
  isOptional,
  isRequired,
  fieldGated,
  children,
}: FieldPresentationProps & {
  isRequired?: boolean;
  fieldGated?: boolean;
  children: ReactNode;
}) {
  return (
    <FieldPresentationContext.Provider
      value={{ status, statusVariant, isOptional, isRequired, fieldGated }}
    >
      {children}
    </FieldPresentationContext.Provider>
  );
}
