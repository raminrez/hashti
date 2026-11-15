import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta = {
  title: "Getting Started/Installation",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Install and configure Hashti Design System in your React application.",
      },
    },
  },
};

export default meta;

export const Installation: StoryObj = {
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
        Installation & Setup
      </h1>
      <p style={{ color: "var(--hashti-text-secondary)", marginBottom: "2rem" }}>
        Install the Hashti component library and token package into your modern React application.
      </p>

      {/* Step 1 */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          1. Install Packages
        </h2>
        <div
          style={{
            fontFamily: "monospace",
            background: "var(--hashti-text-primary)",
            color: "var(--hashti-support-info-inverse)",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          # With Bun
          <br />
          bun add @hashti/react @hashti/tokens react-aria-components
          <br />
          <br /># With pnpm
          <br />
          pnpm add @hashti/react @hashti/tokens react-aria-components
          <br />
          <br /># With npm
          <br />
          npm install @hashti/react @hashti/tokens react-aria-components
        </div>
      </div>

      {/* Step 2 */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          2. Import Global Styles
        </h2>
        <p style={{ color: "var(--hashti-text-secondary)", fontSize: "0.95rem" }}>
          Import the Hashti design tokens and component styles into your root layout (
          <code>app/layout.tsx</code> or <code>src/main.tsx</code>):
        </p>
        <div
          style={{
            fontFamily: "monospace",
            background: "var(--hashti-text-primary)",
            color: "var(--hashti-text-inverse)",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <span style={{ fontStyle: "italic" }}>
            // Import token variables (8 themes & foundations)
          </span>
          <br />
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>import</span>{" "}
          <span style={{ color: "var(--hashti-support-success-inverse)" }}>
            "@hashti/tokens/tokens.css"
          </span>
          ;<br />
          <br />
          <span style={{ fontStyle: "italic" }}>// Import modular component styles</span>
          <br />
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>import</span>{" "}
          <span style={{ color: "var(--hashti-support-success-inverse)" }}>
            "@hashti/react/styles.css"
          </span>
          ;
        </div>
      </div>

      {/* Step 3 */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          3. Wrap Application in Theme
        </h2>
        <div
          style={{
            fontFamily: "monospace",
            background: "var(--hashti-text-primary)",
            color: "var(--hashti-text-inverse)",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>import</span> &#123;{" "}
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>Theme</span>,{" "}
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>Button</span> &#125;{" "}
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>from</span>{" "}
          <span style={{ color: "var(--hashti-support-success-inverse)" }}>"@hashti/react"</span>;
          <br />
          <br />
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>
            export default function
          </span>{" "}
          <span style={{ color: "var(--hashti-support-warning-inverse)" }}>App</span>() &#123;
          <br />
          &nbsp;&nbsp;<span style={{ color: "var(--hashti-support-info-inverse)" }}>return</span> (
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>Theme</span> theme=
          <span style={{ color: "var(--hashti-support-success-inverse)" }}>"frame-light"</span>&gt;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>Button</span> variant=
          <span style={{ color: "var(--hashti-support-success-inverse)" }}>"primary"</span>&gt;Enter
          Portal&lt;/
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>Button</span>&gt;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/
          <span style={{ color: "var(--hashti-support-info-inverse)" }}>Theme</span>&gt;
          <br />
          &nbsp;&nbsp;);
          <br />
          &#125;
        </div>
      </div>
    </div>
  ),
};
