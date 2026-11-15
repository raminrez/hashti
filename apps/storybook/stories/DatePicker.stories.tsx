import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { parseDate, parseTime, type DateValue } from "@internationalized/date";
import {
  DatePicker,
  DateRangePicker,
  Calendar,
  RangeCalendar,
  DateField,
  TimeField,
  Theme,
  useTheme,
  type DateRange as RACDateRange,
  type TimeValue,
} from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Fields/DatePicker",
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          "DatePicker and DateRangePicker let users enter dates via typed input segments or select days from an accessible popover calendar with full keyboard navigation and internationalization support.",
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(() => parseDate("2026-11-09"));

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h3 className="feedback-card-title">Deployment Scheduling</h3>
          <p className="feedback-card-description">
            Choose a target release cut-off date for automated deployment.
          </p>
        </div>
        <DatePicker
          label="Release cut-off date"
          description="Build will trigger at midnight UTC on the chosen date."
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Release cut-off date")).toBeInTheDocument();

    const calTrigger = canvas.getByRole("button", { name: /Calendar/ });
    expect(calTrigger).toBeInTheDocument();
    await userEvent.click(calTrigger);

    const dialog = await within(document.body).findByRole("dialog", { name: "Choose a date" });
    expect(dialog).toBeInTheDocument();

    // Select the 15th
    const day15 = within(dialog).getByRole("button", { name: /15/ });
    expect(day15).toBeInTheDocument();
    await userEvent.click(day15);
  },
};

function DateRangeExample() {
  const [range, setRange] = useState<RACDateRange | null>(() => ({
    start: parseDate("2026-11-01"),
    end: parseDate("2026-11-14"),
  }));

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Telemetry Retention Window</h4>
          <p className="feedback-card-description">
            Select start and end dates to export aggregated performance audit logs.
          </p>
        </div>
        <DateRangePicker
          label="Log extraction interval"
          description="Interval cannot exceed 30 consecutive calendar days."
          value={range}
          onChange={setRange}
        />
      </div>
    </div>
  );
}

export const DateRange: Story = {
  render: () => <DateRangeExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Log extraction interval")).toBeInTheDocument();

    const calTrigger = canvas.getByRole("button", { name: /Calendar/ });
    expect(calTrigger).toBeInTheDocument();
    await userEvent.click(calTrigger);

    const dialog = await within(document.body).findByRole("dialog", {
      name: "Choose a date range",
    });
    expect(dialog).toBeInTheDocument();
  },
};

function StandaloneCalendarExample() {
  const [date, setDate] = useState<DateValue>(() => parseDate("2026-11-10"));

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <div className="feedback-card-title" style={{ fontWeight: 600 }}>
            Embedded Standalone Calendar
          </div>
          <p className="feedback-card-description">Directly rendered in-page calendar widget.</p>
        </div>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <div
              style={{
                fontWeight: 600,
                margin: "0 0 0.5rem",
                fontSize: "0.875rem",
                color: "var(--hashti-text-secondary)",
              }}
            >
              Single Day Selection
            </div>
            <Calendar aria-label="Target deployment date" value={date} onChange={setDate} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                margin: "0 0 0.5rem",
                fontSize: "0.875rem",
                color: "var(--hashti-text-secondary)",
              }}
            >
              Range Selection Calendar
            </div>
            <RangeCalendar
              aria-label="Maintenance outage window"
              defaultValue={{
                start: parseDate("2026-11-12"),
                end: parseDate("2026-11-16"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const StandaloneCalendar: Story = {
  render: () => <StandaloneCalendarExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Single Day Selection")).toBeInTheDocument();
    expect(canvas.getByText("Range Selection Calendar")).toBeInTheDocument();

    const grids = canvas.getAllByRole("grid");
    expect(grids.length).toBe(2);
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();
  const [faDate, setFaDate] = useState<DateValue | null>(() => parseDate("2026-11-09"));

  return (
    <div className="feedback-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="feedback-card">
          <div>
            <h4 className="feedback-card-title">انتخاب تاریخ گزارش‌گیری</h4>
            <p className="feedback-card-description">
              تقویم و فیلد تاریخ در محیط راست‌به‌چپ با زبان فارسی
            </p>
          </div>
          <DatePicker
            label="تاریخ تسویه حساب مالی"
            description="عملیات واریز در پایان این تاریخ پردازش خواهد شد."
            value={faDate}
            onChange={setFaDate}
          />
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("انتخاب تاریخ گزارش‌گیری")).toBeInTheDocument();
    expect(canvas.getByText("تاریخ تسویه حساب مالی")).toBeInTheDocument();

    const calTrigger = canvas.getByRole("button", { name: /Calendar/ });
    expect(calTrigger).toBeInTheDocument();
  },
};

function DateAndFieldsExample() {
  const [date, setDate] = useState<DateValue | null>(() => parseDate("2026-11-09"));
  const [time, setTime] = useState<TimeValue | null>(() => parseTime("14:30"));

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h3 className="feedback-card-title">Direct Segment Date and Time Fields</h3>
          <p className="feedback-card-description">
            Accessible typed input segments with arrow-key incrementation and numeric typing.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
            gap: "1.5rem",
          }}
        >
          <DateField
            label="Direct Date Field"
            description="Type MM/DD/YYYY or use arrow keys."
            value={date}
            onChange={setDate}
          />
          <TimeField
            label="Direct Time Field"
            description="Type HH:MM AM/PM or use arrow keys."
            value={time}
            onChange={setTime}
          />
        </div>
      </div>
    </div>
  );
}

export const DateAndTimeFields: Story = {
  render: () => <DateAndFieldsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Direct Date Field")).toBeInTheDocument();
    expect(canvas.getByText("Direct Time Field")).toBeInTheDocument();
  },
};
