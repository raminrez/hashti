import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button/button";
import { Preferences, createPreference, usePreference } from "./preferences";

// No storage: in-memory only, so the story never reads localStorage (deterministic).
const view = createPreference({
  values: ["list", "grid"],
  defaultValue: "list",
  attribute: "data-view",
});

function Demo({
  preferences,
}: {
  preferences: Parameters<typeof Preferences>[0]["preferences"];
}) {
  const { value } = usePreference(view);
  return (
    <Preferences preferences={preferences}>
      <div style={{ display: "grid", gap: "0.75rem", maxInlineSize: 320 }}>
        <div role="group" aria-label="View" style={{ display: "flex", gap: 8 }}>
          <Button
            size="sm"
            aria-pressed={value === "list"}
            onClick={() => view.set("list")}
          >
            List
          </Button>
          <Button
            size="sm"
            aria-pressed={value === "grid"}
            onClick={() => view.set("grid")}
          >
            Grid
          </Button>
        </div>
        <ul
          aria-label="Files"
          style={{
            display: "grid",
            gap: 8,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {["Q3 roadmap.pdf", "Launch checklist.md"].map((file) => (
            <li
              key={file}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid var(--hashti-border-subtle-00)",
                borderRadius: "var(--hashti-border-radius-08)",
              }}
            >
              {file}
            </li>
          ))}
        </ul>
      </div>
    </Preferences>
  );
}

const meta = {
  title: "Components/Preferences",
  component: Preferences,
  tags: ["autodocs"],
  // The root takes non-serializable props; the render-only demo owns the controls.
  parameters: { layout: "padded", controls: { disable: true } },
  args: { preferences: [view] },
  render: (args) => <Demo preferences={args.preferences} />,
} satisfies Meta<typeof Preferences>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
