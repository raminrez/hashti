"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Field as UiField,
  FieldControl as UiFieldControl,
  FieldDescription as UiFieldDescription,
  FieldError as UiFieldError,
  FieldGroup as UiFieldGroup,
  FieldLabel as UiFieldLabel,
  FieldLegend as UiFieldLegend,
  FieldSet as UiFieldSet,
} from "@ui-sdk/react/field";

function Field(props: ComponentProps<typeof UiField>) {
  return (
    <UiField {...props} className={join("hashti-field", props.className)} />
  );
}

function FieldLabel(props: ComponentProps<typeof UiFieldLabel>) {
  return (
    <UiFieldLabel
      {...props}
      className={join("hashti-field__label", props.className)}
    />
  );
}

function FieldControl(props: ComponentProps<typeof UiFieldControl>) {
  return (
    <UiFieldControl
      {...props}
      className={join("hashti-field__control", props.className)}
    />
  );
}

function FieldDescription(props: ComponentProps<typeof UiFieldDescription>) {
  return (
    <UiFieldDescription
      {...props}
      className={join("hashti-field__description", props.className)}
    />
  );
}

function FieldError(props: ComponentProps<typeof UiFieldError>) {
  return (
    <UiFieldError
      {...props}
      className={join("hashti-field__error", props.className)}
    />
  );
}

function FieldSet(props: ComponentProps<typeof UiFieldSet>) {
  return (
    <UiFieldSet
      {...props}
      className={join("hashti-field-set", props.className)}
    />
  );
}

function FieldLegend(props: ComponentProps<typeof UiFieldLegend>) {
  return (
    <UiFieldLegend
      {...props}
      className={join("hashti-field__legend", props.className)}
    />
  );
}

function FieldGroup(props: ComponentProps<typeof UiFieldGroup>) {
  return (
    <UiFieldGroup
      {...props}
      className={join("hashti-field-group", props.className)}
    />
  );
}

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldGroup,
};
