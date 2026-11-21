import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const roles = ["Viewer", "Editor", "Admin"];

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m4 6 4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: {
    value: null,
    onValueChange: fn(),
  },
  argTypes: {
    value: {
      control: "select",
      options: roles,
      table: { category: "State" },
    },
    onValueChange: { control: false, table: { category: "Events" } },
    items: { table: { disable: true } },
  },
  // Bare Meta: ui-sdk's generic Select/Combobox props union collapses under
  // strict inference (value becomes `string & string[]`), so args stay loose
  // here; the render body is still typechecked against the real component.
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ maxWidth: 320 }}>
        <Select
          {...args}
          onValueChange={(next, details) => {
            args.onValueChange?.(next, details);
            updateArgs({ value: next });
          }}
        >
          <SelectLabel>Role</SelectLabel>
          <SelectTrigger>
            <SelectValue placeholder="Choose a role" />
            <Chevron />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
                <SelectItemIndicator>
                  <Check />
                </SelectItemIndicator>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { value: "Editor" },
};

export const Multiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Select multiple items={roles} defaultValue={["Viewer", "Admin"]}>
        <SelectLabel>Roles</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <Chevron />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
              <SelectItemIndicator>
                <Check />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Select items={roles} defaultValue="Admin">
        <SelectLabel>Role</SelectLabel>
        <SelectTrigger disabled>
          <SelectValue />
          <Chevron />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
              <SelectItemIndicator>
                <Check />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};
