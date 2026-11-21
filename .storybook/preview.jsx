import "../packages/styles/index.css";

import { withThemeByDataAttribute } from "@storybook/addon-themes";
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
} from "@storybook/addon-docs/blocks";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // axe runs per story; 'todo' reports violations without failing CI yet.
      test: "todo",
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
    options: {
      storySort: {
        order: ["Setup", "Components", "Foundations", "Flows", "*"],
      },
    },
  },
  decorators: [
    // Same data-theme hook the library and canvas-root theming use.
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
};

export default preview;
