"use client";

import { useState } from "react";
import { Button } from "../button";
import { Icon } from "../../icons";

export interface CodeSnippetProps {
  children: string;
  label?: string;
  language?: string;
  copyable?: boolean;
  className?: string;
  maxHeight?: string;
  type?: "single" | "multi" | "inline";
  wrapText?: boolean;
}

export function CodeSnippet({
  children,
  label = "Code example",
  language,
  copyable = true,
  className,
  maxHeight,
  type = "multi",
  wrapText = false,
}: CodeSnippetProps) {
  const [copyStatus, setCopyStatus] = useState("");

  async function copy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(children);
      }
      setCopyStatus("Copied to clipboard");
    } catch {
      setCopyStatus("Could not copy. Select the code and copy it manually.");
    }
  }

  if (type === "inline") {
    return (
      <span
        data-type="inline"
        className={["hashti-code-snippet", "hashti-code-snippet--inline", className]
          .filter(Boolean)
          .join(" ")}
      >
        <code data-language={language}>{children}</code>
        {copyable && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={`Copy ${label.toLowerCase()}`}
            onPress={copy}
          >
            <Icon name={copyStatus === "Copied to clipboard" ? "check" : "copy"} />
          </Button>
        )}
        <span role="status" className="hashti-visually-hidden">
          {copyStatus}
        </span>
      </span>
    );
  }

  return (
    <div
      data-type={type}
      data-wrap={wrapText ? "true" : undefined}
      className={[
        "hashti-code-snippet",
        `hashti-code-snippet--${type} hashti-code-snippet--${type}`,
        wrapText ? "hashti-code-snippet--wrap" : undefined,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {copyable && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={`Copy ${label.toLowerCase()}`}
          onPress={copy}
        >
          <Icon name={copyStatus === "Copied to clipboard" ? "check" : "copy"} />
        </Button>
      )}
      <pre tabIndex={0} aria-label={label} style={{ maxHeight }}>
        <code data-language={language}>{children}</code>
      </pre>
      <span role="status" className="hashti-visually-hidden">
        {copyStatus}
      </span>
    </div>
  );
}
