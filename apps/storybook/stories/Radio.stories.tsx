import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { Button, Form, Radio, RadioGroup, Theme, useTheme, type FormProps } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Radio",
  component: RadioGroup,
  args: {
    label: "Delivery schedule",
    description: "Choose when review updates arrive.",
    errorMessage: "Choose a delivery schedule.",
    defaultValue: "immediate",
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    value: { control: "select", options: ["immediate", "daily"] },
    defaultValue: { control: "select", options: ["immediate", "daily"] },
    name: { control: "text" },
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    isDisabled: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isRequired: { control: "boolean" },
    isInvalid: { control: "boolean" },
    validationBehavior: { control: "select", options: ["native", "aria"] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Radio requires a string value and belongs inside RadioGroup. Selection, read-only, required, and validation state belong to the group; individual options can be disabled. There is no mixed state. The callable group provides persistent guidance and detached group recovery. Root, Label, Description, Options, Radio, Help, ErrorMessage, and Status remain composable. RAC owns native inputs, validation, and roving focus: Space selects; arrow keys move and select, skipping disabled options and respecting horizontal locale direction. Root refs target a div, Radio refs a label, and inputRef the native radio input. Custom render callbacks must retain these native elements and props.",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onChange: fn() },
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
        isRequired
        isInvalid
        errorMessage="Choose a delivery schedule."
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
      <RadioGroup
        label="Read-only delivery"
        description="The review owner chose this schedule."
        defaultValue="immediate"
        isReadOnly
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
      <RadioGroup
        label="Unavailable delivery"
        description="Archived reviews cannot change delivery."
        defaultValue="daily"
        isDisabled
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
    await expect(invalid).toHaveAttribute("aria-invalid", "true");
    await expect(invalid).toHaveAccessibleDescription(
      "Choose one schedule for this review. Choose a delivery schedule.",
    );
    await expect(within(invalid).getByText("Choose one schedule for this review.")).toBeVisible();
    await expect(within(invalid).getByText("Choose a delivery schedule.")).toBeVisible();

    const readonly = canvas.getByRole("radiogroup", { name: "Read-only delivery" });
    const selected = within(readonly).getByRole<HTMLInputElement>("radio", {
      name: "Immediate updates",
    });
    const unselected = within(readonly).getByRole<HTMLInputElement>("radio", {
      name: "Daily summary",
    });
    await expect(readonly).toHaveAttribute("aria-readonly", "true");
    for (const option of [selected, unselected]) {
      await expect(option).not.toBeDisabled();
      await userEvent.click(option);
      await expect(option).toHaveFocus();
      await userEvent.keyboard(" ");
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
        onChange={setDelivery}
      >
        <Radio value="immediate">Immediate updates</Radio>
        <Radio value="daily">Daily summary</Radio>
      </RadioGroup>
      <output aria-label="Controlled delivery value">{delivery}</output>
      <RadioGroup
        label="Uncontrolled delivery"
        description="RAC owns this selection until submission."
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

const deliveryHint = "Choose when review updates arrive. This form only reads the current draft.";
const missingDelivery = "Choose a delivery schedule.";
const returnedDeliveryError = "This schedule is no longer available. Choose another schedule.";

function ComposedDelivery() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLLabelElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<FormProps["validationErrors"]>({});
  const [submitted, setSubmitted] = useState("");
  const [refs, setRefs] = useState("");
  return (
    <Form
      aria-label="Delivery form"
      className="field-story-stack"
      validationBehavior="native"
      validationErrors={validationErrors}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(JSON.stringify(Array.from(new FormData(event.currentTarget).entries())));
      }}
      onReset={() => {
        setValidationErrors({});
        setSubmitted("");
      }}
    >
      <p>
        Read the native values without saving or resetting the draft. Apply a returned, name-keyed
        error to try group recovery; no request leaves this page.
      </p>
      <RadioGroup.Root
        ref={root}
        name="delivery"
        isRequired
        render={(props) => <div {...props} data-composed-root="true" />}
      >
        <RadioGroup.Label>Delivery schedule</RadioGroup.Label>
        <RadioGroup.Description>{deliveryHint}</RadioGroup.Description>
        <RadioGroup.Options>
          <RadioGroup.Radio
            ref={label}
            inputRef={input}
            value="immediate"
            className={({ isSelected }) => (isSelected ? "selected-delivery" : "delivery-option")}
            style={({ isSelected }) => ({ fontWeight: isSelected ? 600 : 400 })}
            render={(props) => (
              // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- RAC supplies the native input through props.children.
              <label {...props} data-composed-radio="true" />
            )}
          >
            {({ isSelected }) => (
              <>
                Immediate updates <span aria-hidden="true">{isSelected ? "(selected)" : ""}</span>
              </>
            )}
          </RadioGroup.Radio>
          <RadioGroup.Radio value="daily">Daily summary</RadioGroup.Radio>
        </RadioGroup.Options>
        <RadioGroup.Help>
          <RadioGroup.ErrorMessage>
            {({ validationDetails, validationErrors }) =>
              validationDetails.valueMissing ? missingDelivery : validationErrors.join(" ")
            }
          </RadioGroup.ErrorMessage>
        </RadioGroup.Help>
      </RadioGroup.Root>
      <Button type="submit">Read delivery values</Button>
      <Button
        type="button"
        variant="ghost"
        onPress={() => {
          setRefs(`${root.current?.tagName}/${label.current?.tagName}/${input.current?.tagName}`);
          input.current?.focus();
        }}
      >
        Focus immediate updates
      </Button>
      <Button
        type="button"
        variant="ghost"
        onPress={() => setValidationErrors({ delivery: returnedDeliveryError })}
      >
        Apply returned delivery error
      </Button>
      <Button type="reset" variant="ghost">
        Reset delivery
      </Button>
      <output aria-label="Delivery FormData">{submitted}</output>
      <output aria-label="Native radio refs">{refs}</output>
    </Form>
  );
}

export const CompositionAndFormData: Story = {
  render: ComposedDelivery,
  parameters: {
    docs: {
      description: {
        story:
          "The composed required group uses actual native submit/reset validation and Form validationErrors keyed by its name. Applying a returned error does not simulate a server or save retry; RAC clears that error when the selected value changes. The focus action inspects div/label/input refs and focuses only the native input. Render-prop children keep a stable accessible name, class/style callbacks retain Cinder hooks, and submission displays the real FormData entry list.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("radiogroup", { name: "Delivery schedule (required)" });
    const immediate = within(group).getByRole<HTMLInputElement>("radio", {
      name: "Immediate updates",
    });
    const daily = within(group).getByRole<HTMLInputElement>("radio", { name: "Daily summary" });
    const description = within(group).getByText(deliveryHint);
    const descriptionId = description.id;
    const submit = canvas.getByRole("button", { name: "Read delivery values" });
    const output = canvas.getByRole("status", { name: "Delivery FormData" });
    await expect(immediate).toHaveAttribute("type", "radio");
    await expect(immediate).toBeRequired();
    await expect(daily).toBeRequired();
    await expect(group).toHaveAttribute("aria-required", "true");
    await expect(canvas.queryByText(missingDelivery)).not.toBeInTheDocument();
    await userEvent.click(submit);
    await waitFor(() => expect(immediate).toHaveFocus());
    await expect(canvas.getByText(missingDelivery)).toBeVisible();
    await expect(group).toHaveAccessibleDescription(`${deliveryHint} ${missingDelivery}`);
    await expect(output).toBeEmptyDOMElement();

    await userEvent.click(canvas.getByRole("button", { name: "Reset delivery" }));
    await waitFor(() => expect(canvas.queryByText(missingDelivery)).not.toBeInTheDocument());
    await expect(immediate).not.toBeChecked();
    await expect(daily).not.toBeChecked();
    await expect(group).not.toHaveAttribute("aria-invalid", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Focus immediate updates" }));
    await expect(immediate).toHaveFocus();
    await expect(canvas.getByRole("status", { name: "Native radio refs" })).toHaveTextContent(
      "DIV/LABEL/INPUT",
    );
    await expect(group).toHaveAttribute("data-composed-root", "true");
    await expect(immediate.closest("label")).toHaveAttribute("data-composed-radio", "true");
    await userEvent.keyboard(" ");
    await expect(immediate).toBeChecked();
    await expect(immediate.closest("label")).toHaveClass("hashti-radio", "selected-delivery");
    await expect(immediate.closest("label")).toHaveStyle({ fontWeight: 600 });
    await userEvent.click(submit);
    await expect(output).toHaveTextContent(JSON.stringify([["delivery", "immediate"]]));

    await userEvent.click(canvas.getByRole("button", { name: "Apply returned delivery error" }));
    await expect(await canvas.findByText(returnedDeliveryError)).toBeVisible();
    await expect(group).toHaveAccessibleDescription(`${deliveryHint} ${returnedDeliveryError}`);
    await expect(description).toBeVisible();
    await expect(description.id).toBe(descriptionId);
    await expect(immediate.validity.customError).toBe(true);
    await userEvent.click(submit);
    await waitFor(() => expect(immediate).toHaveFocus());
    await expect(canvas.getByText(returnedDeliveryError)).toBeVisible();
    await expect(output).toHaveTextContent(JSON.stringify([["delivery", "immediate"]]));
    await userEvent.click(daily);
    await waitFor(() => expect(canvas.queryByText(returnedDeliveryError)).not.toBeInTheDocument());
    await expect(group).not.toHaveAttribute("aria-invalid", "true");
    await expect(description.id).toBe(descriptionId);
    await expect(group.getAttribute("aria-describedby")?.split(/\s+/)).toContain(descriptionId);
    await userEvent.click(submit);
    await expect(output).toHaveTextContent(JSON.stringify([["delivery", "daily"]]));
    await expect(daily).toBeChecked();
    await expect(immediate).not.toBeChecked();
  },
};

function DirectionalDelivery() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} locale="en-US" className="field-story-case">
        <RadioGroup
          label="Horizontal delivery"
          description="Arrow keys select a schedule; the unavailable option is skipped."
          orientation="horizontal"
          defaultValue="immediate"
        >
          <Radio value="immediate">Immediate updates</Radio>
          <Radio value="sms" isDisabled>
            SMS delivery
          </Radio>
          <Radio value="daily">Daily summary</Radio>
        </RadioGroup>
        <Button type="button" variant="ghost">
          Continue review
        </Button>
      </Theme>
      <Theme theme={theme} locale="fa-IR" className="field-story-case">
        <RadioGroup
          label="زمان دریافت پیام‌ها"
          description="با کلیدهای جهت‌دار، زمان دریافت پیام‌ها را انتخاب کنید."
          orientation="horizontal"
          defaultValue="immediate"
        >
          <Radio value="immediate">فوری</Radio>
          <Radio value="sms" isDisabled>
            پیامک
          </Radio>
          <Radio value="daily">خلاصهٔ روزانه</Radio>
        </RadioGroup>
        <Button type="button" variant="ghost">
          ادامهٔ مرور
        </Button>
      </Theme>
    </div>
  );
}

export const KeyboardNavigation: Story = {
  render: DirectionalDelivery,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    for (const [
      name,
      firstName,
      disabledName,
      lastName,
      next,
      previous,
      after,
      locale,
      direction,
    ] of [
      [
        "Horizontal delivery",
        "Immediate updates",
        "SMS delivery",
        "Daily summary",
        "{ArrowRight}",
        "{ArrowLeft}",
        "Continue review",
        "en-US",
        "ltr",
      ],
      [
        "زمان دریافت پیام‌ها",
        "فوری",
        "پیامک",
        "خلاصهٔ روزانه",
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
      await expect(group).toHaveAttribute("aria-orientation", "horizontal");
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
      <Theme theme={theme} locale="de-DE" className="field-story-stack field-story-narrow">
        <RadioGroup
          label="Zustellung der Benachrichtigungen für die gemeinsame Freigabeprüfung"
          description={
            <>
              Wählen Sie, wann Nachrichten zum Arbeitsbereich <bdi dir="ltr">WS-1042</bdi> ankommen.
              Diese Hinweise bleiben auch bei einer Korrektur sichtbar.
            </>
          }
          isRequired
          isInvalid
          errorMessage="Wählen Sie einen Zustellzeitpunkt. Ihre übrigen Angaben bleiben während der Korrektur erhalten."
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
      <Theme theme={theme} locale="fa-IR" className="field-story-stack field-story-narrow">
        <RadioGroup
          label="زمان دریافت پیام‌های پروژه"
          description={
            <>
              زمان دریافت پیام‌های پروژهٔ <bdi dir="ltr">WS-1042</bdi> را انتخاب کنید. راهنما هنگام
              اصلاح انتخاب حفظ می‌شود.
            </>
          }
          isRequired
          isInvalid
          errorMessage="یک زمان دریافت را انتخاب کنید."
        >
          <Radio value="immediate">
            دریافت فوری پیام‌های تغییرها و نظرهای تیم در این فضای کاری
          </Radio>
          <Radio value="daily">دریافت خلاصهٔ روزانه پس از پایان مرور تیم</Radio>
        </RadioGroup>
      </Theme>
      <Theme theme={theme} locale="ar" className="field-story-stack field-story-narrow">
        <RadioGroup
          label="موعد استلام رسائل المراجعة"
          description={
            <>
              اختر موعد استلام رسائل المشروع <bdi dir="ltr">WS-1042</bdi>. تبقى التعليمات ظاهرة
              أثناء تصحيح الاختيار.
            </>
          }
          isRequired
          isInvalid
          errorMessage="اختر موعدًا لاستلام الرسائل."
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
        "Zustellung der Benachrichtigungen für die gemeinsame Freigabeprüfung (erforderlich)",
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
        ".hashti-field__label, .hashti-field__description, .hashti-field__error, .hashti-radio",
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
