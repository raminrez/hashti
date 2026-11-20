"use client";

import { useState } from "react";
import { Toggle, ToggleGroup } from "@hashti/react";

function Pin() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M8 1.5 10 6l4.5.5-3.3 3 .9 4.5L8 11.6 3.9 14l.9-4.5-3.3-3L6 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ToggleDemo() {
  const [single, setSingle] = useState(false);
  const [pair, setPair] = useState<string[]>([]);
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <Toggle pressed={single} onPressedChange={setSingle} aria-label="Pin">
          <Pin /> Pin
        </Toggle>
        <Toggle pressed={false} aria-label="Like">
          Like
        </Toggle>
        <Toggle pressed disabled aria-label="Muted">
          Muted
        </Toggle>
      </div>
      <ToggleGroup
        multiple
        value={pair}
        onValueChange={setPair}
        aria-label="Layers"
      >
        <Toggle value="grid">Grid</Toggle>
        <Toggle value="rules">Rules</Toggle>
      </ToggleGroup>
    </div>
  );
}
