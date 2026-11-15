import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Autocomplete, ListBox, SearchField, Text } from "@hashti/react";

const meta = {
  title: "Collections/Autocomplete",
  component: Autocomplete,
  args: { children: null },
  parameters: {
    docs: {
      description: {
        component:
          "Autocomplete combines a text input or search field with a menu or listbox to provide search suggestions as the user types. The wrapped collection is filtered with React Aria's locale-aware `contains` unless a `filter` prop is supplied.",
      },
    },
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

interface ComponentItem {
  id: string;
  name: string;
  category: string;
}

const components: ComponentItem[] = [
  { id: "listbox", name: "ListBox", category: "Collections" },
  { id: "gridlist", name: "GridList", category: "Collections" },
  { id: "tree", name: "Tree", category: "Collections" },
  { id: "menu", name: "Menu", category: "Overlays" },
  { id: "popover", name: "Popover", category: "Overlays" },
  { id: "select", name: "Select", category: "Fields" },
  { id: "searchfield", name: "SearchField", category: "Fields" },
];

export const Playground: Story = {
  render: () => (
    <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 8 }}>
      <Autocomplete>
        <SearchField label="Search components" placeholder="Type a name..." />
        <ListBox
          aria-label="Components"
          items={components}
          renderEmptyState={() => "No components match that search."}
        >
          {(item) => (
            <ListBox.Item id={item.id} textValue={item.name}>
              <Text slot="label">{item.name}</Text>
              <Text slot="description">{item.category}</Text>
            </ListBox.Item>
          )}
        </ListBox>
      </Autocomplete>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Type a name...");
    expect(input).toBeInTheDocument();
    expect(canvas.getAllByRole("option")).toHaveLength(components.length);

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
