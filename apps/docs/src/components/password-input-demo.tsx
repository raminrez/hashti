"use client";

import { Field, FieldLabel } from "@hashti/react";
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@hashti/react";

function Eye() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4S1.5 8 1.5 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle
        cx="8"
        cy="8"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function PasswordInputDemo() {
  return (
    <Field name="password" style={{ maxWidth: 320 }}>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput required>
        <PasswordInputControl placeholder="Enter your password" />
        <PasswordInputToggle aria-label="Show password">
          <Eye />
        </PasswordInputToggle>
      </PasswordInput>
    </Field>
  );
}
