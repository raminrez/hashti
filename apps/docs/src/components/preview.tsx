import { useState, type ReactNode } from "react";

export interface ComponentPreviewProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  code?: string;
  defaultShowCode?: boolean;
}

export function ComponentPreview({
  title,
  description,
  children,
  className = "",
  code,
  defaultShowCode = false,
}: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(defaultShowCode);
  const [copied, setCopied] = useState(false);

  // Generate a clean fallback snippet if code wasn't explicitly supplied
  const effectiveCode =
    code ||
    (title
      ? `import { ${title.split(" ")[0] || "Button"} } from "@hashti/react";\n\nexport function Example() {\n  return (\n    <${title.split(" ")[0] || "Button"}>\n      Interactive ${title}\n    </${title.split(" ")[0] || "Button"}>\n  );\n}`
      : undefined);

  const handleCopy = () => {
    if (!effectiveCode) return;
    navigator.clipboard.writeText(effectiveCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`not-prose my-6 overflow-hidden rounded-[var(--hashti-group-radius)] border border-[var(--hashti-border-subtle)] bg-[var(--hashti-layer-01)] ${className}`}
    >
      {/* Card Header with Title, Description, and Code Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hashti-border-subtle)] bg-[var(--hashti-background)] px-5 py-3">
        <div className="flex flex-col gap-0.5 min-w-[200px]">
          {title && (
            <span className="text-[var(--hashti-label-01-font-size)] font-semibold text-[var(--hashti-text-primary)]">
              {title}
            </span>
          )}
          {description && (
            <span className="text-[var(--hashti-helper-text-01-font-size)] text-[var(--hashti-text-secondary)]">
              {description}
            </span>
          )}
        </div>

        {/* Action Buttons: Show/Hide Code & Copy */}
        {effectiveCode && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className={`inline-flex items-center gap-1.5 rounded-[var(--hashti-control-radius)] border border-[var(--hashti-border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--hashti-text-secondary)] transition-colors motion-reduce:transition-none ${
                showCode
                  ? "bg-[var(--hashti-layer-selected)] text-[var(--hashti-text-primary)]"
                  : "bg-[var(--hashti-layer-01)]"
              }`}
              aria-expanded={showCode}
              aria-label={showCode ? "Hide source code" : "Show source code"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>{showCode ? "Hide Code" : "Show Code"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${showCode ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showCode && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-[var(--hashti-control-radius)] bg-[var(--hashti-button-primary)] px-3 py-1.5 text-xs font-medium text-[var(--hashti-text-on-color)] transition-colors motion-reduce:transition-none active:scale-[0.97]"
                aria-label="Copy source code to clipboard"
              >
                {copied ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[var(--hashti-focus)]">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Live Component Preview Arena */}
      <div className="relative p-5 sm:p-8 md:p-10 flex items-center justify-center min-h-[180px] bg-[var(--hashti-background)] [background-image:radial-gradient(var(--hashti-border-subtle)_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="relative z-10 w-full flex items-center justify-center">{children}</div>
      </div>

      {/* Expandable Code Section with comfortable padding */}
      {showCode && effectiveCode && (
        <div className="border-t border-[var(--hashti-border-subtle)] bg-[#14161b] text-neutral-200">
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-neutral-800/80 bg-black/40 text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--hashti-focus)]"></span>
              <span>React JSX</span>
            </span>
            <span>TypeScript</span>
          </div>
          <div className="p-6 overflow-x-auto font-mono text-xs leading-relaxed select-text">
            <pre className="m-0 p-0 overflow-x-auto text-neutral-300 whitespace-pre">
              <code>{effectiveCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
