import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "./timeline";

const events = [
  {
    title: "Order placed",
    time: "09:12",
    desc: "We received your order.",
    status: "complete",
  },
  {
    title: "Payment confirmed",
    time: "09:13",
    desc: "Card charged successfully.",
    status: "complete",
  },
  {
    title: "Shipped",
    time: "14:40",
    desc: "Your parcel left the warehouse.",
    status: "current",
  },
  {
    title: "Out for delivery",
    time: "Tomorrow",
    desc: "Expected before 18:00.",
    status: "upcoming",
  },
] as const;

const meta = {
  title: "Components/Timeline",
  component: Timeline,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { orientation: "vertical", loop: true },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"],
      table: { category: "Appearance" },
    },
    loop: { control: "boolean", table: { category: "Behavior" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Timeline {...args} style={{ maxInlineSize: 420 }}>
      {events.map((event) => (
        <TimelineItem key={event.title} status={event.status}>
          <TimelineMarker />
          <TimelineConnector />
          <TimelineTitle>{event.title}</TimelineTitle>
          <TimelineTime>{event.time}</TimelineTime>
          <TimelineDescription>{event.desc}</TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  ),
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
