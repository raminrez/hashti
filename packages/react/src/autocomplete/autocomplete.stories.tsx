import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "./autocomplete";

const cities = ["Amsterdam", "Berlin", "Copenhagen", "Lisbon", "Paris"];

const meta = {
  title: "Components/Autocomplete",
  component: Autocomplete,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: {
    value: "",
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: "text", table: { category: "State" } },
    onValueChange: { control: false, table: { category: "Events" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <div style={{ maxWidth: 320 }}>
        <Autocomplete
          {...args}
          onValueChange={(next, details) => {
            args.onValueChange?.(next, details);
            updateArgs({ value: next });
          }}
        >
          <AutocompleteLabel>City</AutocompleteLabel>
          <AutocompleteInput placeholder="Start typing a city…" />
          <AutocompleteContent>
            <AutocompleteList>
              {cities.map((city) => (
                <AutocompleteItem key={city} value={city}>
                  {city}
                </AutocompleteItem>
              ))}
            </AutocompleteList>
            <AutocompleteEmpty>No city matches.</AutocompleteEmpty>
          </AutocompleteContent>
        </Autocomplete>
      </div>
    );
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { value: "Paris" },
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Autocomplete defaultValue="Lisbon">
        <AutocompleteLabel>City</AutocompleteLabel>
        <AutocompleteInput disabled />
        <AutocompleteContent>
          <AutocompleteList>
            {cities.map((city) => (
              <AutocompleteItem key={city} value={city}>
                {city}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  ),
};
