import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "./combobox";

const roles = ["Viewer", "Editor", "Admin"];

const skills = ["TypeScript", "React", "CSS", "Accessibility", "Testing"];

const label = (value: string) => value;

function XIcon() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
      <path
        d="M2 2l8 8M10 2l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/Combobox",
  component: Combobox,
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
      // The root renders no element, so the width lives on a wrapping div.
      <div style={{ maxWidth: 320 }}>
        <Combobox
          {...args}
          onValueChange={(next, details) => {
            args.onValueChange?.(next, details);
            updateArgs({ value: next });
          }}
        >
          <ComboboxLabel>Role</ComboboxLabel>
          <ComboboxInput placeholder="Pick or type a role…" />
          <ComboboxContent>
            <ComboboxList>
              {roles.map((role) => (
                <ComboboxItem key={role} value={role}>
                  {role}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
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
      <Combobox multiple defaultValue={["TypeScript"]} itemToLabel={label}>
        <ComboboxLabel>Skills</ComboboxLabel>
        <ComboboxChips>
          <ComboboxValue>
            {(state) =>
              // Multiple mode guarantees string values; the generic value type is unknown.
              // oxlint-disable-next-line typescript/no-unsafe-type-assertion
              (state.value as string[]).map((value, index) => (
                <ComboboxChip key={value} value={value}>
                  {state.labels[index]}
                  <ComboboxChipRemove
                    aria-label={`Remove ${state.labels[index]}`}
                  >
                    <XIcon />
                  </ComboboxChipRemove>
                </ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxInput placeholder="Add a skill…" />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            {skills.map((skill) => (
              <ComboboxItem key={skill} value={skill}>
                {skill}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Combobox defaultValue="Admin">
        <ComboboxLabel>Role</ComboboxLabel>
        <ComboboxInput disabled />
        <ComboboxContent>
          <ComboboxList>
            {roles.map((role) => (
              <ComboboxItem key={role} value={role}>
                {role}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
};
