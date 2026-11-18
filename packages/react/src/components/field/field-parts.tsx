"use client";

import {
  useContext,
  useId,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import {
  FieldDescription as UiSdkFieldDescription,
  FieldError as UiSdkFieldError,
  FieldLabel as UiSdkFieldLabel,
  type FieldErrorProps as UiSdkFieldErrorProps,
} from "@ui-sdk/react/field";
import { Input as UiSdkInput } from "@ui-sdk/react/input";
import { Textarea as UiSdkTextarea } from "@ui-sdk/react/textarea";
import { useTheme } from "../../theme";
import { Icon, type IconProps } from "../../icons";
import { cx } from "../../utils";
import { FieldPresentationContext } from "./field-context";

/** Joins the component's CSS hook with a possibly state-function className. */
function classes<S>(
  base: string,
  custom: string | ((state: S) => string | undefined) | undefined,
): string | ((state: S) => string) {
  return typeof custom === "function"
    ? (state: S) => cx(base, custom(state))
    : cx(base, custom);
}

const fieldMessages: Record<
  string,
  {
    required: string;
    optional: string;
    about: string;
    close: string;
    warning: string;
    error: string;
    success: string;
  }
> = {
  en: {
    required: "required",
    optional: "optional",
    about: "About",
    close: "Close field help",
    warning: "Warning",
    error: "Error",
    success: "Success",
  },
  fa: {
    required: "الزامی",
    optional: "اختیاری",
    about: "دربارهٔ",
    close: "بستن راهنمای فیلد",
    warning: "هشدار",
    error: "خطا",
    success: "تأیید",
  },
  ar: {
    required: "مطلوب",
    optional: "اختياري",
    about: "حول",
    close: "إغلاق مساعدة الحقل",
    warning: "تحذير",
    error: "خطأ",
    success: "نجاح",
  },
  de: {
    required: "erforderlich",
    optional: "optional",
    about: "Informationen zu",
    close: "Feldhilfe schließen",
    warning: "Warnung",
    error: "Fehler",
    success: "Bestätigt",
  },
};

function useFieldMessages() {
  const { lang } = useTheme();
  return fieldMessages[(lang ?? "en").split("-")[0]!] ?? fieldMessages.en!;
}

export interface FieldLabelProps extends ComponentPropsWithRef<typeof UiSdkFieldLabel> {
  isOptional?: boolean;
  isRequired?: boolean;
  labelTooltip?: ReactNode;
}

/**
 * The field's label: a ui-sdk FieldLabel, so clicking it focuses the control
 * and it picks up the field's id wiring. Hashti adds the localized
 * "(required)"/"(optional)" marker and an optional tooltip affordance.
 */
export function FieldLabel({
  className,
  children,
  isRequired,
  isOptional,
  labelTooltip,
  ...props
}: FieldLabelProps) {
  const presentation = useContext(FieldPresentationContext);
  const messages = useFieldMessages();
  const required = presentation.isRequired || isRequired;
  const optional = isOptional ?? presentation.isOptional;
  const content = typeof children === "function" ? undefined : children;
  const label = (
    <UiSdkFieldLabel {...props} className={classes("hashti-field__label", className)}>
      {content}
      {(required || optional) && (
        <>
          {" "}
          <span className="hashti-field__necessity">
            ({required ? messages.required : messages.optional})
          </span>
        </>
      )}
    </UiSdkFieldLabel>
  );
  return labelTooltip ? (
    <div className="hashti-field__label-row">
      {label}
      <FieldLabelHelp tooltip={labelTooltip} />
    </div>
  ) : (
    label
  );
}

export interface FieldLabelHelpProps {
  labelId?: string;
  content?: ReactNode;
  tooltip?: ReactNode;
  children?: ReactNode;
}

/**
 * The small info button next to a label. It carries an accessible name built
 * from the label, and announces its content through a native `title` tooltip —
 * the interactive popover form returns when TICK-007 lands the ui-sdk popover.
 */
export function FieldLabelHelp({ content, tooltip, children }: FieldLabelHelpProps) {
  const messages = useFieldMessages();
  const text = [content ?? tooltip, typeof children === "string" ? children : undefined]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      className="hashti-field__label-help"
      aria-label={messages.about}
      title={text || undefined}
    >
      <Icon name="info" />
    </button>
  );
}

export type FieldDescriptionProps = ComponentPropsWithRef<typeof UiSdkFieldDescription>;
export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <UiSdkFieldDescription {...props} className={classes("hashti-field__description", className)} />
  );
}

export interface FieldErrorMessageProps extends ComponentPropsWithRef<typeof UiSdkFieldError> {}

/**
 * The field's recovery message. Inside a ui-sdk Field it shows with the
 * field's invalid state; standalone it renders as-is, so a custom control or
 * native select can show an error without a ui-sdk field root.
 */
export function FieldErrorMessage({ className, match, ...props }: FieldErrorMessageProps) {
  // Inside a real ui-sdk Field (typed inputs), gate on validity. Standalone
  // (a native select, the presentational Field root) there is no field
  // context, so the message renders as-is.
  const { fieldGated } = useContext(FieldPresentationContext);
  return (
    <UiSdkFieldError
      {...props}
      match={match ?? (fieldGated ? undefined : true)}
      role="alert"
      className={classes("hashti-field__error", className)}
    />
  );
}

export type FieldHelpProps = ComponentPropsWithRef<"div">;
export function FieldHelp({ className, ...props }: FieldHelpProps) {
  return (
    <div
      {...props}
      data-slot="help"
      className={cx("hashti-field__help hashti-field-help", className)}
    />
  );
}

export type FieldStatusMessageProps = ComponentPropsWithRef<"span">;
export function FieldStatusMessage({ className, id, ...props }: FieldStatusMessageProps) {
  const { status, statusRef, statusVariant = "attached" } = useContext(FieldPresentationContext);
  const messages = useFieldMessages();
  const statusId = useId();
  if (!status) return null;
  const isDetached = statusVariant === "detached";
  return (
    <span
      {...props}
      id={id ?? statusId}
      ref={statusRef}
      data-slot="status"
      data-hashti-status={status.type}
      data-variant={statusVariant}
      className={cx(
        "hashti-field__status",
        isDetached ? "hashti-field__status--detached" : "hashti-field__status--attached",
        status.message == null && "hashti-visually-hidden",
        className,
      )}
    >
      {status.message == null ? messages[status.type] : status.message}
    </span>
  );
}

export type FieldStatusIconProps = Omit<IconProps, "name">;
export function FieldStatusIcon({ className, ...props }: FieldStatusIconProps) {
  const { status } = useContext(FieldPresentationContext);
  if (!status) return null;
  return (
    <Icon
      {...props}
      name={status.type}
      data-slot="icon"
      data-hashti-status={status.type}
      className={cx("hashti-field__status-icon", className)}
    />
  );
}

export type FieldInputProps = ComponentPropsWithRef<typeof UiSdkInput>;

export function FieldInput({ className, ...props }: FieldInputProps) {
  return <UiSdkInput {...props} className={classes("hashti-field__control", className)} />;
}

export type FieldTextAreaProps = ComponentPropsWithRef<typeof UiSdkTextarea>;
export function FieldTextArea({ className, ...props }: FieldTextAreaProps) {
  return <UiSdkTextarea {...props} className={classes("hashti-field__control", className)} />;
}

export type FieldControlProps = ComponentPropsWithRef<"div">;

/**
 * The grouped control surface: an input group that holds the control, any
 * leading/trailing content, and the inline status icon.
 */
export function FieldControl({ className, children, ...props }: FieldControlProps) {
  return (
    <div {...props} data-slot="control" className={cx("hashti-field__control hashti-input-group", className)}>
      {children}
      <FieldStatusIcon />
    </div>
  );
}

export type FieldButtonProps = ComponentPropsWithRef<"button"> & {
  size?: "sm" | "md" | "lg";
};
export function FieldButton({ className, ...props }: FieldButtonProps) {
  return <button type="button" {...props} className={cx("hashti-button", className)} data-variant="ghost" />;
}

/**
 * An input that joins a ui-sdk Field (the way Input does) but carries no
 * Hashti control class of its own — it sits inside a FieldControl group.
 */
export type FieldGroupInputProps = ComponentPropsWithRef<typeof UiSdkInput>;
export function FieldGroupInput(props: FieldGroupInputProps) {
  return <UiSdkInput {...props} />;
}

/**
 * A textarea that joins a ui-sdk Field inside a FieldControl group.
 */
export type FieldGroupTextAreaProps = ComponentPropsWithRef<typeof UiSdkTextarea>;
export function FieldGroupTextArea(props: FieldGroupTextAreaProps) {
  return <UiSdkTextarea {...props} />;
}

export const fieldParts = {
  Label: FieldLabel,
  Description: FieldDescription,
  Help: FieldHelp,
  ErrorMessage: FieldErrorMessage,
  Status: FieldStatusMessage,
  StatusIcon: FieldStatusIcon,
};
