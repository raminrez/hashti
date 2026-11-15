import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta = {
  title: "Getting Started/Contribution",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Contribution guide and architectural standards for Hashti Design System.",
      },
    },
  },
};

export default meta;

export const Contribution: StoryObj = {
  render: () => (
    <div
      style={{
        maxWidth: 840,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "var(--hashti-font-sans, system-ui, sans-serif)",
        color: "var(--hashti-text-primary, #09090b)",
        lineHeight: 1.65,
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          margin: "0 0 0.5rem 0",
          letterSpacing: "-0.03em",
        }}
      >
        Contributing to Hashti
      </h1>
      <p style={{ color: "var(--hashti-text-secondary)", marginBottom: "2rem" }}>
        Architectural standards and component authoring guidelines for Hashti Design System
        contributors.
      </p>

      {/* Component Folder Architecture */}
      <div
        style={{
          border: "1px solid var(--hashti-border-subtle)",
          borderRadius: "1rem",
          padding: "1.5rem",
          background: "var(--hashti-layer-02)",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: 0, marginBottom: "0.5rem" }}>
          📦 HeroUI v3 Modular Component Structure
        </h2>
        <p
          style={{
            color: "var(--hashti-text-secondary)",
            fontSize: "0.95rem",
            margin: "0 0 1rem 0",
          }}
        >
          Every component in <code>packages/react/src/components/</code> maintains its own isolated
          folder:
        </p>
        <div
          style={{
            fontFamily: "monospace",
            background: "var(--hashti-text-primary)",
            color: "var(--hashti-text-inverse)",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "0.85rem",
          }}
        >
          packages/react/src/components/&lt;component-name&gt;/
          <br />
          ├── &lt;component-name&gt;.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# RAC logic
          & compound exports
          <br />
          ├── &lt;component-name&gt;.css&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Scoped
          component stylesheet
          <br />
          ├── &lt;component-name&gt;.stories.tsx# Storybook stories with play tests
          <br />
          ├── &lt;component-name&gt;.test.tsx&nbsp;&nbsp;&nbsp;# Colocated unit tests
          <br />
          └──
          index.ts&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#
          Component barrel exports
        </div>
      </div>

      {/* Validation Checklist */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem" }}>
        ✅ Pull Request Verification Checklist
      </h2>
      <ul
        style={{
          paddingLeft: "1.25rem",
          color: "var(--hashti-text-secondary)",
          fontSize: "0.95rem",
        }}
      >
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>Unit Testing:</strong> <code>bun test tests/unit</code> passes with 0 failures.
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>Static Typecheck:</strong> <code>bun run typecheck</code> produces 0 TypeScript
          diagnostics.
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>Storybook Build:</strong> <code>bun run build:storybook</code> builds cleanly.
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>Documentation Build:</strong> <code>bun run build:docs</code> builds all static
          routes.
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>Accessibility:</strong> Full keyboard roving tabindex and screen reader labels
          verified.
        </li>
      </ul>
    </div>
  ),
};
