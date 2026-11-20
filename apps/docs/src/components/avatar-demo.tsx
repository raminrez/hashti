"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@hashti/react";

export function AvatarDemo() {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Avatar size="xs">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function AvatarImageDemo() {
  return (
    <Avatar size="lg">
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
