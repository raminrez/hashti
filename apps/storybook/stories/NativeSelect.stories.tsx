import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { NativeSelect, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/NativeSelect",
  component: NativeSelect,
  tags: ["a11y:gap"],
  parameters: {
    docs: {
      description: {
        component:
          "NativeSelect renders a native browser `<select>` control styled to match the design system. Ideal for lightweight forms, mobile sheets, and pagination page-size selectors.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function PlaygroundExample() {
  const [val, setVal] = useState("10");
  return (
    <div className="field-story-stack">
      <div style={{ color: "var(--hashti-text-secondary)" }}>
        Current page size: <strong>{val}</strong>
      </div>
      <NativeSelect
        label="Items per page"
        description="Choose how many records are displayed per table page."
        value={val}
        onChange={(e) => setVal(e.target.value)}
      >
        <option value="10">10 items</option>
        <option value="25">25 items</option>
        <option value="50">50 items</option>
        <option value="100">100 items</option>
      </NativeSelect>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const select = canvas.getByRole("combobox", { name: "Items per page" });
    expect(select).toHaveValue("10");

    await userEvent.selectOptions(select, "50");
    expect(select).toHaveValue("50");
    await waitFor(() => expect(canvas.getByText("50")).toBeVisible());
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="field-story-stack">
      <NativeSelect size="sm" label="Small (sm) select" defaultValue="sm-opt">
        <option value="sm-opt">Compact density (32px)</option>
        <option value="sm-opt-2">Secondary option</option>
      </NativeSelect>

      <NativeSelect size="md" label="Medium (md - default) select" defaultValue="md-opt">
        <option value="md-opt">Default density (40px)</option>
        <option value="md-opt-2">Secondary option</option>
      </NativeSelect>

      <NativeSelect size="lg" label="Large (lg) select" defaultValue="lg-opt">
        <option value="lg-opt">Spacious density (48px)</option>
        <option value="lg-opt-2">Secondary option</option>
      </NativeSelect>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const sm = canvas.getByRole("combobox", { name: "Small (sm) select" });
    const md = canvas.getByRole("combobox", { name: "Medium (md - default) select" });
    const lg = canvas.getByRole("combobox", { name: "Large (lg) select" });

    expect(sm).toHaveValue("sm-opt");
    expect(md).toHaveValue("md-opt");
    expect(lg).toHaveValue("lg-opt");
  },
};

export const OptGroupsAndDisabled: Story = {
  render: () => (
    <div className="field-story-stack">
      <NativeSelect label="Region & Zone" defaultValue="us-east-1a">
        <optgroup label="United States">
          <option value="us-east-1a">US East (N. Virginia)</option>
          <option value="us-west-2b">US West (Oregon)</option>
        </optgroup>
        <optgroup label="Europe">
          <option value="eu-west-1c">Europe (Ireland)</option>
          <option value="eu-central-1a">Europe (Frankfurt)</option>
        </optgroup>
      </NativeSelect>

      <NativeSelect label="Locked datacenter" disabled defaultValue="locked">
        <option value="locked">Government Isolated Region (Classified)</option>
      </NativeSelect>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const regionSelect = canvas.getByRole("combobox", { name: "Region & Zone" });
    await userEvent.selectOptions(regionSelect, "eu-central-1a");
    expect(regionSelect).toHaveValue("eu-central-1a");

    const lockedSelect = canvas.getByRole("combobox", { name: "Locked datacenter" });
    expect(lockedSelect).toBeDisabled();
  },
};

export const Validation: Story = {
  render: () => (
    <div className="field-story-stack">
      <NativeSelect
        label="Required deployment target"
        errorMessage="Please select a cluster before deploying."
        defaultValue=""
      >
        <option value="" disabled>
          Select a cluster...
        </option>
        <option value="prod">Production</option>
        <option value="stage">Staging</option>
      </NativeSelect>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const select = canvas.getByRole("combobox", { name: "Required deployment target" });
    expect(select).toHaveAttribute("aria-invalid", "true");
    await waitFor(() =>
      expect(canvas.getByText("Please select a cluster before deploying.")).toBeVisible(),
    );
  },
};

function LocalizedNativeSelect() {
  const { theme } = useTheme();
  return (
    <div className="field-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <NativeSelect
            label="واحد پولی پرداخت"
            description="واحد ارزی مورد نظر برای صورتحساب دوره‌ای را مشخص نمایید."
            defaultValue="irr"
          >
            <option value="irr">ریال ایران (IRR)</option>
            <option value="eur">یورو اتحادیه اروپا (EUR)</option>
            <option value="usd">دلار آمریکا (USD)</option>
          </NativeSelect>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedNativeSelect />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const select = canvas.getByRole("combobox", { name: "واحد پولی پرداخت" });
    expect(select).toHaveValue("irr");

    await userEvent.selectOptions(select, "eur");
    expect(select).toHaveValue("eur");
  },
};
