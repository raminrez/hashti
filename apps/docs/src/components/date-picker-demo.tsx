"use client";

import {
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@hashti/react";

export function DatePickerDemo() {
  return (
    <DatePicker defaultValue="2026-10-16" style={{ maxWidth: 260 }}>
      <div className="hashti-date-picker__field">
        <DatePickerInput aria-label="Due date" />
        <DatePickerTrigger aria-label="Choose date">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M5 1.5v2M11 1.5v2M2 6.5h12M3.5 3h9A1.5 1.5 0 0 1 14 4.5v8A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5v-8A1.5 1.5 0 0 1 3.5 3Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </DatePickerTrigger>
      </div>
      <DatePickerHint />
      <DatePickerContent />
    </DatePicker>
  );
}

export function DatePickerRangeDemo() {
  return (
    <DatePicker
      mode="range"
      months={2}
      defaultValue={["2026-10-12", "2026-10-16"]}
      style={{ maxWidth: 420 }}
    >
      <div className="hashti-date-picker__field">
        <DatePickerInput aria-label="Start date" placeholder="Start date" />
        <span className="hashti-date-picker__separator" aria-hidden="true">
          –
        </span>
        <DatePickerInput end aria-label="End date" placeholder="End date" />
        <DatePickerTrigger aria-label="Choose range">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M5 1.5v2M11 1.5v2M2 6.5h12M3.5 3h9A1.5 1.5 0 0 1 14 4.5v8A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5v-8A1.5 1.5 0 0 1 3.5 3Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </DatePickerTrigger>
      </div>
      <DatePickerHint />
      <DatePickerContent />
    </DatePicker>
  );
}
