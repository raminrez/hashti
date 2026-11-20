import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
} from "./calendar";

// Fixed month so every render of the story shows the same grid.
const JUNE_2026 = "2026-06";

function CalendarExample(props: ComponentProps<typeof Calendar>) {
  return (
    <Calendar aria-label="Pick a date" style={{ maxWidth: 320 }} {...props}>
      <div className="hashti-calendar__header">
        <CalendarPrevious />
        <CalendarHeading />
        <CalendarNext />
      </div>
      <CalendarGrid>
        <CalendarWeekdays>
          {(index) => <CalendarWeekday index={index} />}
        </CalendarWeekdays>
        <CalendarWeeks>
          {(cell) => <CalendarDay value={cell.date} />}
        </CalendarWeeks>
      </CalendarGrid>
    </Calendar>
  );
}

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    mode: "single",
    defaultMonth: JUNE_2026,
    defaultValue: "2026-06-12",
    onValueChange: fn(),
    onMonthChange: fn(),
  },
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["single", "multiple", "range"],
      table: { category: "Behavior" },
    },
    defaultValue: { control: "text", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    value: { table: { disable: true } },
    onValueChange: { control: false, table: { category: "Events" } },
    onMonthChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: (args) => <CalendarExample {...args} />,
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <CalendarExample
      mode="multiple"
      defaultMonth={JUNE_2026}
      defaultValue={["2026-06-08", "2026-06-19", "2026-06-26"]}
    />
  ),
};

export const Range: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <CalendarExample
      mode="range"
      defaultMonth={JUNE_2026}
      defaultValue={["2026-06-08", "2026-06-12"]}
    />
  ),
};
