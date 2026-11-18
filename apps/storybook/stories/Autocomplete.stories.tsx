import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@hashti/react";

const meta = {
  title: "Collections/Autocomplete",
  component: Autocomplete,
  args: { children: null },
  parameters: {
    docs: {
      description: {
        component:
          "Autocomplete pairs a text input with a suggestion popup: typing filters the options, arrows move the highlight, Enter chooses. A straight re-export of `@ui-sdk/react/autocomplete`.",
      },
    },
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const components = [
  { value: "listbox", label: "Listbox" },
  { value: "gridlist", label: "GridList" },
  { value: "tree", label: "Tree" },
  { value: "menu", label: "Menu" },
  { value: "popover", label: "Popover" },
  { value: "select", label: "Select" },
  { value: "searchfield", label: "SearchField" },
];

export const Playground: Story = {
  render: () => (
    <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 8 }}>
      <Autocomplete items={components}>
        <AutocompleteInput aria-label="Search components" placeholder="Type a name..." />
        <AutocompleteContent>
          <AutocompleteEmpty>No components match that search.</AutocompleteEmpty>
          <AutocompleteList />
        </AutocompleteContent>
      </Autocomplete>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Type a name...");
    expect(input).toBeInTheDocument();

    await userEvent.click(input);
    await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(components.length));

    await userEvent.type(input, "grid");
    await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(1));
    expect(canvas.getByRole("option")).toHaveTextContent("GridList");

    await userEvent.clear(input);
    await userEvent.type(input, "zzz");
    await waitFor(() =>
      expect(canvas.getByText("No components match that search.")).toBeInTheDocument(),
    );
  },
};

export const WithCustomItems: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Autocomplete>
        <AutocompleteInput aria-label="Search components" placeholder="Type a name..." />
        <AutocompleteContent>
          <AutocompleteList>
            {components.map((item) => (
              <AutocompleteItem key={item.value} value={item.value}>
                {item.label}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Type a name...");
    await userEvent.click(input);
    await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(components.length));
  },
};
