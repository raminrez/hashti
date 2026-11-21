import { expect } from "storybook/test";

import { DesignSystemHealth } from "../wrappers/DesignSystemHealth";

// Storybook-only report: DesignSystemHealth reads .storybook/design-system-health.json
// (sb-health output), so this story is the real findings list, not sample data.
export default {
  title: "Foundations/Health",
  parameters: { layout: "fullscreen" },
  tags: ["!autodocs"],
};

export const Findings = {
  render: () => <DesignSystemHealth />,
  play: async ({ canvasElement }) => {
    // Catches a broken JSON glob (empty state) or a report that renders no data.
    await expect(canvasElement.textContent).not.toContain("No report yet");
    await expect(canvasElement.textContent).toContain("Design system health");
    await expect(canvasElement.textContent).toMatch(/findings? ·/);
  },
};
