"use client";

import { Badge } from "@hashti/react";

function Bell() {
  return (
    <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
      <path
        d="M8 2a4 4 0 0 0-4 4v3l-1 2h10l-1-2V6a4 4 0 0 0-4-4Zm-1.5 10a1.5 1.5 0 0 0 3 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BadgeDemo() {
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Badge count={3}>
        <Bell />
      </Badge>
      <Badge count={150}>
        <Bell />
      </Badge>
      <Badge isDot>
        <Bell />
      </Badge>
      <Badge kind="success">Active</Badge>
      <Badge kind="warning">Pending</Badge>
      <Badge kind="info">Beta</Badge>
      <Badge kind="neutral">Draft</Badge>
    </div>
  );
}
