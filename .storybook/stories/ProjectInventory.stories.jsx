import { expect } from "storybook/test";

import { ProjectInventory } from "../wrappers/ProjectInventory";

// Storybook-only report: ProjectInventory reads .storybook/project-inventory.json
// (sb-inventory output), so this story is the real report, not sample data.
export default {
  title: "Foundations/Inventory",
  parameters: { layout: "fullscreen" },
  tags: ["!autodocs"],
};

export const Report = {
  render: () => <ProjectInventory />,
  play: async ({ canvasElement }) => {
    // Catches a broken JSON glob (empty state) or a report that renders no data.
    await expect(canvasElement.textContent).not.toContain("No inventory yet");
    await expect(canvasElement.textContent).toContain("Project inventory");
  },
};
