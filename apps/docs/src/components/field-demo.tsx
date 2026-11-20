"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from "@hashti/react";

export function FieldDemo() {
  return (
    <form
      style={{ display: "grid", gap: 16, maxWidth: 320 }}
      onSubmit={(event) => event.preventDefault()}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldDescription>We'll send you a confirmation link.</FieldDescription>
        <Input type="email" required placeholder="hollis@example.com" />
        <FieldError match="valueMissing">Enter your email address.</FieldError>
        <FieldError match="typeMismatch">
          Enter an email address like hollis@example.com.
        </FieldError>
      </Field>
      <Field name="website">
        <FieldLabel>Website</FieldLabel>
        <Input type="url" required placeholder="https://example.com" />
        <FieldError />
      </Field>
      <button type="submit" className="hashti-button" data-variant="primary">
        Subscribe
      </button>
    </form>
  );
}
