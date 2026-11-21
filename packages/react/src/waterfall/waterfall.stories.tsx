import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallRow,
  WaterfallRowHeader,
} from "./waterfall";

const requests = [
  { value: "document", label: "/", start: 0, duration: 182 },
  { value: "styles", label: "app.css", start: 190, duration: 96 },
  { value: "script", label: "app.js", start: 192, duration: 410 },
];

const meta = {
  title: "Components/Waterfall",
  component: Waterfall,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { items: requests, defaultValue: null },
  argTypes: {
    defaultValue: { table: { disable: true } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Waterfall {...args} aria-label="Network requests">
      <WaterfallHeaderRow>
        <WaterfallColumnHeader>Name</WaterfallColumnHeader>
        <WaterfallColumnHeader aria-label="Timeline">
          <WaterfallAxis maxTicks={4} />
        </WaterfallColumnHeader>
      </WaterfallHeaderRow>
      {requests.map((request) => (
        <WaterfallRow key={request.value} value={request.value}>
          <WaterfallRowHeader>{request.label}</WaterfallRowHeader>
          <WaterfallBar />
        </WaterfallRow>
      ))}
    </Waterfall>
  ),
} satisfies Meta<typeof Waterfall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { defaultValue: "script" },
};
