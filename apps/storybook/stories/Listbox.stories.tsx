import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Listbox } from "@hashti/react";

const meta = {
  title: "Collections/Listbox",
  component: Listbox,
  parameters: {
    docs: {
      description: {
        component:
          "Listbox displays a list of options and allows selecting one or more with keyboard navigation, section grouping, and an optional load-more sentinel. Built on `@ui-sdk/react/listbox`.",
      },
    },
  },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Listbox aria-label="Favorite animals" variant="bordered">
        <Listbox.Item value="cat">Cat</Listbox.Item>
        <Listbox.Item value="dog">Dog</Listbox.Item>
        <Listbox.Item value="rabbit">Rabbit</Listbox.Item>
        <Listbox.Item value="fox">Fox</Listbox.Item>
      </Listbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox", { name: "Favorite animals" });
    expect(listbox).toBeInTheDocument();
    await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(4));
  },
};

export const GroupedWithSections: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Listbox aria-label="Select framework" variant="bordered">
        <Listbox.Section title="Frontend">
          <Listbox.Item value="react">React</Listbox.Item>
          <Listbox.Item value="vue">Vue</Listbox.Item>
          <Listbox.Item value="svelte">Svelte</Listbox.Item>
        </Listbox.Section>
        <Listbox.Section title="Backend">
          <Listbox.Item value="node">Node.js</Listbox.Item>
          <Listbox.Item value="bun">Bun</Listbox.Item>
          <Listbox.Item value="go">Go</Listbox.Item>
        </Listbox.Section>
      </Listbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox", { name: "Select framework" });
    expect(listbox).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText("Frontend")).toBeInTheDocument());
    expect(canvas.getByText("Backend")).toBeInTheDocument();
  },
};

export const MultipleSelection: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Listbox aria-label="Toppings" multiple defaultValue={["basil"]} variant="bordered">
        <Listbox.Item value="basil">
          Basil
          <Listbox.Check />
        </Listbox.Item>
        <Listbox.Item value="olive">
          Olive
          <Listbox.Check />
        </Listbox.Item>
        <Listbox.Item value="pepper">
          Pepper
          <Listbox.Check />
        </Listbox.Item>
      </Listbox>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox", { name: "Toppings" });
    expect(listbox).toBeInTheDocument();

    const basil = canvas.getByRole("option", { name: /Basil/ });
    await waitFor(() => expect(basil).toHaveAttribute("data-selected"));

    const olive = canvas.getByRole("option", { name: /Olive/ });
    await userEvent.click(olive);
    await waitFor(() => expect(olive).toHaveAttribute("data-selected"));
  },
};

export const EmptyState: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Listbox
        aria-label="Search results"
        variant="bordered"
        renderEmptyState={() => (
          <Listbox.EmptyState>No results match that search.</Listbox.EmptyState>
        )}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText("No results match that search.")).toBeInTheDocument(),
    );
  },
};

export const InfiniteScrollingLoadMore: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Listbox aria-label="Infinite server logs" variant="bordered">
        <Listbox.Item value="log-1">Server initialized on port 3000</Listbox.Item>
        <Listbox.Item value="log-2">Connected to database pool</Listbox.Item>
        <Listbox.Item value="log-3">Loaded environment configuration</Listbox.Item>
        <Listbox.LoadMore isLoading label="Loading more logs…" />
      </Listbox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const listbox = canvas.getByRole("listbox", { name: "Infinite server logs" });
    expect(listbox).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText("Loading more logs…")).toBeInTheDocument());
  },
};
