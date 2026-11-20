"use client";

import { Link } from "@hashti/react";

export function LinkDemo() {
  return (
    <p style={{ maxWidth: 480, fontSize: "0.875rem", lineHeight: 1.5 }}>
      Read the <Link href="#docs">documentation</Link> or visit the{" "}
      <Link href="#repo">repository</Link>. Already read it? The link turns{" "}
      <Link href="#visited">visited</Link> after you follow it.
    </p>
  );
}
