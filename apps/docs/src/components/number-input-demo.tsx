"use client";

import { Field, FieldLabel } from "@hashti/react";
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
} from "@hashti/react";

function Minus() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M3 8h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Plus() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M8 3v10M3 8h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NumberInputDemo() {
  return (
    <Field name="quantity" style={{ maxWidth: 220 }}>
      <FieldLabel>Quantity</FieldLabel>
      <NumberInput defaultValue={1} min={1} max={99}>
        <NumberInputGroup>
          <NumberInputDecrement aria-label="Decrease">
            <Minus />
          </NumberInputDecrement>
          <NumberInputControl />
          <NumberInputIncrement aria-label="Increase">
            <Plus />
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
    </Field>
  );
}
