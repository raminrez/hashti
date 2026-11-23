import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "./date-picker";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5 1.5v2M11 1.5v2M2 6.5h12M3.5 3h9A1.5 1.5 0 0 1 14 4.5v8A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5v-8A1.5 1.5 0 0 1 3.5 3Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: {
    mode: "single",
    open: false,
    defaultValue: "2026-10-16",
    onOpenChange: fn(),
  },
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["single", "range"],
      table: { category: "Behavior" },
    },
    open: { control: "boolean", table: { category: "State" } },
    months: { control: "number", table: { category: "Appearance" } },
    defaultValue: { control: "text", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onOpenChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    const range = args.mode === "range";
    return (
      <DatePicker
        {...args}
        onOpenChange={(open, details) => {
          args.onOpenChange?.(open, details);
          updateArgs({ open });
        }}
        style={{ maxInlineSize: range ? 420 : 260 }}
      >
        <div className="hashti-date-picker__field">
          <DatePickerInput
            aria-label={range ? "Start date" : "Due date"}
            placeholder={range ? "Start date" : undefined}
          />
          {range && (
            <>
              <span
                className="hashti-date-picker__separator"
                aria-hidden="true"
              >
                –
              </span>
              <DatePickerInput
                end
                aria-label="End date"
                placeholder="End date"
              />
            </>
          )}
          <DatePickerTrigger aria-label="Choose date">
            <CalendarIcon />
          </DatePickerTrigger>
        </div>
        <DatePickerHint />
        <DatePickerContent />
      </DatePicker>
    );
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
};

export const Range: Story = {
  args: {
    mode: "range",
    months: 2,
    defaultValue: ["2026-10-12", "2026-10-16"],
  },
};
