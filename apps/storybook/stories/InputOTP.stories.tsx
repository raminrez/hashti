import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { InputOTP } from "@hashti/react";
import "./fields.css";

const handleComplete = fn();

const meta = {
  title: "Fields/InputOTP",
  component: InputOTP,
  tags: ["a11y:gap"],
  parameters: {
    docs: {
      description: {
        component:
          "InputOTP manages segmented PIN/verification code input with digit jumping, backspace navigation, paste distribution, and completion callback.",
      },
    },
  },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

function InputOTPDemo() {
  const [val, setVal] = useState("");
  return (
    <div className="field-story-stack">
      <InputOTP
        length={6}
        value={val}
        onChange={setVal}
        onComplete={(code) => {
          handleComplete(code);
        }}
        aria-label="Verification pin"
      />
      <output>Entered code: {val}</output>
    </div>
  );
}

export const Playground: Story = {
  render: () => <InputOTPDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);

    const first = inputs[0];
    if (first) {
      await userEvent.type(first, "123456");
    }
    expect(canvas.getByText("Entered code: 123456")).toBeInTheDocument();
  },
};

export const FourDigits: Story = {
  render: () => (
    <div className="field-story-stack">
      <InputOTP length={4} aria-label="4-digit security code" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("textbox")).toHaveLength(4);
  },
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="field-story-stack">
      <InputOTP length={6} aria-label="کد تایید ورود" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("textbox")).toHaveLength(6);
  },
};
