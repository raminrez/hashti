"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  getInitials,
} from "@hashti/react";

const names = [
  "Hollis Vance",
  "Priya Nair",
  "Tom Okafor",
  "Lena Fischer",
  "Marco Ruiz",
];

export function AvatarGroupDemo() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AvatarGroup size="md">
        {names.map((n) => (
          <Avatar key={n}>
            <AvatarFallback>{getInitials(n)}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <AvatarGroup size="md" max={3}>
        {names.map((n) => (
          <Avatar key={n}>
            <AvatarFallback>{getInitials(n)}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  );
}
