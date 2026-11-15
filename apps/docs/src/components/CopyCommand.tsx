import React, { useState } from "react";

interface CopyCommandProps {
  command?: string;
}

export function CopyCommand({
  command = "bun add @hashti/react @hashti/tokens",
}: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-all font-mono text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 group shadow-sm"
      title="Click to copy command"
    >
      <span className="text-neutral-400 dark:text-neutral-500 select-none">$</span>
      <span>{command}</span>
      <span className="ms-2 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
