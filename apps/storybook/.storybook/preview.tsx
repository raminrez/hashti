import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { mswLoader } from "msw-storybook-addon/csf3";
import { create } from "storybook/theming";
import { Theme } from "@hashti/react";
import "@hashti/react/styles.css";
import "./docs.css";

// Docs chrome follows the Frame light surfaces instead of Storybook's defaults,
// so code samples and tables sit on the same palette as the components they show.
const docsTheme = create({
  base: "light",
  brandTitle: "Hashti",
  colorPrimary: "#0f62fe",
  colorSecondary: "#606674",
  fontBase: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appBorderColor: "#dde1e8",
  appBorderRadius: 10,
});

// Frame themes are attribute-driven, so the addon flips data-hashti-theme on the
// document and every Theme boundary below it inherits the resolved tokens.
const preview: Preview = {
  tags: ["autodocs"],
  initialGlobals: { theme: "Frame light" },
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
    docs: { theme: docsTheme },
  },
  loaders: [mswLoader()],
  decorators: [
    withThemeByDataAttribute({
      themes: { "Frame light": "frame-light", "Frame dark": "frame-dark" },
      defaultTheme: "Frame light",
      attributeName: "data-hashti-theme",
      parentSelector: "html",
    }),
    (Story, { globals, viewMode }) => (
      <Theme
        theme={globals.theme === "Frame dark" ? "frame-dark" : "frame-light"}
        style={
          viewMode === "docs"
            ? { padding: "1rem" }
            : { minHeight: "100vh", padding: "1.5rem", boxSizing: "border-box" }
        }
      >
        <Story />
      </Theme>
    ),
  ],
};

export default preview;
