import { Menubar } from "../../packages/react/src/menubar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "../../packages/react/src/menu";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "../../packages/react/src/segmented-control";
import { Toolbar, ToolbarButton } from "../../packages/react/src/toolbar";

// Decision aid for design-system/gaps.md G5. Nothing here is shipped style:
// every height below is either the control's current component CSS or a
// scoped override applied by this story only. No packages/styles file changes.

const MODES = [
  { className: "", label: "BEFORE — current" },
  { className: "g5-opt-44", label: "AFTER — 44px ladder" },
  { className: "g5-opt-32", label: "COMPACT — 32px tier" },
];

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "var(--hashti-spacing-05)",
  alignItems: "start",
};

const cellStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "var(--hashti-spacing-02)",
  padding: "var(--hashti-spacing-04)",
  border: "1px solid var(--hashti-border-subtle-00)",
  borderRadius: "var(--hashti-control-radius)",
  background: "var(--hashti-layer-01)",
};

const captionStyle = {
  margin: 0,
  color: "var(--hashti-text-secondary)",
  fontSize: "var(--hashti-helper-text-01-font-size)",
};

function Row({ title, current, selector, note, render }) {
  return (
    <section style={{ display: "grid", gap: "var(--hashti-spacing-03)" }}>
      <header>
        <h2
          style={{ margin: 0, fontSize: "var(--hashti-heading-04-font-size)" }}
        >
          {title}
        </h2>
        <p style={{ ...captionStyle, marginBlock: "var(--hashti-spacing-01)" }}>
          <code>{current}</code>
          {note ? ` — ${note}` : ""}
        </p>
      </header>
      <div style={gridStyle}>
        {MODES.map((mode) => (
          <div
            className={mode.className ? `g5-cell ${mode.className}` : "g5-cell"}
            style={cellStyle}
            key={mode.label}
            data-measure={selector}
          >
            <span style={captionStyle}>{mode.label}</span>
            {render()}
            <code className="g5-readout" style={captionStyle}>
              measured: …
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}

// AFTER / COMPACT overrides. Scoped to .g5-opt-* cells, so they can never
// touch a shipped component. Heights come from tokens (44px = --hashti-size-md,
// 32px = --hashti-size-sm) — no raw px in this stylesheet.
const OVERRIDE_CSS = `
.g5-opt-44 .hashti-toolbar-button,
.g5-opt-44 .hashti-toolbar-link,
.g5-opt-44 .hashti-toolbar-input,
.g5-opt-44 .hashti-dialog-close,
.g5-opt-44 .hashti-popover-close,
.g5-opt-44 .hashti-drawer-close {
  min-block-size: var(--hashti-size-md);
}
.g5-opt-44 .hashti-menubar .hashti-menu-trigger {
  min-block-size: var(--hashti-size-md);
}
.g5-opt-44 .hashti-segmented-control {
  min-block-size: var(--hashti-size-md);
}

.g5-opt-32 .hashti-toolbar-button,
.g5-opt-32 .hashti-toolbar-link,
.g5-opt-32 .hashti-toolbar-input,
.g5-opt-32 .hashti-dialog-close,
.g5-opt-32 .hashti-popover-close,
.g5-opt-32 .hashti-drawer-close {
  min-block-size: var(--hashti-size-sm);
}
.g5-opt-32 .hashti-menubar .hashti-menu-trigger {
  min-block-size: var(--hashti-size-sm);
}
.g5-opt-32 .hashti-segmented-control {
  min-block-size: var(--hashti-size-sm);
}
`;

function Showcase() {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--hashti-spacing-06)",
        padding: "var(--hashti-spacing-05)",
        color: "var(--hashti-text-primary)",
      }}
    >
      <style>{OVERRIDE_CSS}</style>

      <header style={{ display: "grid", gap: "var(--hashti-spacing-02)" }}>
        <h1
          style={{ margin: 0, fontSize: "var(--hashti-heading-03-font-size)" }}
        >
          G5 — off-ladder control heights
        </h1>
        <p style={{ margin: 0, maxInlineSize: "68ch", lineHeight: 1.5 }}>
          Several interactive controls sit below the 44px minimum with no
          compact mapping: toolbar buttons and dialog / popover / drawer closes
          at <strong>36px</strong>, menubar triggers at <strong>32px</strong>,
          the segmented control at <strong>40px</strong>. Two ways out of G5,
          shown per control:
        </p>
        <ol
          style={{
            margin: 0,
            paddingInlineStart: "var(--hashti-spacing-05)",
            lineHeight: 1.5,
          }}
        >
          <li>
            <strong>Document a compact tier.</strong> Accept 32px as the
            deliberate compact size for dense chrome (toolbars, menu bars,
            overlay closes) and say so in DESIGN.md — the ladder stays 32 / 44 /
            48, compact is a named exception.
          </li>
          <li>
            <strong>Map everything to the 32 / 44 / 48 ladder.</strong> Move
            these controls up to 44px (and optionally offer a 32px tier) so no
            control is off-ladder. Bigger targets, slightly airier chrome.
          </li>
        </ol>
        <p style={{ ...captionStyle, maxInlineSize: "68ch" }}>
          Each row shows the control as it ships today, then the same control at
          44px and at a 32px compact tier, using a story-only class override.
          The numbers under each are measured from the browser. Close buttons
          are rendered as plain buttons carrying the real close class; the
          overlay is omitted so three can sit side by side.
        </p>
      </header>

      <Row
        title="Toolbar button"
        current="min-block-size: 2.25rem (36px) · .hashti-toolbar-button"
        selector=".hashti-toolbar-button"
        render={() => (
          <Toolbar aria-label="Formatting">
            <ToolbarButton>Bold</ToolbarButton>
          </Toolbar>
        )}
      />

      <Row
        title="Menubar trigger"
        current="min-block-size: 2rem (32px) · .hashti-menubar .hashti-menu-trigger"
        selector=".hashti-menubar .hashti-menu-trigger"
        note="already at the compact size"
        render={() => (
          <Menubar>
            <Menu>
              <MenuTrigger>File</MenuTrigger>
              <MenuContent>
                <MenuItem value="new">New</MenuItem>
              </MenuContent>
            </Menu>
          </Menubar>
        )}
      />

      <Row
        title="Segmented control"
        current="items stretch to 40px (root 48px) · .hashti-segmented-control-item"
        selector=".hashti-segmented-control-item"
        render={() => (
          <SegmentedControl defaultValue="list">
            <SegmentedControlIndicator />
            <SegmentedControlItem value="list">List</SegmentedControlItem>
            <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
          </SegmentedControl>
        )}
      />

      <Row
        title="Dialog close"
        current="min-block-size: 2.25rem (36px) · .hashti-dialog-close"
        selector=".hashti-dialog-close"
        render={() => (
          <button className="hashti-dialog-close" type="button">
            Close
          </button>
        )}
      />

      <Row
        title="Popover close"
        current="min-block-size: 2.25rem (36px) · .hashti-popover-close"
        selector=".hashti-popover-close"
        render={() => (
          <button className="hashti-popover-close" type="button">
            Close
          </button>
        )}
      />

      <Row
        title="Drawer close"
        current="min-block-size: 2.25rem (36px) · .hashti-drawer-close"
        selector=".hashti-drawer-close"
        render={() => (
          <button className="hashti-drawer-close" type="button">
            Close
          </button>
        )}
      />
    </div>
  );
}

// Reads each cell's real control height after render, so the readout can't
// drift from the component CSS.
const measureHeights = async ({ canvasElement }) => {
  for (const cell of canvasElement.querySelectorAll("[data-measure]")) {
    const target = cell.querySelector(cell.dataset.measure);
    const readout = cell.querySelector(".g5-readout");
    if (target && readout) {
      readout.textContent = `measured: ${Math.round(
        target.getBoundingClientRect().height,
      )}px`;
    }
  }
};

export default {
  title: "Foundations/G5 Control Heights",
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "720px" } },
  },
  render: () => <Showcase />,
  play: measureHeights,
};

export const DecisionAid = {};
