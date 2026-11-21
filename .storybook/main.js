import { dirname } from "path";
import { fileURLToPath } from "url";

/** Resolve absolute paths for addons in this bun workspace. */
function getAbsolutePath(value) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  // User decision: stories are co-located with components in packages/react/src.
  // The .storybook/stories glob is only for setup proofs (CssCheck), not components.
  stories: [
    "../packages/react/src/**/*.stories.@(ts|tsx)",
    "../.storybook/stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mcp"),
    getAbsolutePath("@storybook/addon-themes"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),

  // Stories under .storybook/stories import docs demos, and apps/docs inherits
  // Astro's jsx: "preserve". React stories need JSX transformed, not preserved.
  viteFinal: async (viteConfig) => {
    viteConfig.esbuild = { ...viteConfig.esbuild, jsx: "automatic" };
    return viteConfig;
  },
};

export default config;
