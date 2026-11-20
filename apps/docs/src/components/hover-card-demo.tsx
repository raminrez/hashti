"use client";

import { Avatar, AvatarFallback } from "@hashti/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@hashti/react";

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger href="#profile">Hollis Vance</HoverCardTrigger>
      <HoverCardContent>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar>
            <AvatarFallback>HV</AvatarFallback>
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
              Hollis Vance
            </div>
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--hashti-text-secondary)",
              }}
            >
              Design systems lead
            </div>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.8125rem",
            color: "var(--hashti-text-secondary)",
          }}
        >
          Builds the component library and the tokens behind it.
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
