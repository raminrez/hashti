import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ListBoxItem, Select, TextField } from "@hashti/react";
import { createAgent } from "@hashti/agent";

/**
 * The agent contract, in the shape a browser test can drive.
 *
 * The bridge has to be reachable from the page, so `tests/browser/agent-contract.test.ts` calls
 * `act` on `window.agent` and then reads the DOM. Module scope is deliberate: `createAgent` reads
 * the registry at call time, so it can exist before the controls mount.
 */
declare global {
  interface Window {
    agent?: ReturnType<typeof createAgent>;
  }
}

if (typeof window !== "undefined") {
  window.agent = createAgent({ allow: () => true });
}

const meta = {
  title: "Agent/Contract",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing is controlled here: the component owns the value, so an agent write must repaint it. */
export const Uncontrolled: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxWidth: "22rem" }}>
      <TextField label="Notes" defaultValue="Draft" />
      <Select label="Tier" defaultSelectedKey="free">
        <ListBoxItem id="free">Free</ListBoxItem>
        <ListBoxItem id="pro">Pro</ListBoxItem>
      </Select>
      <Button>Save notes</Button>
    </div>
  ),
};
