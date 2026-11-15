import { addons } from "storybook/manager-api";
import { defaultConfig, type TagBadgeParameters } from "storybook-addon-tag-badges/manager-helpers";

// Component tags carry the state we actually track. `a11y:gap` marks a component
// with a known, documented accessibility gap; it is not a badge of honour.
addons.setConfig({
  tagBadges: [
    {
      tags: { prefix: "a11y" },
      badge: {
        text: "a11y gap",
        style: "orange",
        tooltip: "A known accessibility gap is open for this component.",
      },
      display: {
        sidebar: [{ type: "component", skipInherited: false }],
        toolbar: true,
        mdx: true,
      },
    },
    ...defaultConfig,
  ] satisfies TagBadgeParameters,
});
