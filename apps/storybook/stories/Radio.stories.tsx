import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Radio, RadioGroup, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Radio",
  component: RadioGroup,
  args: {
    label: "Delivery schedule",
    description: "Choose when review updates arrive.",
    defaultValue: "immediate",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: false },
    value: { control: "select", options: ["immediate", "daily"] },
    defaultValue: { control: "select", options: ["immediate", "daily"] },
    name: { control: "text" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Radio requires a string value and belongs inside RadioGroup. Selection, read-only, required, and recovery state belong to the group; individual options can be disabled. There is no mixed state. The default group provides persistent guidance and detached group recovery. Root, Label, Description, Options, Radio, Help, ErrorMessage, and Status remain composable. ui-sdk owns native inputs and roving focus: Space selects; arrow keys move and select, skipping disabled options and respecting horizontal locale direction. Root refs target the group div, Radio refs its button control, and each radio pairs with a visually hidden native input that submits. Render-prop content must keep the part's props intact.",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onValueChange: fn() },
  render: (args) => (
    <div className="field-story-stack">
      <RadioGroup {...args}>
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <RadioGroup
        label="Editable delivery"
        description="Choose one schedule for this review."
        defaultValue="immediate"
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
      <RadioGroup
        label="Delivery requiring correction"
        description="Choose one schedule for this review."
        required
        status={{
          type: "error",
          message: "Choose a delivery schedule.",
        }}
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
      <RadioGroup
        label="Read-only delivery"
        description="The review owner chose this schedule."
        defaultValue="immediate"
        readOnly
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
      <RadioGroup
        label="Unavailable delivery"
        description="Archived reviews cannot change delivery."
        defaultValue="daily"
        disabled
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const invalid = canvas.getByRole("radiogroup", {
      name: "Delivery requiring correction (required)",
    });
    await expect(invalid).toHaveAttribute("data-required");
    await expect(invalid).toHaveAttribute("data-hashti-status", "error");
    await expect(invalid).toHaveAccessibleDescription(
      "Choose one schedule for this review. Choose a delivery schedule.",
    );
    await expect(within(invalid).getByText("Choose one schedule for this review.")).toBeVisible();
    await expect(within(invalid).getByText("Choose a delivery schedule.")).toBeVisible();

    const readonly = canvas.getByRole("radiogroup", { name: "Read-only delivery" });
    const selected = within(readonly).getByRole("radio", {
      name: "Immediate updates",
    });
    const unselected = within(readonly).getByRole("radio", {
      name: "Daily summary",
    });
    await expect(readonly).toHaveAttribute("data-readonly");
    for (const option of [selected, unselected]) {
      await expect(option).not.toBeDisabled();
      await userEvent.click(option);
      await expect(selected).toBeChecked();
      await expect(unselected).not.toBeChecked();
    }
    const disabled = within(canvas.getByRole("radiogroup", { name: "Unavailable delivery" }));
    for (const option of disabled.getAllByRole("radio")) {
      await expect(option).toBeDisabled();
    }
    await expect(disabled.getByRole("radio", { name: "Immediate updates" })).not.toBeChecked();
    await expect(disabled.getByRole("radio", { name: "Daily summary" })).toBeChecked();
  },
};

function ValueExamples() {
  const [delivery, setDelivery] = useState("immediate");
  return (
    <div className="field-story-stack">
      <RadioGroup
        label="Controlled delivery"
        description="The application owns the selected string value."
        value={delivery}
        onValueChange={(value) => setDelivery(value ?? "immediate")}
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
      <output aria-label="Controlled delivery value">{delivery}</output>
      <RadioGroup
        label="Uncontrolled delivery"
        description="ui-sdk owns this selection until submission."
        defaultValue="daily"
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: ValueExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const controlled = within(canvas.getByRole("radiogroup", { name: "Controlled delivery" }));
    const uncontrolled = within(canvas.getByRole("radiogroup", { name: "Uncontrolled delivery" }));
    await userEvent.click(controlled.getByRole("radio", { name: "Daily summary" }));
    await expect(
      canvas.getByRole("status", { name: "Controlled delivery value" }),
    ).toHaveTextContent("daily");
    await expect(controlled.getByRole("radio", { name: "Immediate updates" })).not.toBeChecked();
    await userEvent.click(uncontrolled.getByRole("radio", { name: "Immediate updates" }));
    await expect(uncontrolled.getByRole("radio", { name: "Immediate updates" })).toBeChecked();
    await expect(uncontrolled.getByRole("radio", { name: "Daily summary" })).not.toBeChecked();
    await expect(controlled.getByRole("radio", { name: "Daily summary" })).toBeChecked();
  },
};

function ComposedDelivery() {
  const root = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const [submitted, setSubmitted] = useState("");
  const [refs, setRefs] = useState("");
  return (
    <form
      aria-label="Delivery form"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(JSON.stringify(Array.from(new FormData(event.currentTarget).entries())));
      }}
      onReset={() => {
        setSubmitted("");
      }}
    >
      <p>
        Read the native values without saving or resetting the draft. The group keeps its own
        heading; ui-sdk's hidden radio inputs submit the checked value under the group's name.
      </p>
      <RadioGroup.Root
        ref={root}
        name="delivery"
        aria-labelledby="delivery-heading"
        render={(props) => <div {...props} data-composed-root="true" />}
      >
        <h2 id="delivery-heading">Delivery schedule</h2>
        <p>Choose when review updates arrive. This form only reads the current draft.</p>
        <RadioGroup.Options>
          <RadioGroup.Radio
            ref={control}
            value="immediate"
            className={(state) => (state.checked ? "selected-delivery" : "delivery-option")}
            style={(state) => ({ fontWeight: state.checked ? 600 : 400 })}
          >
            {(state) => (
              <>
                Immediate updates <span aria-hidden="true">{state.checked ? "(selected)" : ""}</span>
              </>
            )}
          </RadioGroup.Radio>
          <RadioGroup.Radio value="daily">Daily summary</RadioGroup.Radio>
        </RadioGroup.Options>
      </RadioGroup.Root>
      <button type="submit">Read delivery values</button>
      <button
        type="button"
        onClick={() => {
          setRefs(`${root.current?.tagName}/${control.current?.tagName}`);
          control.current?.focus();
        }}
      >
        Focus immediate updates
      </button>
      <button type="reset">Reset delivery</button>
      <output aria-label="Delivery FormData">{submitted}</output>
      <output aria-label="Control refs">{refs}</output>
    </form>
  );
}

export const CompositionAndFormData: Story = {
  render: ComposedDelivery,
  parameters: {
    docs: {
      description: {
        story:
          "The composed group keeps its own root, heading, and state-function class names and styles. ui-sdk pairs every radio with a visually hidden native input, so FormData holds one entry for the checked value. The focus action inspects the div and control refs and focuses the radio control. Reset returns the group to its uncontrolled default.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("radiogroup", { name: "Delivery schedule" });
    const immediate = within(group).getByRole("radio", { name: "Immediate updates" });
    const daily = within(group).getByRole("radio", { name: "Daily summary" });
    const submit = canvas.getByRole("button", { name: "Read delivery values" });
    const output = canvas.getByRole("status", { name: "Delivery FormData" });
    await expect(group).toHaveAttribute("data-composed-root", "true");
    await expect(group).toHaveClass("hashti-field", "hashti-radio-group");
    await userEvent.click(canvas.getByRole("button", { name: "Focus immediate updates" }));
    await expect(immediate).toHaveFocus();
    await expect(canvas.getByRole("status", { name: "Control refs" })).toHaveTextContent(
      "DIV/BUTTON",
    );
    await userEvent.keyboard(" ");
    await expect(immediate).toBeChecked();
    await expect(immediate).toHaveClass("hashti-radio", "selected-delivery");
    await expect(immediate).toHaveStyle({ fontWeight: 600 });
    await userEvent.click(submit);
    await expect(output).toHaveTextContent(JSON.stringify([["delivery", "immediate"]]));
    await userEvent.click(canvas.getByRole("button", { name: "Reset delivery" }));
    await expect(immediate).not.toBeChecked();
    await expect(daily).not.toBeChecked();
    await userEvent.click(daily);
    await userEvent.click(submit);
    await expect(output).toHaveTextContent(JSON.stringify([["delivery", "daily"]]));
    await expect(daily).toBeChecked();
  },
};

function DirectionalDelivery() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="en-US" className="field-story-case">
        <RadioGroup
          label="Horizontal delivery"
          description="Arrow keys select a schedule; the unavailable option is skipped."
          defaultValue="immediate"
        >
          <Radio value="immediate">Immediate updates</Radio>
          <Radio value="sms" disabled>
            SMS delivery
          </Radio>
          <Radio value="daily">Daily summary</Radio>
        </RadioGroup>
        <button type="button">Continue review</button>
      </Theme>
      <Theme theme={theme} lang="fa-IR" dir="rtl" className="field-story-case">
        <RadioGroup
          label="زمان دریافت پیام‌ها"
          description="با کلیدهای جهت‌دار، زمان دریافت پیام‌ها را انتخاب کنید."
          defaultValue="immediate"
        >
          <Radio value="immediate">فوری</Radio>
          <Radio value="sms" disabled>
            پیامک
          </Radio>
          <Radio value="daily">خلاصهٔ روزانه</Radio>
        </RadioGroup>
        <button type="button">ادامهٔ مرور</button>
      </Theme>
    </div>
  );
}

export const KeyboardAndDirection: Story = {
  render: DirectionalDelivery,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    for (const [name, firstName, lastName, disabledName, next, previous, after, locale, direction] of [
      [
        "Horizontal delivery",
        "Immediate updates",
        "Daily summary",
        "SMS delivery",
        "{ArrowRight}",
        "{ArrowLeft}",
        "Continue review",
        "en-US",
        "ltr",
      ],
      [
        "زمان دریافت پیام‌ها",
        "فوری",
        "خلاصهٔ روزانه",
        "پیامک",
        "{ArrowLeft}",
        "{ArrowRight}",
        "ادامهٔ مرور",
        "fa-IR",
        "rtl",
      ],
    ] as const) {
      const group = canvas.getByRole("radiogroup", { name });
      const first = within(group).getByRole("radio", { name: firstName });
      const last = within(group).getByRole("radio", { name: lastName });
      const disabled = within(group).getByRole("radio", { name: disabledName });
      await expect(group.closest("[lang]")).toHaveAttribute("lang", locale);
      await expect(group.closest("[lang]")).toHaveAttribute("dir", direction);
      await expect(disabled).toBeDisabled();
      await userEvent.click(first);
      await userEvent.keyboard(next);
      await expect(last).toHaveFocus();
      await expect(last).toBeChecked();
      await expect(first).not.toBeChecked();
      await expect(disabled).not.toBeChecked();
      await userEvent.keyboard(next);
      await expect(first).toHaveFocus();
      await expect(first).toBeChecked();
      await userEvent.keyboard(previous);
      await expect(last).toHaveFocus();
      await expect(last).toBeChecked();
      await userEvent.tab();
      await expect(canvas.getByRole("button", { name: after })).toHaveFocus();
    }
  },
};

function LocalizedDelivery() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="de-DE" className="field-story-stack field-story-narrow">
        <RadioGroup
          label="Zustellung der Benachrichtigungen für die gemeinsame Freigabeprüfung"
          description={
            <>
              Wählen Sie, wann Nachrichten zum Arbeitsbereich <bdi dir="ltr">WS-1042</bdi> ankommen.
              Diese Hinweise bleiben auch bei einer Korrektur sichtbar.
            </>
          }
          isOptional
        >
          <Radio value="immediate">
            Sofortige Benachrichtigungen über Änderungen und Kommentare während der gemeinsamen
            Freigabeprüfung
          </Radio>
          <Radio value="daily">
            Eine tägliche Zusammenfassung nach Abschluss der gemeinsamen Prüfung
          </Radio>
        </RadioGroup>
      </Theme>
      <Theme theme={theme} lang="fa-IR" dir="rtl" className="field-story-stack field-story-narrow">
        <RadioGroup
          label="زمان دریافت پیام‌های پروژه"
          description={
            <>
              زمان دریافت پیام‌های پروژهٔ <bdi dir="ltr">WS-1042</bdi> را انتخاب کنید. راهنما هنگام
              اصلاح انتخاب حفظ می‌شود.
            </>
          }
          required
        >
          <Radio value="immediate">
            دریافت فوری پیام‌های تغییرها و نظرهای تیم در این فضای کاری
          </Radio>
          <Radio value="daily">دریافت خلاصهٔ روزانه پس از پایان مرور تیم</Radio>
        </RadioGroup>
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl" className="field-story-stack field-story-narrow">
        <RadioGroup
          label="موعد استلام رسائل المراجعة"
          description={
            <>
              اختر موعد استلام رسائل المشروع <bdi dir="ltr">WS-1042</bdi>. تبقى التعليمات ظاهرة
              أثناء تصحيح الاختيار.
            </>
          }
          required
        >
          <Radio value="immediate">
            إرسال رسائل التغييرات وتعليقات الفريق فورًا في مساحة العمل
          </Radio>
          <Radio value="daily">إرسال ملخص يومي بعد انتهاء مراجعة الفريق</Radio>
        </RadioGroup>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: LocalizedDelivery,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [name, locale, direction] of [
      [
        "Zustellung der Benachrichtigungen für die gemeinsame Freigabeprüfung (optional)",
        "de-DE",
        "ltr",
      ],
      ["زمان دریافت پیام‌های پروژه (الزامی)", "fa-IR", "rtl"],
      ["موعد استلام رسائل المراجعة (مطلوب)", "ar", "rtl"],
    ] as const) {
      const group = canvas.getByRole("radiogroup", { name });
      await expect(group.closest("[lang]")).toHaveAttribute("lang", locale);
      await expect(group.closest("[lang]")).toHaveAttribute("dir", direction);
      const identifier = within(group).getByText("WS-1042");
      await expect(identifier.tagName).toBe("BDI");
      await expect(identifier).toHaveAttribute("dir", "ltr");
      for (const part of group.querySelectorAll<HTMLElement>(
        ".hashti-field__label, .hashti-field__description, .hashti-radio",
      )) {
        await expect(part).toBeVisible();
        await expect(part.scrollWidth).toBeLessThanOrEqual(part.clientWidth + 1);
        await expect(part.scrollHeight).toBeLessThanOrEqual(part.clientHeight + 1);
      }
    }
    const documentRoot = canvasElement.ownerDocument.documentElement;
    await expect(documentRoot.scrollWidth).toBeLessThanOrEqual(documentRoot.clientWidth + 1);
  },
};

export const DetachedStatusShowcase: Story = {
  render: () => (
    <div className="field-story-grid">
      <RadioGroup
        name="deployment-strategy"
        label="Deployment strategy"
        description="Select how the new build should be rolled out across nodes."
        defaultValue="canary"
        status={{
          type: "warning",
          message: "Canary rollouts take up to 45 minutes to reach full capacity.",
        }}
      >
        <Radio value="canary">Canary rollout (10% increments)</Radio>
        <Radio value="blue-green">Blue-green cutover</Radio>
        <Radio value="rolling">Rolling restart</Radio>
      </RadioGroup>

      <RadioGroup
        name="retention-policy"
        label="Artifact retention window"
        description="Specify how long build artifacts are preserved in storage."
        defaultValue="30days"
        status={{
          type: "error",
          message: "Selected retention window requires enterprise quota approval.",
        }}
      >
        <Radio value="7days">7 days</Radio>
        <Radio value="30days">30 days</Radio>
        <Radio value="90days">90 days</Radio>
      </RadioGroup>

      <RadioGroup
        name="encryption-level"
        label="Key management service"
        description="Select encryption key type for data at rest."
        defaultValue="kms"
        status={{
          type: "success",
          message: "Hardware security module (HSM) keys active and verified.",
        }}
      >
        <Radio value="kms">Cloud KMS managed key</Radio>
        <Radio value="customer">Customer provided key (CPK)</Radio>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const warnGroup = canvas.getByRole("radiogroup", { name: "Deployment strategy" });
    const warnStatus = warnGroup.querySelector(".hashti-field__status");
    await expect(warnStatus).toBeVisible();
    await expect(warnStatus).toHaveAttribute("data-hashti-status", "warning");
    await expect(warnStatus).toHaveAttribute("data-variant", "detached");
    await expect(warnStatus).toHaveTextContent(
      "Canary rollouts take up to 45 minutes to reach full capacity.",
    );
    await expect(warnGroup).toHaveAccessibleDescription(
      /Canary rollouts take up to 45 minutes to reach full capacity/,
    );

    const errGroup = canvas.getByRole("radiogroup", { name: "Artifact retention window" });
    const errStatus = errGroup.querySelector(".hashti-field__status");
    await expect(errStatus).toBeVisible();
    await expect(errStatus).toHaveAttribute("data-hashti-status", "error");
    await expect(errStatus).toHaveAttribute("data-variant", "detached");
    await expect(errStatus).toHaveTextContent(
      "Selected retention window requires enterprise quota approval.",
    );

    const successGroup = canvas.getByRole("radiogroup", { name: "Key management service" });
    const successStatus = successGroup.querySelector(".hashti-field__status");
    await expect(successStatus).toBeVisible();
    await expect(successStatus).toHaveAttribute("data-hashti-status", "success");
    await expect(successStatus).toHaveAttribute("data-variant", "detached");
    await expect(successStatus).toHaveTextContent(
      "Hardware security module (HSM) keys active and verified.",
    );

    await userEvent.click(canvas.getByRole("radio", { name: "Blue-green cutover" }));
    await expect(canvas.getByRole("radio", { name: "Blue-green cutover" })).toBeChecked();
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <RadioGroup label="Primary" color="primary" defaultValue="p1">
        <Radio value="p1">Primary Option</Radio>
      </RadioGroup>
      <RadioGroup label="Secondary" color="secondary" defaultValue="s1">
        <Radio value="s1">Secondary Option</Radio>
      </RadioGroup>
      <RadioGroup label="Success" color="success" defaultValue="su1">
        <Radio value="su1">Success Option</Radio>
      </RadioGroup>
      <RadioGroup label="Warning" color="warning" defaultValue="w1">
        <Radio value="w1">Warning Option</Radio>
      </RadioGroup>
      <RadioGroup label="Danger" color="danger" defaultValue="d1">
        <Radio value="d1">Danger Option</Radio>
      </RadioGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("radio", { name: "Primary Option" })).toBeChecked();
    expect(canvas.getByRole("radio", { name: "Success Option" })).toBeChecked();
    expect(canvas.getByRole("radio", { name: "Danger Option" })).toBeChecked();
  },
};
