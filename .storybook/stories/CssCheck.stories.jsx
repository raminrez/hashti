import { expect } from "storybook/test";

// Setup proof: if packages/styles/index.css ever stops reaching the iframe,
// this story fails even though the button markup and class are still present.
export default {
  title: "Setup/CssCheck",
  render: () => (
    <button className="hashti-button" data-variant="primary" type="button">
      Hashti
    </button>
  ),
};

export const StylesLoaded = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector(".hashti-button");
    await expect(button).not.toBeNull();
    const style = getComputedStyle(button);
    await expect(style.minBlockSize).toBe("44px");
    await expect(style.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    await expect(document.documentElement.getAttribute("data-theme")).toBe(
      "light",
    );
  },
};
