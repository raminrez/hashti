import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Theme,
  useTheme,
  type FormProps,
} from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Checkbox",
  component: Checkbox,
  args: {
    children: "Include review notes",
    defaultSelected: false,
    name: "reviewNotes",
    value: "included",
  },
  argTypes: {
    children: { control: "text" },
    isSelected: { control: "boolean" },
    defaultSelected: { control: "boolean" },
    isIndeterminate: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    isInvalid: { control: "boolean" },
    validationBehavior: { control: "select", options: ["native", "aria"] },
    name: { control: "text" },
    value: { control: "text" },
    inputRef: { control: false },
    ref: { control: false },
    render: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Checkbox represents an independent choice or a draft preference applied by Save. Pointer activation and Space toggle the native checkbox. The root ref targets a label; inputRef targets the native input. RAC children, class/style callbacks, and label render props remain supported. There is no size prop. CheckboxGroup owns its member value array, required/read-only state, guidance, and detached group recovery. Named members submit repeated entries: use FormData.getAll(), not Object.fromEntries(). isIndeterminate presents mixed state without changing member values or submission; derive a select-all checkbox from those values. Read-only selected choices submit; disabled choices do not.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onChange: fn() },
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
        <Checkbox defaultSelected>Review notes on</Checkbox>
        <Checkbox isIndeterminate>Some review topics selected</Checkbox>
        <Checkbox isReadOnly defaultSelected>
          Owner-managed audit record
        </Checkbox>
        <Checkbox isDisabled defaultSelected>
          Archived review notes
        </Checkbox>
        <Checkbox isDisabled isIndeterminate>
          Unavailable mixed review topics
        </Checkbox>
      </div>
      <div className="field-story-case">
        <h2>Standalone recovery</h2>
        <Checkbox
          isRequired
          isInvalid
          validationBehavior="aria"
          aria-describedby="checkbox-state-error"
        >
          I confirm the review requirements (required)
        </Checkbox>
        <p id="checkbox-state-error">Confirm the review requirements before continuing.</p>
      </div>
      <CheckboxGroup
        label="Channels requiring correction"
        description="Choose where review updates arrive. The unavailable channel cannot be changed."
        defaultValue={["email", "archived"]}
        isInvalid
        errorMessage="Email delivery is unavailable for this review. Choose in-app updates instead."
      >
        <Checkbox value="email">Email updates</Checkbox>
        <Checkbox value="inApp">In-app updates</Checkbox>
        <Checkbox value="archived" isDisabled>
          Archived updates
        </Checkbox>
      </CheckboxGroup>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
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
    await userEvent.click(readonly);
    await userEvent.keyboard(" ");
    await expect(readonly).toHaveFocus();
    await expect(readonly).toBeChecked();
    const confirmation = canvas.getByRole("checkbox", {
      name: "I confirm the review requirements (required)",
    });
    await expect(confirmation).toBeRequired();
    await expect(confirmation).toHaveAttribute("aria-invalid", "true");
    await expect(confirmation).toHaveAccessibleDescription(
      "Confirm the review requirements before continuing.",
    );
    const group = canvas.getByRole("group", { name: "Channels requiring correction" });
    await expect(group).toHaveAttribute("data-invalid");
    await expect(group).toHaveAccessibleDescription(
      "Choose where review updates arrive. The unavailable channel cannot be changed. Email delivery is unavailable for this review. Choose in-app updates instead.",
    );
    await expect(within(group).getByRole("checkbox", { name: "Email updates" })).toBeChecked();
    await expect(within(group).getByRole("checkbox", { name: "Archived updates" })).toBeChecked();
  },
};

function ValueExamples() {
  const [included, setIncluded] = useState(true);
  return (
    <div className="field-story-stack">
      <Checkbox isSelected={included} onChange={setIncluded}>
        Controlled review notes
      </Checkbox>
      <output aria-label="Review notes draft">{included ? "Included" : "Not included"}</output>
      <Checkbox defaultSelected>Uncontrolled handoff checklist</Checkbox>
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
        isSelected={selected.length === topics.length}
        isIndeterminate={selected.length > 0 && selected.length < topics.length}
        onChange={(includeAll) => setSelected(includeAll ? topics.map((topic) => topic.value) : [])}
      >
        Include all review topics
      </Checkbox>
      <CheckboxGroup
        id="review-topic-selection"
        label="Included review topics"
        description="Select individual topics, or include them all. These are draft report preferences."
        value={selected}
        onChange={setSelected}
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

const channelHint =
  "Choose where review updates arrive. These choices remain here during recovery.";
const missingChannels = "Choose at least one review channel.";
const returnedChannelError = "In-app delivery is unavailable. Remove it or choose another channel.";

function ComposedChannels() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLLabelElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<FormProps["validationErrors"]>({});
  const [submitted, setSubmitted] = useState("");
  const [channels, setChannels] = useState("");
  const [refs, setRefs] = useState("");
  return (
    <Form
      aria-label="Review channel form"
      className="field-story-stack"
      validationBehavior="native"
      validationErrors={validationErrors}
      onSubmit={(event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setSubmitted(JSON.stringify(Array.from(values.entries())));
        setChannels(JSON.stringify(values.getAll("channels")));
      }}
      onReset={() => {
        setValidationErrors({});
        setSubmitted("");
        setChannels("");
      }}
    >
      <p>
        Read the draft's native entries without saving it. Apply a returned, name-keyed error to try
        recovery; no request leaves this page.
      </p>
      <CheckboxGroup.Root
        ref={root}
        name="channels"
        isRequired
        render={(props) => <div {...props} data-composed-root="true" />}
      >
        <CheckboxGroup.Label>Review channels</CheckboxGroup.Label>
        <CheckboxGroup.Description>{channelHint}</CheckboxGroup.Description>
        <CheckboxGroup.Checkbox
          ref={label}
          inputRef={input}
          value="email"
          className={({ isSelected }) => (isSelected ? "selected-channel" : "channel-option")}
          style={({ isSelected }) => ({ fontWeight: isSelected ? 600 : 400 })}
          render={(props) => (
            // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- RAC supplies the native input through props.children.
            <label {...props} data-composed-checkbox="true" />
          )}
        >
          {({ isSelected }) => (
            <>
              Email updates <span aria-hidden="true">{isSelected ? "(selected)" : ""}</span>
            </>
          )}
        </CheckboxGroup.Checkbox>
        <CheckboxGroup.Checkbox value="inApp">In-app updates</CheckboxGroup.Checkbox>
        <CheckboxGroup.Help>
          <CheckboxGroup.ErrorMessage>
            {({ validationDetails, validationErrors }) =>
              validationDetails.valueMissing ? missingChannels : validationErrors.join(" ")
            }
          </CheckboxGroup.ErrorMessage>
        </CheckboxGroup.Help>
      </CheckboxGroup.Root>
      <Checkbox name="audit" value="retained" isReadOnly defaultSelected>
        Owner-managed audit record
      </Checkbox>
      <Checkbox name="archived" value="included" isDisabled defaultSelected>
        Archived review notes
      </Checkbox>
      <Button type="submit">Read channel values</Button>
      <Button
        type="button"
        variant="ghost"
        onPress={() => {
          setRefs(`${root.current?.tagName}/${label.current?.tagName}/${input.current?.tagName}`);
          input.current?.focus();
        }}
      >
        Focus email updates
      </Button>
      <Button
        type="button"
        variant="ghost"
        onPress={() => setValidationErrors({ channels: returnedChannelError })}
      >
        Apply returned channel error
      </Button>
      <Button type="reset" variant="ghost">
        Reset channels
      </Button>
      <output aria-label="Channel FormData">{submitted}</output>
      <output aria-label="Repeated channel values">{channels}</output>
      <output aria-label="Native checkbox refs">{refs}</output>
    </Form>
  );
}

export const CompositionAndFormData: Story = {
  render: ComposedChannels,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("group", { name: "Review channels (required)" });
    const email = within(group).getByRole<HTMLInputElement>("checkbox", { name: "Email updates" });
    const inApp = within(group).getByRole("checkbox", { name: "In-app updates" });
    const description = within(group).getByText(channelHint);
    const descriptionId = description.id;
    const submit = canvas.getByRole("button", { name: "Read channel values" });
    const output = canvas.getByRole("status", { name: "Channel FormData" });
    const repeated = canvas.getByRole("status", { name: "Repeated channel values" });
    await expect(email).toHaveAttribute("type", "checkbox");
    await expect(email).toBeRequired();
    await userEvent.click(submit);
    await waitFor(() => expect(email).toHaveFocus());
    await expect(canvas.getByText(missingChannels)).toBeVisible();
    await expect(group).toHaveAccessibleDescription(`${channelHint} ${missingChannels}`);
    await expect(output).toBeEmptyDOMElement();
    await userEvent.click(canvas.getByRole("button", { name: "Reset channels" }));
    await waitFor(() => expect(canvas.queryByText(missingChannels)).not.toBeInTheDocument());
    await expect(email).not.toBeChecked();
    await expect(inApp).not.toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Focus email updates" }));
    await expect(email).toHaveFocus();
    await expect(canvas.getByRole("status", { name: "Native checkbox refs" })).toHaveTextContent(
      "DIV/LABEL/INPUT",
    );
    await expect(group).toHaveAttribute("data-composed-root", "true");
    await expect(email.closest("label")).toHaveAttribute("data-composed-checkbox", "true");
    await userEvent.keyboard(" ");
    await expect(email.closest("label")).toHaveClass("hashti-checkbox", "selected-channel");
    await expect(email.closest("label")).toHaveStyle({ fontWeight: 600 });
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
    await userEvent.click(canvas.getByRole("button", { name: "Apply returned channel error" }));
    await expect(await canvas.findByText(returnedChannelError)).toBeVisible();
    await expect(group).toHaveAccessibleDescription(`${channelHint} ${returnedChannelError}`);
    await expect(description.id).toBe(descriptionId);
    await expect(email.validity.customError).toBe(true);
    await userEvent.click(submit);
    await waitFor(() => expect(email).toHaveFocus());
    await expect(email).toBeChecked();
    await expect(inApp).toBeChecked();
    await userEvent.click(inApp);
    await waitFor(() => expect(canvas.queryByText(returnedChannelError)).not.toBeInTheDocument());
    await expect(group).not.toHaveAttribute("data-invalid");
    await expect(description).toBeVisible();
    await expect(description.id).toBe(descriptionId);
    await userEvent.click(submit);
    await expect(repeated).toHaveTextContent(JSON.stringify(["email"]));
    await expect(output).toHaveTextContent(
      JSON.stringify([
        ["channels", "email"],
        ["audit", "retained"],
      ]),
    );
  },
};

const translations = [
  {
    locale: "de-DE",
    direction: "ltr",
    necessity: "erforderlich",
    label: "Benachrichtigungen für die gemeinsame Freigabeprüfung",
    description: "Wählen Sie die Nachrichten für den Arbeitsbereich",
    error:
      "Wählen Sie mindestens einen Kanal. Ihre übrigen Angaben bleiben während der Korrektur erhalten.",
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
    error: "حداقل یک روش دریافت را انتخاب کنید. داده‌های دیگر هنگام اصلاح انتخاب حفظ می‌شوند.",
    email: "خلاصهٔ هفتگی و فهرست کارهای باقی‌ماندهٔ مرور تیم با ایمیل فرستاده شوند",
    inApp: "پیام‌های مربوط به مرور تیم در فضای کاری نمایش داده شوند",
  },
  {
    locale: "ar",
    direction: "rtl",
    necessity: "مطلوب",
    label: "رسائل مراجعة المشروع",
    description: "اختر قنوات استلام رسائل المشروع في مساحة العمل",
    error: "اختر قناة واحدة على الأقل. تبقى بياناتك الأخرى محفوظة أثناء تصحيح الاختيار.",
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
          locale={copy.locale}
          className="field-story-stack field-story-narrow"
        >
          <CheckboxGroup
            label={copy.label}
            description={
              <>
                {copy.description} <bdi dir="ltr">WS-1042</bdi>.
              </>
            }
            isRequired
            isInvalid
            errorMessage={copy.error}
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
        ".hashti-field__label, .hashti-field__description, .hashti-field__error, .hashti-checkbox",
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
        <Checkbox defaultSelected color="primary">
          Primary (Default)
        </Checkbox>
        <Checkbox defaultSelected color="secondary">
          Secondary
        </Checkbox>
        <Checkbox defaultSelected color="success">
          Success
        </Checkbox>
        <Checkbox defaultSelected color="warning">
          Warning
        </Checkbox>
        <Checkbox defaultSelected color="danger">
          Danger
        </Checkbox>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <Checkbox isIndeterminate color="primary">
          Primary Indeterminate
        </Checkbox>
        <Checkbox isIndeterminate color="success">
          Success Indeterminate
        </Checkbox>
        <Checkbox isIndeterminate color="warning">
          Warning Indeterminate
        </Checkbox>
        <Checkbox isIndeterminate color="danger">
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
  },
};
