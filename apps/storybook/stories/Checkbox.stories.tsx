import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Checkbox, CheckboxGroup, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Checkbox",
  component: Checkbox,
  args: {
    children: "Include review notes",
    defaultChecked: false,
    name: "reviewNotes",
    value: "included",
  },
  argTypes: {
    children: { control: "text" },
    checked: { control: false },
    defaultChecked: { control: "boolean" },
    readOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    value: { control: "text" },
    color: { control: false },
    size: { control: false },
    render: { control: false },
    ref: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Checkbox represents an independent choice or a draft preference applied by Save. Pointer activation and Space toggle it. checked accepts true, false, or the indeterminate mixed state; CheckboxGroup owns its member value array, required/read-only state, guidance, and detached group recovery. Named members submit repeated entries: use FormData.getAll(), not Object.fromEntries(). ui-sdk renders a role=checkbox control plus a visually hidden native input that submits. Derive a select-all checkbox from the group's values, or give the group a parent Checkbox. Read-only checked choices submit; disabled choices do not.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onCheckedChange: fn() },
  render: (args) => (
    <div className="field-story-stack">
      <Checkbox {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <div className="field-story-case">
        <h2>Independent choices</h2>
        <Checkbox>Review notes off</Checkbox>
        <Checkbox defaultChecked>Review notes on</Checkbox>
        <Checkbox defaultChecked="indeterminate">Some review topics selected</Checkbox>
        <Checkbox readOnly defaultChecked>
          Owner-managed audit record
        </Checkbox>
        <Checkbox disabled defaultChecked>
          Archived review notes
        </Checkbox>
        <Checkbox disabled defaultChecked="indeterminate">
          Unavailable mixed review topics
        </Checkbox>
      </div>
      <div className="field-story-case">
        <h2>Required and invalid</h2>
        <Checkbox required aria-label="I confirm the review requirements">
          I confirm the review requirements (required)
        </Checkbox>
        <p>
          Submitting the surrounding form with this unchecked fails the browser's required
          validation. Custom error recovery lives on CheckboxGroup.
        </p>
      </div>
      <CheckboxGroup
        label="Channels requiring correction"
        description="Choose where review updates arrive. The unavailable channel cannot be changed."
        defaultValue={["email", "archived"]}
        status={{
          type: "error",
          message: "Email delivery is unavailable for this review. Choose in-app updates instead.",
        }}
      >
        <Checkbox value="email">Email updates</Checkbox>
        <Checkbox value="inApp">In-app updates</Checkbox>
        <Checkbox value="archived" disabled>
          Archived updates
        </Checkbox>
      </CheckboxGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("checkbox", { name: "Review notes off" })).not.toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "Review notes on" })).toBeChecked();
    for (const name of ["Some review topics selected", "Unavailable mixed review topics"]) {
      await expect(canvas.getByRole("checkbox", { name })).toBePartiallyChecked();
    }
    for (const name of [
      "Archived review notes",
      "Unavailable mixed review topics",
      "Archived updates",
    ]) {
      await expect(canvas.getByRole("checkbox", { name })).toBeDisabled();
    }
    const readonly = canvas.getByRole("checkbox", { name: "Owner-managed audit record" });
    await expect(readonly).not.toBeDisabled();
    await expect(readonly).toHaveAttribute("data-readonly");
    await expect(readonly).toBeChecked();
    const confirmation = canvas.getByRole("checkbox", {
      name: "I confirm the review requirements (required)",
    });
    await expect(confirmation).toHaveAttribute("aria-required", "true");
    const group = canvas.getByRole("group", { name: "Channels requiring correction" });
    await expect(group).toHaveAttribute("data-hashti-status", "error");
    await expect(within(group).getByRole("checkbox", { name: "Email updates" })).toBeChecked();
    await expect(within(group).getByRole("checkbox", { name: "Archived updates" })).toBeChecked();
  },
};

function ValueExamples() {
  const [included, setIncluded] = useState(true);
  return (
    <div className="field-story-stack">
      <Checkbox
        checked={included}
        onCheckedChange={(next) => setIncluded(next === true)}
        aria-label="Controlled review notes"
      >
        Controlled review notes
      </Checkbox>
      <output aria-label="Review notes draft">{included ? "Included" : "Not included"}</output>
      <Checkbox defaultChecked>Uncontrolled handoff checklist</Checkbox>
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: ValueExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const controlled = canvas.getByRole("checkbox", { name: "Controlled review notes" });
    const uncontrolled = canvas.getByRole("checkbox", { name: "Uncontrolled handoff checklist" });
    await userEvent.click(controlled);
    await expect(canvas.getByRole("status", { name: "Review notes draft" })).toHaveTextContent(
      "Not included",
    );
    await userEvent.click(uncontrolled);
    await expect(uncontrolled).not.toBeChecked();
    await userEvent.keyboard(" ");
    await expect(uncontrolled).toBeChecked();
    await expect(controlled).not.toBeChecked();
  },
};

const topics = [
  { value: "comments", label: "Team comments" },
  { value: "handoff", label: "Handoff checklist" },
  { value: "decisions", label: "Review decisions" },
];

function TopicSelection() {
  const [selected, setSelected] = useState(["comments"]);
  return (
    <div className="field-story-stack">
      <p>
        The select-all mark is derived from the group's values; it never stores a second selection.
      </p>
      <Checkbox
        aria-controls="review-topic-selection"
        checked={
          selected.length === topics.length
            ? true
            : selected.length > 0
              ? "indeterminate"
              : false
        }
        onCheckedChange={() =>
          setSelected(selected.length === topics.length ? [] : topics.map((topic) => topic.value))
        }
      >
        Include all review topics
      </Checkbox>
      <CheckboxGroup
        id="review-topic-selection"
        label="Included review topics"
        description="Select individual topics, or include them all. These are draft report preferences."
        value={selected}
        onValueChange={setSelected}
      >
        {topics.map((topic) => (
          <Checkbox key={topic.value} value={topic.value}>
            {topic.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <output aria-label="Selected review topics">{selected.join(", ") || "None"}</output>
    </div>
  );
}

export const MixedSelection: Story = {
  render: TopicSelection,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const all = canvas.getByRole("checkbox", { name: "Include all review topics" });
    const group = canvas.getByRole("group", { name: "Included review topics" });
    const members = within(group).getAllByRole("checkbox");
    await expect(all).toBePartiallyChecked();
    await expect(members[0]).toBeChecked();
    await expect(members[1]).not.toBeChecked();
    await userEvent.click(all);
    for (const member of members) await expect(member).toBeChecked();
    await expect(all).toBeChecked();
    await expect(all).not.toBePartiallyChecked();
    await userEvent.click(within(group).getByRole("checkbox", { name: "Handoff checklist" }));
    await expect(all).toBePartiallyChecked();
    await expect(canvas.getByRole("status", { name: "Selected review topics" })).toHaveTextContent(
      "comments, decisions",
    );
    await userEvent.click(all);
    await userEvent.keyboard(" ");
    for (const member of members) await expect(member).not.toBeChecked();
    await expect(all).not.toBePartiallyChecked();
    await expect(canvas.getByRole("status", { name: "Selected review topics" })).toHaveTextContent(
      "None",
    );
    await userEvent.tab();
    await expect(members[0]).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(members[0]).toBeChecked();
    await expect(all).toBePartiallyChecked();
  },
};

function ParentCheckboxExample() {
  const [selected, setSelected] = useState(["comments"]);
  return (
    <div className="field-story-stack">
      <p>
        A parent checkbox with <code>parent</code> reads its state from the group and checks or
        unchecks every member.
      </p>
      <CheckboxGroup
        aria-label="Review topics with a parent"
        value={selected}
        onValueChange={setSelected}
      >
        <Checkbox parent>Include all review topics</Checkbox>
        {topics.map((topic) => (
          <Checkbox key={topic.value} value={topic.value}>
            {topic.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}

export const ParentCheckbox: Story = {
  render: ParentCheckboxExample,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole("checkbox", { name: "Include all review topics" });
    await expect(parent).toBePartiallyChecked();
    await userEvent.click(parent);
    await expect(parent).toBeChecked();
    await userEvent.click(parent);
    await expect(parent).not.toBeChecked();
    await expect(parent).not.toBePartiallyChecked();
  },
};

function ComposedChannels() {
  const root = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const [submitted, setSubmitted] = useState("");
  const [channels, setChannels] = useState("");
  const [refs, setRefs] = useState("");
  return (
    <form
      aria-label="Review channel form"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setSubmitted(JSON.stringify(Array.from(values.entries())));
        setChannels(JSON.stringify(values.getAll("channels")));
      }}
      onReset={() => {
        setSubmitted("");
        setChannels("");
      }}
    >
      <p>
        Read the draft's native entries without saving it. ui-sdk's hidden inputs submit the
        checked values; the visible controls are buttons with checkbox roles.
      </p>
      <CheckboxGroup.Root
        ref={root}
        name="channels"
        aria-labelledby="channels-heading"
        render={(props) => <div {...props} data-composed-root="true" />}
      >
        <h2 id="channels-heading">Review channels</h2>
        <p>Choose where review updates arrive. These choices remain here while you edit.</p>
        <CheckboxGroup.Checkbox
          ref={control}
          value="email"
          className={(state) => (state.checked ? "selected-channel" : "channel-option")}
          style={(state) => ({ fontWeight: state.checked ? 600 : 400 })}
        >
          {(state) => (
            <>
              Email updates <span aria-hidden="true">{state.checked ? "(selected)" : ""}</span>
            </>
          )}
        </CheckboxGroup.Checkbox>
        <CheckboxGroup.Checkbox value="inApp">In-app updates</CheckboxGroup.Checkbox>
      </CheckboxGroup.Root>
      <Checkbox name="audit" value="retained" readOnly defaultChecked>
        Owner-managed audit record
      </Checkbox>
      <Checkbox name="archived" value="included" disabled defaultChecked>
        Archived review notes
      </Checkbox>
      <button type="submit">Read channel values</button>
      <button
        type="button"
        onClick={() => {
          setRefs(`${root.current?.tagName}/${control.current?.tagName}`);
          control.current?.focus();
        }}
      >
        Focus email updates
      </button>
      <button type="reset">Reset channels</button>
      <output aria-label="Channel FormData">{submitted}</output>
      <output aria-label="Repeated channel values">{channels}</output>
      <output aria-label="Control refs">{refs}</output>
    </form>
  );
}

export const CompositionAndFormData: Story = {
  render: ComposedChannels,
  parameters: {
    docs: {
      description: {
        story:
          "The composed group keeps its own root, headings, and state-function class names and styles. ui-sdk gives every named member a hidden native input, so FormData holds repeated entries for the checked values. Read-only members still submit; disabled members submit nothing. Reset returns the group to its uncontrolled defaults.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("group", { name: "Review channels" });
    const email = within(group).getByRole("checkbox", { name: "Email updates" });
    const inApp = within(group).getByRole("checkbox", { name: "In-app updates" });
    const submit = canvas.getByRole("button", { name: "Read channel values" });
    const output = canvas.getByRole("status", { name: "Channel FormData" });
    const repeated = canvas.getByRole("status", { name: "Repeated channel values" });
    await expect(group).toHaveAttribute("data-composed-root", "true");
    await expect(group).toHaveClass("hashti-field", "hashti-checkbox-group");
    await expect(email).toHaveClass("hashti-checkbox", "channel-option");
    await userEvent.click(canvas.getByRole("button", { name: "Focus email updates" }));
    await expect(email).toHaveFocus();
    await expect(canvas.getByRole("status", { name: "Control refs" })).toHaveTextContent(
      "DIV/BUTTON",
    );
    await userEvent.keyboard(" ");
    await expect(email).toBeChecked();
    await expect(email).toHaveClass("hashti-checkbox", "selected-channel");
    await expect(email).toHaveStyle({ fontWeight: 600 });
    await userEvent.click(inApp);
    await userEvent.click(submit);
    await expect(repeated).toHaveTextContent(JSON.stringify(["email", "inApp"]));
    await expect(output).toHaveTextContent(
      JSON.stringify([
        ["channels", "email"],
        ["channels", "inApp"],
        ["audit", "retained"],
      ]),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Reset channels" }));
    await expect(email).not.toBeChecked();
    await expect(inApp).not.toBeChecked();
    await userEvent.click(submit);
    await expect(output).toHaveTextContent(JSON.stringify([["audit", "retained"]]));
  },
};

const translations = [
  {
    locale: "de-DE",
    direction: "ltr",
    necessity: "optional",
    label: "Benachrichtigungen für die gemeinsame Freigabeprüfung",
    description: "Wählen Sie die Nachrichten für den Arbeitsbereich",
    guidance: "Ihre übrigen Angaben bleiben während der Korrektur erhalten.",
    email:
      "Arbeitsbereichsbenachrichtigungszusammenfassung einschließlich der Übergabecheckliste per E-Mail senden",
    inApp: "Nachrichten über die gemeinsame Prüfung im Arbeitsbereich anzeigen",
  },
  {
    locale: "fa-IR",
    direction: "rtl",
    necessity: "الزامی",
    label: "پیام‌های مرور پروژه",
    description: "روش دریافت پیام‌های پروژه را انتخاب کنید؛ شناسهٔ فضای کاری:",
    guidance: "داده‌های دیگر هنگام اصلاح انتخاب حفظ می‌شوند.",
    email: "خلاصهٔ هفتگی و فهرست کارهای باقی‌ماندهٔ مرور تیم با ایمیل فرستاده شوند",
    inApp: "پیام‌های مربوط به مرور تیم در فضای کاری نمایش داده شوند",
  },
  {
    locale: "ar",
    direction: "rtl",
    necessity: "مطلوب",
    label: "رسائل مراجعة المشروع",
    description: "اختر قنوات استلام رسائل المشروع في مساحة العمل",
    guidance: "تبقى بياناتك الأخرى محفوظة أثناء تصحيح الاختيار.",
    email:
      "إرسال الملخص الأسبوعي وقائمة مهام التسليم المتبقية إلى فريق مساحة العمل عبر البريد الإلكتروني",
    inApp: "عرض رسائل مراجعة الفريق في مساحة العمل",
  },
] as const;

function LocalizedChannels() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      {translations.map((copy) => (
        <Theme
          key={copy.locale}
          theme={theme}
          lang={copy.locale}
          dir={copy.direction}
          className="field-story-stack field-story-narrow"
        >
          <CheckboxGroup
            label={copy.label}
            description={
              <>
                {copy.description} <bdi dir="ltr">WS-1042</bdi>. {copy.guidance}
              </>
            }
            required={copy.direction === "rtl"}
            isOptional={copy.direction === "ltr"}
          >
            <Checkbox value="email">{copy.email}</Checkbox>
            <Checkbox value="inApp">{copy.inApp}</Checkbox>
          </CheckboxGroup>
        </Theme>
      ))}
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: LocalizedChannels,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const copy of translations) {
      const group = canvas.getByRole("group", { name: `${copy.label} (${copy.necessity})` });
      await expect(group.closest("[lang]")).toHaveAttribute("lang", copy.locale);
      await expect(group.closest("[lang]")).toHaveAttribute("dir", copy.direction);
      const identifier = within(group).getByText("WS-1042");
      await expect(identifier.tagName).toBe("BDI");
      await expect(identifier).toHaveAttribute("dir", "ltr");
      for (const part of group.querySelectorAll<HTMLElement>(
        ".hashti-field__label, .hashti-field__description, .hashti-checkbox",
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
      <CheckboxGroup
        name="notifications-warning"
        label="Notification preferences"
        description="Select the notifications you want delivered to your workspace."
        defaultValue={["email"]}
        status={{
          type: "warning",
          message: "Digest delivery is temporarily experiencing minor delays.",
        }}
      >
        <Checkbox value="email">Email notifications</Checkbox>
        <Checkbox value="sms">SMS notifications</Checkbox>
        <Checkbox value="push">Push notifications</Checkbox>
      </CheckboxGroup>

      <CheckboxGroup
        name="access-error"
        label="Repository access permissions"
        description="Choose which branches this service account can access."
        defaultValue={["main"]}
        status={{
          type: "error",
          message: "At least one production branch must be selected for deployment.",
        }}
      >
        <Checkbox value="main">main branch</Checkbox>
        <Checkbox value="staging">staging branch</Checkbox>
        <Checkbox value="dev">development branch</Checkbox>
      </CheckboxGroup>

      <CheckboxGroup
        name="compliance-success"
        label="Compliance verification"
        description="Confirm that security scans and audits have been performed."
        defaultValue={["sast", "audit"]}
        status={{
          type: "success",
          message: "All compliance requirements are verified for this release.",
        }}
      >
        <Checkbox value="sast">Static application security testing (SAST)</Checkbox>
        <Checkbox value="audit">Quarterly access audit confirmed</Checkbox>
      </CheckboxGroup>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const warnGroup = canvas.getByRole("group", { name: "Notification preferences" });
    const warnStatus = warnGroup.querySelector(".hashti-field__status");
    await expect(warnStatus).toBeVisible();
    await expect(warnStatus).toHaveAttribute("data-hashti-status", "warning");
    await expect(warnStatus).toHaveAttribute("data-variant", "detached");
    await expect(warnStatus).toHaveTextContent(
      "Digest delivery is temporarily experiencing minor delays.",
    );
    await expect(warnGroup).toHaveAccessibleDescription(
      /Digest delivery is temporarily experiencing minor delays/,
    );

    const errGroup = canvas.getByRole("group", { name: "Repository access permissions" });
    const errStatus = errGroup.querySelector(".hashti-field__status");
    await expect(errStatus).toBeVisible();
    await expect(errStatus).toHaveAttribute("data-hashti-status", "error");
    await expect(errStatus).toHaveAttribute("data-variant", "detached");
    await expect(errStatus).toHaveTextContent(
      "At least one production branch must be selected for deployment.",
    );

    const successGroup = canvas.getByRole("group", { name: "Compliance verification" });
    const successStatus = successGroup.querySelector(".hashti-field__status");
    await expect(successStatus).toBeVisible();
    await expect(successStatus).toHaveAttribute("data-hashti-status", "success");
    await expect(successStatus).toHaveAttribute("data-variant", "detached");
    await expect(successStatus).toHaveTextContent(
      "All compliance requirements are verified for this release.",
    );

    await userEvent.click(canvas.getByRole("checkbox", { name: "SMS notifications" }));
    await expect(canvas.getByRole("checkbox", { name: "SMS notifications" })).toBeChecked();
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <Checkbox defaultChecked color="primary">
          Primary (Default)
        </Checkbox>
        <Checkbox defaultChecked color="secondary">
          Secondary
        </Checkbox>
        <Checkbox defaultChecked color="success">
          Success
        </Checkbox>
        <Checkbox defaultChecked color="warning">
          Warning
        </Checkbox>
        <Checkbox defaultChecked color="danger">
          Danger
        </Checkbox>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <Checkbox defaultChecked="indeterminate" color="primary">
          Primary Indeterminate
        </Checkbox>
        <Checkbox defaultChecked="indeterminate" color="success">
          Success Indeterminate
        </Checkbox>
        <Checkbox defaultChecked="indeterminate" color="warning">
          Warning Indeterminate
        </Checkbox>
        <Checkbox defaultChecked="indeterminate" color="danger">
          Danger Indeterminate
        </Checkbox>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("checkbox", { name: "Primary (Default)" })).toBeChecked();
    expect(canvas.getByRole("checkbox", { name: "Success" })).toBeChecked();
    expect(canvas.getByRole("checkbox", { name: "Danger" })).toBeChecked();
    expect(canvas.getByRole("checkbox", { name: "Primary Indeterminate" })).toBePartiallyChecked();
  },
};
