import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Theme, TimeInput, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/TimeInput",
  component: TimeInput,
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
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "TimeInput wraps ui-sdk time-input and renders the field anatomy: label, persistent guidance, segmented control, attached recovery. The value is a 24-hour string like \"14:30\". Segments answer to arrow keys, numeric typing and the locale's time cycle.",
      },
    },
  },
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <TimeInput {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <TimeInput label="Editable window" description="Local zone." defaultValue="09:30" />
      <TimeInput
        label="Window requiring correction"
        description="Use a time inside business hours."
        invalid
        errorMessage="Choose a time between 08:00 and 18:00."
      />
      <TimeInput
        label="Read-only window"
        description="You can select and copy this value."
        defaultValue="14:30"
        readOnly
      />
      <TimeInput
        label="Unavailable window"
        description="Owners manage the release schedule."
        defaultValue="11:00"
        disabled
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

export const Granularity: Story = {
  render: () => (
    <div className="field-story-stack">
      <TimeInput label="Hour only" granularity="hour" defaultValue="09:00" />
      <TimeInput label="Minute precision" granularity="minute" defaultValue="09:30" />
      <TimeInput label="Second precision" granularity="second" defaultValue="09:30:15" />
      <TimeInput label="24-hour cycle" hourCycle={24} defaultValue="17:45" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const seconds = canvas.getByText("Second precision").closest<HTMLElement>(".hashti-field")!;
    await expect(seconds.querySelectorAll('[data-slot="time-input-segment"]')).not.toHaveLength(0);
  },
};

function ControlledTime() {
  const [time, setTime] = useState<string | null>("14:30");
  return (
    <div className="field-story-stack">
      <TimeInput
        label="Controlled window"
        description="Arrow keys step each segment."
        hourCycle={24}
        value={time}
        onValueChange={setTime}
      />
      <output aria-label="Controlled window value">{time}</output>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledTime />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("status", { name: "Controlled window value" }),
    ).toHaveTextContent("14:30");
  },
};

function LocalizedTime() {
  const { theme } = useTheme();
  return (
    <div className="field-story-stack">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <TimeInput
          label="ساعت شروع انتشار"
          description="زمان را بر اساس منطقهٔ زمانی محلی وارد کنید."
          required
          defaultValue="08:15"
        />
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl">
        <TimeInput
          label="وقت بدء النشر"
          description="أدخل الوقت حسب منطقتك الزمنية المحلية."
          invalid
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
