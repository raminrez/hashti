import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { parseTime } from "@internationalized/date";
import { Theme, TimeField, useTheme, type TimeValue } from "@hashti/react";
import "./fields.css";

function format(time: TimeValue | null) {
  return time
    ? `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`
    : "";
}

const meta = {
  title: "Fields/TimeField",
  component: TimeField,
  args: {
    label: "Deploy window",
    description: "Enter a time in your local zone.",
    granularity: "minute",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    granularity: { control: "select", options: ["hour", "minute", "second"] },
    hourCycle: { control: "select", options: [12, 24] },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isRequired: { control: "boolean" },
    isInvalid: { control: "boolean" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "TimeField wraps RAC TimeField and renders the Frame field anatomy: label, persistent guidance, segmented control, attached recovery. Segments answer to arrow keys, numeric typing and the locale's time cycle. TimeField.Root keeps RAC's props and children contract; Label, Description, Input, Segment, Help and ErrorMessage stay independently composable.",
      },
    },
  },
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <TimeField {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <TimeField
        label="Editable window"
        description="Local zone."
        defaultValue={parseTime("09:30")}
      />
      <TimeField
        label="Window requiring correction"
        description="Use a time inside business hours."
        isInvalid
        errorMessage="Choose a time between 08:00 and 18:00."
      />
      <TimeField
        label="Read-only window"
        description="You can select and copy this value."
        defaultValue={parseTime("14:30")}
        isReadOnly
      />
      <TimeField
        label="Unavailable window"
        description="Owners manage the release schedule."
        defaultValue={parseTime("11:00")}
        isDisabled
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Choose a time between 08:00 and 18:00.")).toBeVisible();
    await expect(canvas.getByText("Use a time inside business hours.")).toBeVisible();
    await expect(canvas.getByText("Owners manage the release schedule.")).toBeVisible();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <TimeField label="Small window" size="sm" defaultValue={parseTime("09:00")} />
      <TimeField label="Default window" defaultValue={parseTime("09:00")} />
      <TimeField label="Large window" size="lg" defaultValue={parseTime("09:00")} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [name, minimum] of [
      ["Small window", 32],
      ["Default window", 44],
      ["Large window", 48],
    ] as const) {
      const root = canvas.getByText(name).closest<HTMLElement>(".hashti-field")!;
      await expect(root.getBoundingClientRect().height).toBeGreaterThanOrEqual(minimum);
    }
  },
};

export const Granularity: Story = {
  render: () => (
    <div className="field-story-stack">
      <TimeField label="Hour only" granularity="hour" defaultValue={parseTime("09:00")} />
      <TimeField label="Minute precision" granularity="minute" defaultValue={parseTime("09:30")} />
      <TimeField
        label="Second precision"
        granularity="second"
        defaultValue={parseTime("09:30:15")}
      />
      <TimeField label="24-hour cycle" hourCycle={24} defaultValue={parseTime("17:45")} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const seconds = canvas.getByText("Second precision").closest<HTMLElement>(".hashti-field")!;
    await expect(seconds.querySelectorAll('[role="spinbutton"]')).toHaveLength(4);
  },
};

function ControlledTime({ label, cycle = 12 }: { label: string; cycle?: 12 | 24 }) {
  const [time, setTime] = useState<TimeValue | null>(() => parseTime("14:30"));
  return (
    <div className="field-story-stack">
      <TimeField
        label={label}
        description="Arrow keys step each segment."
        hourCycle={cycle}
        value={time}
        onChange={setTime}
      />
      <output aria-label={`${label} value`}>{format(time)}</output>
    </div>
  );
}

export const KeyboardAndValue: Story = {
  render: () => <ControlledTime label="Controlled window" cycle={24} />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByRole("status", { name: "Controlled window value" });
    const hour = canvas.getAllByRole<HTMLElement>("spinbutton")[0]!;
    await userEvent.click(hour);
    await userEvent.keyboard("{ArrowUp}");
    await expect(output).toHaveTextContent("15:30");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await expect(output).toHaveTextContent("13:30");
  },
};

function LocalizedTime() {
  const { theme } = useTheme();
  return (
    <div className="field-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <TimeField
          label="ساعت شروع انتشار"
          description="زمان را بر اساس منطقهٔ زمانی محلی وارد کنید."
          isRequired
          defaultValue={parseTime("08:15")}
        />
      </Theme>
      <Theme theme={theme} locale="ar">
        <TimeField
          label="وقت بدء النشر"
          description="أدخل الوقت حسب منطقتك الزمنية المحلية."
          isInvalid
          errorMessage="اختر وقتًا داخل ساعات العمل."
        />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = {
  render: () => <LocalizedTime />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("ساعت شروع انتشار")).toBeVisible();
    await expect(canvas.getByText("اختر وقتًا داخل ساعات العمل.")).toBeVisible();
  },
};
