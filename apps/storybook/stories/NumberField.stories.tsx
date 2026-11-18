import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Button, Form, NumberInput, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/NumberInput",
  component: NumberInput,
  args: {
    label: "Reviewers",
    description: "Choose how many people will review this draft.",
    defaultValue: 3,
    min: 1,
    max: 12,
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
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
          "A numeric field built on ui-sdk NumberInput inside the field anatomy, with increment/decrement steppers. Steps start at min; Enter or blur commits the value; name submits the raw number rather than its localized display string.",
      },
    },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <NumberInput {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <NumberInput
        label="Editable reviewer count"
        description="Choose between one and twelve reviewers."
        defaultValue={3}
        min={1}
        max={12}
      />
      <NumberInput
        label="Reviewer count requiring correction"
        description="Choose between one and twelve reviewers."
        required
        invalid
        errorMessage="Enter the number of reviewers."
        min={1}
        max={12}
      />
      <NumberInput
        label="Read-only reviewer count"
        description="You can select and copy this count."
        defaultValue={3}
        readOnly
      />
      <NumberInput
        label="Unavailable reviewer count"
        description="The archived review cannot be changed."
        defaultValue={3}
        disabled
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Enter the number of reviewers.")).toBeVisible();
    await expect(
      canvas.getByRole("textbox", { name: "Read-only reviewer count" }),
    ).toHaveAttribute("readonly");
    await expect(
      canvas.getByRole("textbox", { name: "Unavailable reviewer count" }),
    ).toBeDisabled();
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <NumberInput label="Small reviewer count" size="sm" defaultValue={3} />
      <NumberInput label="Default reviewer count" defaultValue={3} />
      <NumberInput label="Large reviewer count" size="lg" defaultValue={3} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of [
      "Small reviewer count",
      "Default reviewer count",
      "Large reviewer count",
    ]) {
      await expect(canvas.getByRole("textbox", { name })).toBeVisible();
    }
  },
};

export const BoundsAndStep: Story = {
  render: () => (
    <div className="field-story-stack">
      <NumberInput
        label="Reviewers in groups of three"
        description="Start at two reviewers, then add three at a time: 2, 5, 8, or 11."
        min={2}
        max={11}
        step={3}
        defaultValue={5}
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Reviewers in groups of three" });
    const increase = canvas.getByRole("button", { name: /increase/i });
    const decrease = canvas.getByRole("button", { name: /decrease/i });
    await userEvent.click(increase);
    await expect(input).toHaveValue("8");
    await userEvent.click(input);
    await userEvent.keyboard("{End}{ArrowUp}");
    await expect(input).toHaveValue("11");
    await expect(increase).toBeDisabled();
    await userEvent.keyboard("{Home}{ArrowDown}");
    await expect(input).toHaveValue("2");
    await expect(decrease).toBeDisabled();
  },
};

function ValueExamples() {
  const [reviewers, setReviewers] = useState(3);
  return (
    <div className="field-story-stack">
      <NumberInput
        label="Controlled reviewers"
        description="The application receives the committed number."
        value={reviewers}
        onValueChange={(value) => setReviewers(value ?? 0)}
        min={1}
        max={12}
      />
      <output aria-label="Committed reviewers">{reviewers}</output>
      <NumberInput
        label="Uncontrolled reviewers"
        description="ui-sdk owns this value until submission."
        defaultValue={5}
        min={1}
        max={12}
      />
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: ValueExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const uncontrolled = canvas.getByRole("textbox", { name: "Uncontrolled reviewers" });
    await userEvent.click(uncontrolled);
    await userEvent.keyboard("{ArrowUp}");
    await expect(uncontrolled).toHaveValue("6");
  },
};

function FormattedNumbers() {
  const [saved, setSaved] = useState("");
  return (
    <Form
      aria-label="Formatted number values"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setSaved(`budget:${values.get("budget")}; ratio:${values.get("ratio")}`);
      }}
    >
      <NumberInput
        label="Estimated review budget"
        description="Use the estimate for this fictional review."
        name="budget"
        defaultValue={1234.5}
        min={0}
        step={0.5}
        format={{ style: "currency", currency: "USD" }}
      />
      <NumberInput
        label="Review allocation"
        description="The display is a percentage; its submitted value is a fraction."
        name="ratio"
        defaultValue={0.25}
        min={0}
        max={1}
        step={0.01}
        format={{ style: "percent" }}
      />
      <Button type="submit">Read number values</Button>
      <output aria-label="Raw number values">{saved}</output>
    </Form>
  );
}

export const FormattingAndFormData: Story = {
  render: FormattedNumbers,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("textbox", { name: "Estimated review budget" })).toHaveValue(
      "$1,234.50",
    );
    await expect(canvas.getByRole("textbox", { name: "Review allocation" })).toHaveValue("25%");
    await userEvent.click(canvas.getByRole("button", { name: "Read number values" }));
    await expect(canvas.getByRole("status", { name: "Raw number values" })).toHaveTextContent(
      "budget:1234.5; ratio:0.25",
    );
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <NumberInput
        label="Number of reviewers for the shared release and owner handoff"
        description="Choose the number of people who can complete this review."
        min={1}
        max={12}
        required
        invalid
        errorMessage="Enter a reviewer count between one and twelve."
      />
    </div>
  ),
};

function LocalizedNumbers() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <NumberInput
          label="تعداد مرورکننده‌ها"
          description="عددی بین ۲ تا ۱۱ وارد کنید."
          defaultValue={5}
          min={2}
          max={11}
          step={3}
        />
      </Theme>
      <Theme theme={theme} lang="ar-EG" dir="rtl">
        <NumberInput
          label="عدد المراجعين"
          description="أدخل عددًا بين ٢ و١١."
          defaultValue={5}
          min={2}
          max={11}
          step={3}
        />
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = {
  render: LocalizedNumbers,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("textbox", { name: "تعداد مرورکننده‌ها" })).toHaveValue(
      new Intl.NumberFormat("fa-IR").format(5),
    );
    await expect(canvas.getByRole("textbox", { name: "عدد المراجعين" })).toHaveValue(
      new Intl.NumberFormat("ar-EG").format(5),
    );
  },
};
