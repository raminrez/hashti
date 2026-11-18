import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { OtpInput } from "@hashti/react";
import "./fields.css";

const handleComplete = fn();

const meta = {
  title: "Fields/OtpInput",
  component: OtpInput,
  parameters: {
    docs: {
      description: {
        component:
          "OtpInput wraps ui-sdk otp-input: one value spread across slots, with digit navigation, paste distribution, and an onValueCommit callback when every slot is filled.",
      },
    },
  },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function OtpDemo() {
  const [val, setVal] = useState("");
  return (
    <div className="field-story-stack">
      <OtpInput
        label="Verification pin"
        length={6}
        value={val}
        onValueChange={setVal}
        onValueCommit={(code) => {
          handleComplete(code);
        }}
      />
      <output aria-label="Entered code">Entered code: {val}</output>
    </div>
  );
}

export const Playground: Story = {
  render: () => <OtpDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Verification pin" });
    await userEvent.type(input, "123456");
    await expect(canvas.getByText("Entered code: 123456")).toBeInTheDocument();
  },
};

export const FourDigits: Story = {
  render: () => (
    <div className="field-story-stack">
      <OtpInput label="4-digit security code" length={4} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("textbox", { name: "4-digit security code" })).toBeInTheDocument();
  },
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="field-story-stack">
      <OtpInput label="کد تایید ورود" length={6} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("textbox", { name: "کد تایید ورود" })).toBeInTheDocument();
  },
};
