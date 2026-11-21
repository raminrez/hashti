import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./navigation-menu";

const links = [
  { href: "#components", title: "Components", desc: "Every building block." },
  { href: "#styles", title: "Styles", desc: "Tokens and recipes." },
];

const meta = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: {
    value: null,
    defaultValue: "docs",
    onValueChange: fn(),
  },
  argTypes: {
    value: { table: { disable: true } },
    defaultValue: {
      control: "inline-radio",
      options: ["docs", "resources"],
      table: { category: "State" },
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <NavigationMenu
        {...args}
        onValueChange={(value, details) => {
          args.onValueChange?.(value, details);
          updateArgs({ value });
        }}
      >
        <NavigationMenuList>
          <NavigationMenuItem value="docs">
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              {links.map((link) => (
                <NavigationMenuLink key={link.href} href={link.href}>
                  <div style={{ fontWeight: 600 }}>{link.title}</div>
                  <div
                    style={{
                      color: "var(--hashti-text-secondary)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    {link.desc}
                  </div>
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="resources">
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#guides">Guides</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    );
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { value: "docs" },
};
