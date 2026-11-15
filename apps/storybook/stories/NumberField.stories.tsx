import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Button, Form, Icon, NumberField, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/NumberField",
  component: NumberField,
  args: {
    label: "Reviewers",
    description: "Choose how many people will review this draft.",
    defaultValue: 3,
    minValue: 1,
    maxValue: 12,
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    minValue: { control: "number" },
    maxValue: { control: "number" },
    step: { control: "number" },
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
          "NumberField.Root retains RAC's numeric value, validation, and children contracts. Compose Label, Description, Control, Input, Button, Help, and ErrorMessage independently. The enclosing Control owns the control hook; Input keeps RAC's input props and ref. Step values start at minValue, onChange commits after editing, and name submits the raw number rather than its localized display string.",
      },
    },
  },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="field-story-stack">
      <NumberField {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <NumberField
        label="Editable reviewer count"
        description="Choose between one and twelve reviewers."
        defaultValue={3}
        minValue={1}
        maxValue={12}
      />
      <NumberField
        label="Reviewer count requiring correction"
        description="Choose between one and twelve reviewers."
        isRequired
        isInvalid
        errorMessage="Enter the number of reviewers."
        minValue={1}
        maxValue={12}
      />
      <NumberField
        label="Read-only reviewer count"
        description="You can select and copy this count."
        defaultValue={3}
        isReadOnly
      />
      <NumberField
        label="Unavailable reviewer count"
        description="The archived review cannot be changed."
        defaultValue={3}
        isDisabled
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const readonly = canvas.getByRole<HTMLInputElement>("textbox", {
      name: "Read-only reviewer count",
    });
    await expect(canvas.getByText("Enter the number of reviewers.")).toBeVisible();
    await expect(readonly).toHaveAttribute("readonly");
    await expect(
      canvas.getByRole("textbox", { name: "Unavailable reviewer count" }),
    ).toBeDisabled();
    await userEvent.click(readonly);
    await userEvent.keyboard("{Control>}a{/Control}");
    // The Clipboard API is not available to the test runner; assert the selection instead.
    await expect(readonly.selectionStart).toBe(0);
    await expect(readonly.selectionEnd).toBe(readonly.value.length);
    await userEvent.keyboard("9{ArrowUp}");
    await expect(readonly).toHaveValue("3");
    await expect(readonly).toHaveFocus();
    for (const button of within(readonly.closest<HTMLElement>(".hashti-field")!).getAllByRole(
      "button",
    )) {
      await expect(button).toBeDisabled();
    }
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <NumberField label="Small reviewer count" size="sm" defaultValue={3} />
      <NumberField label="Default reviewer count" defaultValue={3} />
      <NumberField label="Large reviewer count" size="lg" defaultValue={3} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [name, minimum] of [
      ["Small reviewer count", 32],
      ["Default reviewer count", 44],
      ["Large reviewer count", 48],
    ] as const) {
      const group = canvas
        .getByRole("textbox", { name })
        .closest<HTMLElement>(".hashti-input-group")!;
      await expect(group.getBoundingClientRect().height).toBeGreaterThanOrEqual(minimum);
      for (const button of within(group).getAllByRole("button")) {
        // Embedded targets fit inside the group's one-pixel boundary on each side.
        await expect(button.getBoundingClientRect().width).toBeGreaterThanOrEqual(minimum - 2);
        await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(minimum - 2);
      }
    }
  },
};

export const BoundsAndStep: Story = {
  render: () => (
    <div className="field-story-stack">
      <NumberField
        label="Reviewers in groups of three"
        description="Start at two reviewers, then add three at a time: 2, 5, 8, or 11."
        minValue={2}
        maxValue={11}
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
    await userEvent.keyboard("{ArrowUp}");
    await expect(input).toHaveValue("5");
  },
};

function ValueExamples() {
  const [reviewers, setReviewers] = useState(3);
  return (
    <div className="field-story-stack">
      <NumberField
        label="Controlled reviewers"
        description="The application receives the committed number."
        value={reviewers}
        onChange={setReviewers}
        minValue={1}
        maxValue={12}
      />
      <output aria-label="Committed reviewers">
        {Number.isNaN(reviewers) ? "No value" : reviewers}
      </output>
      <NumberField
        label="Uncontrolled reviewers"
        description="RAC owns this value until submission."
        defaultValue={5}
        minValue={1}
        maxValue={12}
      />
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: ValueExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const controlled = canvas.getByRole("textbox", { name: "Controlled reviewers" });
    const uncontrolled = canvas.getByRole("textbox", { name: "Uncontrolled reviewers" });
    await userEvent.clear(controlled);
    await userEvent.type(controlled, "7");
    await userEvent.tab();
    await expect(canvas.getByRole("status", { name: "Committed reviewers" })).toHaveTextContent(
      "7",
    );
    await userEvent.click(uncontrolled);
    await userEvent.keyboard("{ArrowUp}");
    await expect(uncontrolled).toHaveValue("6");
    await expect(controlled).toHaveValue("7");
  },
};

function ComposedNumbers() {
  const input = useRef<HTMLInputElement>(null);
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
      <p>
        Display formatting is local. FormData contains the raw numbers, not currency symbols or
        percentages.
      </p>
      <NumberField.Root
        name="budget"
        defaultValue={1234.5}
        minValue={0}
        step={0.5}
        formatOptions={{ style: "currency", currency: "USD" }}
      >
        <NumberField.Label>Estimated review budget</NumberField.Label>
        <NumberField.Description>
          Use the estimate for this fictional review.
        </NumberField.Description>
        <NumberField.Control>
          <NumberField.Button slot="decrement" aria-label="Reduce estimate">
            <Icon name="minus" />
          </NumberField.Button>
          <NumberField.Input ref={input} />
          <NumberField.Button slot="increment" aria-label="Increase estimate">
            <Icon name="plus" />
          </NumberField.Button>
        </NumberField.Control>
        <NumberField.Help>
          <NumberField.ErrorMessage />
        </NumberField.Help>
      </NumberField.Root>
      <NumberField
        label="Review allocation"
        description="The display is a percentage; its submitted value is a fraction."
        name="ratio"
        defaultValue={0.25}
        minValue={0}
        maxValue={1}
        step={0.01}
        formatOptions={{ style: "percent" }}
      />
      <Button type="submit">Read number values</Button>
      <Button variant="ghost" onPress={() => input.current?.focus()}>
        Focus estimate
      </Button>
      <output aria-label="Raw number values">{saved}</output>
    </Form>
  );
}

export const CompositionAndFormData: Story = {
  render: ComposedNumbers,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const budget = canvas.getByRole("textbox", { name: "Estimated review budget" });
    await expect(budget).toHaveValue("$1,234.50");
    await expect(canvas.getByRole("textbox", { name: "Review allocation" })).toHaveValue("25%");
    await userEvent.click(canvas.getByRole("button", { name: "Read number values" }));
    await expect(canvas.getByRole("status", { name: "Raw number values" })).toHaveTextContent(
      "budget:1234.5; ratio:0.25",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Increase estimate Estimated review budget" }),
    );
    await expect(budget).toHaveValue("$1,235.00");
    await userEvent.click(canvas.getByRole("button", { name: "Read number values" }));
    await expect(canvas.getByRole("status", { name: "Raw number values" })).toHaveTextContent(
      "budget:1235; ratio:0.25",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Focus estimate" }));
    await expect(budget).toHaveFocus();
  },
};

export const LongContent: Story = {
  render: () => (
    <div className="field-story-stack field-story-narrow">
      <NumberField
        label="Number of reviewers for the shared release and owner handoff"
        description="Choose the number of people who can complete this review. Keep the review schedule in mind before adding more reviewers."
        minValue={1}
        maxValue={12}
        isRequired
        isInvalid
        errorMessage="Enter a reviewer count between one and twelve. The other draft values stay here while you check who is available for the handoff review."
      />
    </div>
  ),
};

function LocalizedNumbers() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} locale="fa-IR">
        <NumberField
          label="تعداد مرورکننده‌ها"
          description={
            <>
              برای پروژهٔ <bdi dir="ltr">WS-1042</bdi> عددی بین ۲ تا ۱۱ وارد کنید.
            </>
          }
          defaultValue={5}
          minValue={2}
          maxValue={11}
          step={3}
        />
      </Theme>
      <Theme theme={theme} locale="ar-EG">
        <NumberField
          label="عدد المراجعين"
          description={
            <>
              أدخل عددًا بين ٢ و١١ للمشروع <bdi dir="ltr">WS-1042</bdi>.
            </>
          }
          defaultValue={5}
          minValue={2}
          maxValue={11}
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
