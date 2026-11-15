import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { Button, Form, Switch, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Switch",
  component: Switch,
  args: {
    children: "Live review updates",
    defaultSelected: false,
    name: "liveUpdates",
    value: "enabled",
  },
  argTypes: {
    children: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    isSelected: { control: "boolean" },
    defaultSelected: { control: "boolean" },
    isReadOnly: { control: "boolean" },
    isDisabled: { control: "boolean" },
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
          "Switch toggles a setting immediately; these examples change only local preview state. A setting applied only by Save should use Checkbox or explicitly describe a draft. RAC owns the native checkbox input with role switch: pointer activation and Space toggle it, not Enter. Only sm and md are supported; md is the default. Read-only switches remain focusable and submit when selected; disabled switches are omitted from FormData. This label-root wrapper supports isSelected/defaultSelected, onChange, name/value, inputRef, label ref, render-prop children, className, style, and native label rendering. It does not support isRequired, isInvalid, validate, validationBehavior, or mixed state. Render callbacks must preserve the native label and its props, and ref focus must target inputRef rather than the label.",
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onChange: fn() },
  render: (args) => (
    <div className="field-story-stack">
      <Switch {...args} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="field-story-grid">
      <div className="field-story-case">
        <h2>Editable</h2>
        <Switch>Editable updates off</Switch>
        <Switch defaultSelected>Editable updates on</Switch>
      </div>
      <div className="field-story-case">
        <h2>Read-only</h2>
        <Switch isReadOnly>Read-only updates off</Switch>
        <Switch isReadOnly defaultSelected>
          Read-only updates on
        </Switch>
      </div>
      <div className="field-story-case">
        <h2>Unavailable</h2>
        <Switch isDisabled>Unavailable updates off</Switch>
        <Switch isDisabled defaultSelected>
          Unavailable updates on
        </Switch>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const name of [
      "Editable updates off",
      "Read-only updates off",
      "Unavailable updates off",
    ]) {
      await expect(canvas.getByRole("switch", { name })).not.toBeChecked();
    }
    for (const name of ["Editable updates on", "Read-only updates on", "Unavailable updates on"]) {
      await expect(canvas.getByRole("switch", { name })).toBeChecked();
    }
    for (const name of ["Read-only updates off", "Read-only updates on"]) {
      const input = canvas.getByRole("switch", { name });
      await expect(input).not.toBeDisabled();
      await expect(input.closest("label")).toHaveAttribute("data-readonly", "true");
    }
    for (const name of ["Unavailable updates off", "Unavailable updates on"]) {
      await expect(canvas.getByRole("switch", { name })).toBeDisabled();
    }
  },
};

export const SizesAndKeyboard: Story = {
  render: () => (
    <div className="field-story-stack">
      <p>Tab focuses each native switch. Space toggles it; Enter is not a switch activation key.</p>
      <Switch size="sm">Small live updates</Switch>
      <Switch>Default live updates</Switch>
      <Switch size="md">Medium live updates</Switch>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const small = canvas.getByRole<HTMLInputElement>("switch", { name: "Small live updates" });
    const defaultSize = canvas.getByRole<HTMLInputElement>("switch", {
      name: "Default live updates",
    });
    const medium = canvas.getByRole<HTMLInputElement>("switch", { name: "Medium live updates" });
    await expect(small.closest("label")).toHaveAttribute("data-size", "sm");
    await expect(defaultSize.closest("label")).toHaveAttribute("data-size", "md");
    await expect(medium.closest("label")).toHaveAttribute("data-size", "md");
    await expect(small).toHaveAttribute("type", "checkbox");
    await userEvent.click(small);
    await expect(small).toBeChecked();
    await userEvent.keyboard(" ");
    await expect(small).not.toBeChecked();
    await expect(small).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(small).not.toBeChecked();
    await userEvent.tab();
    await expect(defaultSize).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(defaultSize).toBeChecked();
    await userEvent.tab();
    await expect(medium).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(medium).toBeChecked();
  },
};

function ValueExamples() {
  const [liveUpdates, setLiveUpdates] = useState(true);
  return (
    <div className="field-story-stack">
      <p>Changes apply immediately to this local preview. RAC owns the uncontrolled setting.</p>
      <Switch isSelected={liveUpdates} onChange={setLiveUpdates}>
        Controlled live updates
      </Switch>
      <output aria-label="Live updates setting">{liveUpdates ? "On" : "Off"}</output>
      <Switch defaultSelected>Uncontrolled comment alerts</Switch>
    </div>
  );
}

export const ControlledAndUncontrolled: Story = {
  render: ValueExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const controlled = canvas.getByRole("switch", { name: "Controlled live updates" });
    const uncontrolled = canvas.getByRole("switch", { name: "Uncontrolled comment alerts" });
    await userEvent.click(controlled);
    await expect(controlled).not.toBeChecked();
    await expect(canvas.getByRole("status", { name: "Live updates setting" })).toHaveTextContent(
      "Off",
    );
    await userEvent.click(uncontrolled);
    await expect(uncontrolled).not.toBeChecked();
    await userEvent.keyboard(" ");
    await expect(uncontrolled).toBeChecked();
    await expect(controlled).not.toBeChecked();
    await userEvent.click(controlled);
    await expect(canvas.getByRole("status", { name: "Live updates setting" })).toHaveTextContent(
      "On",
    );
    await expect(controlled).toBeChecked();
  },
};

function ComposedSettings() {
  const label = useRef<HTMLLabelElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState("");
  const [refs, setRefs] = useState("");
  return (
    <Form
      aria-label="Current review settings"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(JSON.stringify(Array.from(new FormData(event.currentTarget).entries())));
      }}
    >
      <p>
        These settings change immediately in this local preview. Read FormData only snapshots the
        native values; it does not save or apply them.
      </p>
      <Switch
        ref={label}
        inputRef={input}
        name="liveUpdates"
        value="enabled"
        defaultSelected
        className={({ isSelected }) => (isSelected ? "selected-setting" : "setting-option")}
        style={({ isSelected }) => ({ fontWeight: isSelected ? 600 : 400 })}
        render={(props) => (
          // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- RAC supplies the native input through props.children.
          <label {...props} data-composed-switch="true" />
        )}
      >
        {({ isSelected }) => (
          <>
            Live review updates <span aria-hidden="true">{isSelected ? "(On)" : "(Off)"}</span>
          </>
        )}
      </Switch>
      <Switch name="managedUpdates" value="enabled" isReadOnly defaultSelected>
        Owner-managed updates
      </Switch>
      <Switch name="managedSounds" value="enabled" isReadOnly>
        Owner-managed sounds
      </Switch>
      <Switch name="archivedUpdates" value="enabled" isDisabled defaultSelected>
        Archived review updates
      </Switch>
      <Switch name="archivedSounds" value="enabled" isDisabled>
        Archived review sounds
      </Switch>
      <Button type="submit">Read current settings</Button>
      <Button
        type="button"
        variant="ghost"
        onPress={() => {
          setRefs(`${label.current?.tagName}/${input.current?.tagName}`);
          input.current?.focus();
        }}
      >
        Focus live updates
      </Button>
      <output aria-label="Settings FormData">{submitted}</output>
      <output aria-label="Native switch refs">{refs}</output>
    </Form>
  );
}

export const CompositionAndFormData: Story = {
  render: ComposedSettings,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const live = canvas.getByRole<HTMLInputElement>("switch", { name: "Live review updates" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus live updates" }));
    await expect(live).toHaveFocus();
    await waitFor(() =>
      expect(canvas.getByRole("status", { name: "Native switch refs" })).toHaveTextContent(
        "LABEL/INPUT",
      ),
    );
    await expect(live).toHaveAttribute("type", "checkbox");
    await expect(live).toHaveAttribute("name", "liveUpdates");
    await expect(live).toHaveAttribute("value", "enabled");
    await expect(live.closest("label")).toHaveAttribute("data-composed-switch", "true");
    await expect(live.closest("label")).toHaveClass("hashti-switch", "selected-setting");
    await expect(live.closest("label")).toHaveStyle({ fontWeight: 600 });

    const readonlyOn = canvas.getByRole<HTMLInputElement>("switch", {
      name: "Owner-managed updates",
    });
    const readonlyOff = canvas.getByRole<HTMLInputElement>("switch", {
      name: "Owner-managed sounds",
    });
    for (const control of [readonlyOn, readonlyOff]) {
      await userEvent.tab();
      await expect(control).toHaveFocus();
      await expect(control).not.toBeDisabled();
      await userEvent.click(control);
      await expect(control).toHaveFocus();
      await expect(readonlyOn).toBeChecked();
      await expect(readonlyOff).not.toBeChecked();
      await userEvent.keyboard(" ");
      await expect(control).toHaveFocus();
      await expect(readonlyOn).toBeChecked();
      await expect(readonlyOff).not.toBeChecked();
    }
    const disabledOn = canvas.getByRole("switch", { name: "Archived review updates" });
    const disabledOff = canvas.getByRole("switch", { name: "Archived review sounds" });
    await expect(disabledOn).toBeDisabled();
    await expect(disabledOn).toBeChecked();
    await expect(disabledOff).toBeDisabled();
    await expect(disabledOff).not.toBeChecked();
    const submit = canvas.getByRole("button", { name: "Read current settings" });
    const output = canvas.getByRole("status", { name: "Settings FormData" });
    await userEvent.tab();
    await expect(submit).toHaveFocus();
    await userEvent.click(submit);
    await expect(output).toHaveTextContent(
      JSON.stringify([
        ["liveUpdates", "enabled"],
        ["managedUpdates", "enabled"],
      ]),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Focus live updates" }));
    await userEvent.keyboard(" ");
    await expect(live).not.toBeChecked();
    await expect(live.closest("label")).toHaveClass("hashti-switch", "setting-option");
    await expect(live.closest("label")).toHaveStyle({ fontWeight: 400 });
    await userEvent.click(submit);
    await expect(output).toHaveTextContent(JSON.stringify([["managedUpdates", "enabled"]]));
    await expect(readonlyOn).toBeChecked();
  },
};

function LocalizedSettings() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} locale="de-DE" className="field-story-stack field-story-narrow">
        <p>Die Einstellung gilt sofort für diese lokale Vorschau.</p>
        <Switch defaultSelected>
          Benachrichtigungen über Änderungen und Kommentare im gemeinsamen Arbeitsbereich{" "}
          <bdi dir="ltr">WS-1042</bdi> sofort anzeigen
        </Switch>
      </Theme>
      <Theme theme={theme} locale="fa-IR" className="field-story-stack field-story-narrow">
        <p>این تنظیم در همین پیش‌نمایش اعمال می‌شود.</p>
        <Switch defaultSelected>
          نمایش فوری پیام‌های تغییرها و نظرهای تیم برای فضای کاری <bdi dir="ltr">WS-1042</bdi>
        </Switch>
      </Theme>
      <Theme theme={theme} locale="ar" className="field-story-stack field-story-narrow">
        <p>يُطبّق هذا الإعداد فورًا في هذه المعاينة المحلية.</p>
        <Switch defaultSelected>
          عرض رسائل التغييرات وتعليقات الفريق فورًا في مساحة العمل <bdi dir="ltr">WS-1042</bdi>
        </Switch>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: LocalizedSettings,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [name, locale, direction] of [
      [
        "Benachrichtigungen über Änderungen und Kommentare im gemeinsamen Arbeitsbereich WS-1042 sofort anzeigen",
        "de-DE",
        "ltr",
      ],
      ["نمایش فوری پیام‌های تغییرها و نظرهای تیم برای فضای کاری WS-1042", "fa-IR", "rtl"],
      ["عرض رسائل التغييرات وتعليقات الفريق فورًا في مساحة العمل WS-1042", "ar", "rtl"],
    ] as const) {
      const control = canvas.getByRole<HTMLInputElement>("switch", { name });
      const label = control.closest<HTMLLabelElement>("label")!;
      await expect(label.closest("[lang]")).toHaveAttribute("lang", locale);
      await expect(label.closest("[lang]")).toHaveAttribute("dir", direction);
      const identifier = within(label).getByText("WS-1042");
      await expect(identifier.tagName).toBe("BDI");
      await expect(identifier).toHaveAttribute("dir", "ltr");
      for (const part of [label, label.querySelector<HTMLElement>(":scope > span:last-child")!]) {
        await expect(part).toBeVisible();
        await expect(part.scrollWidth).toBeLessThanOrEqual(part.clientWidth + 1);
        await expect(part.scrollHeight).toBeLessThanOrEqual(part.clientHeight + 1);
      }
    }
    const documentRoot = canvasElement.ownerDocument.documentElement;
    await expect(documentRoot.scrollWidth).toBeLessThanOrEqual(documentRoot.clientWidth + 1);
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
      <Switch defaultSelected color="primary">
        Primary
      </Switch>
      <Switch defaultSelected color="secondary">
        Secondary
      </Switch>
      <Switch defaultSelected color="success">
        Success
      </Switch>
      <Switch defaultSelected color="warning">
        Warning
      </Switch>
      <Switch defaultSelected color="danger">
        Danger
      </Switch>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("switch", { name: "Primary" })).toBeChecked();
    expect(canvas.getByRole("switch", { name: "Success" })).toBeChecked();
    expect(canvas.getByRole("switch", { name: "Danger" })).toBeChecked();
  },
};
