import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import { watchPackages } from "./watch-packages.ts";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(ts|tsx)",
    "../../packages/react/src/components/**/*.stories.@(ts|tsx)",
  ],
  framework: "@storybook/react-vite",
  // react-docgen-typescript cannot run here: this repo compiles with TypeScript 7,
  // which ships no JS compiler API for the plugin to read props from source.
  // Prop descriptions therefore stay out of the args table until stories declare argTypes.
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
    "storybook-addon-tag-badges",
    "msw-storybook-addon",
  ],
  viteFinal(config) {
    return mergeConfig(config, {
      resolve: { dedupe: ["react", "react-dom"] },
      optimizeDeps: { exclude: ["@hashti/react", "@hashti/tokens"] },
      plugins: [watchPackages()],
    });
  },
};

export default config;
