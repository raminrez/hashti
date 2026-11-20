"use client";

import { Input } from "@hashti/react";
import { useState, type KeyboardEvent } from "react";

const colors = [
  "Amber",
  "Black",
  "Blue",
  "Brown",
  "Coral",
  "Crimson",
  "Green",
  "Grey",
  "Indigo",
  "Magenta",
  "Orange",
  "Purple",
  "Red",
  "Teal",
  "Yellow",
];

export function InlineCompletionDemo() {
  const [value, setValue] = useState("");

  const rest =
    value === ""
      ? ""
      : (
          colors.find(
            (c) =>
              c.toLowerCase().startsWith(value.toLowerCase()) &&
              c.toLowerCase() !== value.toLowerCase(),
          ) ?? ""
        ).slice(value.length);

  function accept() {
    if (rest) setValue(value + rest);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!rest) return;
    const atEnd =
      (event.target as HTMLInputElement).selectionStart === value.length;
    if (event.key === "Tab" || (event.key === "ArrowRight" && atEnd)) {
      event.preventDefault();
      accept();
    }
  }

  return (
    <div className="hashti-inline-completion">
      <Input
        value={value}
        onValueChange={setValue}
        onKeyDown={onKeyDown}
        placeholder="Try “te”…"
        aria-label="Color with inline completion"
      />
      {rest ? (
        <div className="hashti-inline-completion__ghost" aria-hidden="true">
          <span className="hashti-inline-completion__typed">{value}</span>
          {rest}
        </div>
      ) : null}
    </div>
  );
}
