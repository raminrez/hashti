"use client";

export * from "./field";
export * from "./field-parts";
export * from "./field-layout";
export * from "./field-context";

// Legacy RAC-based anatomy hook, kept for the components still on React Aria
// (select, combobox, date-picker, token-field). Lives outside components/ so
// this directory stays RAC-free; remove with TICK-006/TICK-016.
export { useFieldAnatomy, FieldDateInput, FieldGroupDateInput } from "../../field-anatomy";
export type { FieldDateInputProps } from "../../field-anatomy";
