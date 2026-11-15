import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta = {
  title: "Getting Started/Introduction",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Welcome to Hashti Design System (hashti-storybook.raminrez.dev).",
      },
    },
  },
};

export default meta;

export const Introduction: StoryObj = {
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
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <img src="/hashti-mark.svg" alt="Hashti logo" style={{ width: 44, height: 44 }} />
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>
            هشتی Hashti Design System
          </h1>
          <p style={{ margin: 0, color: "var(--hashti-text-secondary)", fontSize: "0.95rem" }}>
            hashti-storybook.raminrez.dev • hashti.raminrez.dev
          </p>
        </div>
      </div>

      <p style={{ fontSize: "1.1rem", color: "var(--hashti-text-primary)", marginBottom: "2rem" }}>
        Hashti is an enterprise-grade React component library inspired by the spatial elegance and
        structural harmony of classical Persian architecture. Built on{" "}
        <strong>React Aria Components (RAC 1.22.1)</strong> and zero-runtime scoped CSS, Hashti
        serves as the welcoming transitional threshold between complex underlying application logic
        and serene human experience.
      </p>

      {/* Portal Architecture */}
      <div
        style={{
          border: "1px solid var(--hashti-border-subtle)",
          borderRadius: "1rem",
          padding: "1.5rem",
          background: "var(--hashti-layer-02)",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: 0, marginBottom: "0.75rem" }}>
          🏛️ The Iranian Architectural Portal Concept
        </h2>
        <p style={{ margin: "0 0 1rem 0", color: "var(--hashti-text-secondary)" }}>
          In traditional Persian architecture (Isfahan, Yazd, Kashan, Shiraz), the{" "}
          <strong>Hashti (هشتی)</strong> is a vaulted octagonal transitional vestibule situated
          immediately behind the entrance portal (<em>Sar-Dar</em>).
        </p>
        <div
          style={{
            fontFamily: "monospace",
            background: "var(--hashti-text-primary)",
            color: "var(--hashti-support-info-inverse)",
            padding: "1rem",
            borderRadius: "0.5rem",
            fontSize: "0.85rem",
            overflowX: "auto",
          }}
        >
          [Public Realm / APIs] ──► [Sar-Dar Portal] ──► [Hashti Vestibule] ──► [Dalan Corridor] ──►
          [Hayat Sanctuary]
        </div>
      </div>

      {/* Core Principles Grid */}
      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
        Core Architectural Principles
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            border: "1px solid var(--hashti-border-subtle)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            background: "var(--hashti-layer-01)",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              margin: "0 0 0.5rem 0",
              color: "var(--hashti-support-success)",
            }}
          >
            1. Universal Accessibility (RAC 1.22.1)
          </h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--hashti-text-secondary)" }}>
            Full WAI-ARIA compliance, roving tabindex, arrow navigation, escape stacks, and
            screen-reader announcements.
          </p>
        </div>

        <div
          style={{
            border: "1px solid var(--hashti-border-subtle)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            background: "var(--hashti-layer-01)",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              margin: "0 0 0.5rem 0",
              color: "var(--hashti-support-warning)",
            }}
          >
            2. Zero Carbon Squareness
          </h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--hashti-text-secondary)" }}>
            Pure monochrome #000000/#FFFFFF canvas, arched curves, tactile spring
            micro-interactions, and Persian turquoise/amber glazes.
          </p>
        </div>

        <div
          style={{
            border: "1px solid var(--hashti-border-subtle)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            background: "var(--hashti-layer-01)",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              margin: "0 0 0.5rem 0",
              color: "var(--hashti-support-success)",
            }}
          >
            3. Compound Ergonomics
          </h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--hashti-text-secondary)" }}>
            Direct subcomponent composition (&lt;Select.Trigger&gt;, &lt;Select.Value&gt;,
            &lt;Select.Popover&gt;) inspired by HeroUI v3.
          </p>
        </div>

        <div
          style={{
            border: "1px solid var(--hashti-border-subtle)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            background: "var(--hashti-layer-01)",
          }}
        >
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              margin: "0 0 0.5rem 0",
              color: "var(--hashti-support-warning)",
            }}
          >
            4. Bidirectional Typography
          </h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--hashti-text-secondary)" }}>
            First-class pairing of <strong>Vazirmatn</strong> (Persian Nastaliq digital geometry)
            and <strong>Satoshi</strong> (modern Latin sans).
          </p>
        </div>
      </div>
    </div>
  ),
};
