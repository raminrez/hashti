"use client";

import { Input, Textarea } from "@hashti/react";
import { useRef, useState, type KeyboardEvent, type UIEvent } from "react";

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

function CompletionDemo({ multiline = false }: { multiline?: boolean }) {
  const [value, setValue] = useState("");
  const ghostRef = useRef<HTMLDivElement>(null);

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

  function onKeyDown(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (!rest) return;
    const target = event.target;
    const atEnd =
      (target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement) &&
      target.selectionStart === value.length;
    if (event.key === "Tab" || (event.key === "ArrowRight" && atEnd)) {
      event.preventDefault();
      accept();
    }
  }

  // Keep the ghost's scroll offset in step with the textarea's.
  function syncScroll(event: UIEvent<HTMLTextAreaElement>) {
    if (ghostRef.current) {
      ghostRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  }

  return (
    <div
      className="hashti-inline-completion"
      data-multiline={multiline ? "true" : undefined}
    >
      {multiline ? (
        <Textarea
          value={value}
          onValueChange={setValue}
          onKeyDown={onKeyDown}
          onScroll={syncScroll}
          placeholder="Try “te”…"
          aria-label="Color with inline completion (textarea)"
        />
      ) : (
        <Input
          value={value}
          onValueChange={setValue}
          onKeyDown={onKeyDown}
          placeholder="Try “te”…"
          aria-label="Color with inline completion"
        />
      )}
      {rest ? (
        <div
          ref={ghostRef}
          className="hashti-inline-completion__ghost"
          aria-hidden="true"
        >
          <span className="hashti-inline-completion__typed">{value}</span>
          {rest}
        </div>
      ) : null}
    </div>
  );
}

export function InlineCompletionDemo() {
  return (
    <div>
      <CompletionDemo />
      <CompletionDemo multiline />
    </div>
  );
}
