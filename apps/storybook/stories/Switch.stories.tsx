import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { Switch, Theme, useTheme } from "@hashti/react";
import "./fields.css";

const meta = {
  title: "Fields/Switch",
  component: Switch,
  args: {
    children: "Live review updates",
    defaultChecked: false,
    name: "liveUpdates",
    value: "enabled",
  },
  argTypes: {
    children: { control: "text" },
    size: { control: "select", options: ["sm", "md"] },
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    readOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    name: { control: "text" },
    value: { control: "text" },
    color: { control: false },
    render: { control: false },
    ref: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Switch toggles a setting immediately; these examples change only local preview state. A setting applied only by Save should use Checkbox or explicitly describe a draft. ui-sdk renders a role=switch control plus a visually hidden native checkbox input that submits: pointer activation and Space toggle it, not Enter. Only sm and md are supported; md is the default. Read-only switches remain focusable and submit when checked; disabled switches are omitted from FormData. This wrapper supports checked/defaultChecked, onCheckedChange, name/value, size, color, state-function children, className, and style. It does not support required or a mixed state; in an invalid field it picks up data-invalid from the field.",
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { onCheckedChange: fn() },
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
        <Switch defaultChecked>Editable updates on</Switch>
      </div>
      <div className="field-story-case">
        <h2>Read-only</h2>
        <Switch readOnly>Read-only updates off</Switch>
        <Switch readOnly defaultChecked>
          Read-only updates on
        </Switch>
      </div>
      <div className="field-story-case">
        <h2>Unavailable</h2>
        <Switch disabled>Unavailable updates off</Switch>
        <Switch disabled defaultChecked>
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
      const control = canvas.getByRole("switch", { name });
      await expect(control).not.toBeDisabled();
      await expect(control).toHaveAttribute("data-readonly");
    }
    for (const name of ["Unavailable updates off", "Unavailable updates on"]) {
      await expect(canvas.getByRole("switch", { name })).toBeDisabled();
    }
  },
};

export const SizesAndKeyboard: Story = {
  render: () => (
    <div className="field-story-stack">
      <p>Tab focuses each switch control. Space toggles it; Enter is not a switch activation key.</p>
      <Switch size="sm">Small live updates</Switch>
      <Switch>Default live updates</Switch>
      <Switch size="md">Medium live updates</Switch>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const small = canvas.getByRole("switch", { name: "Small live updates" });
    const defaultSize = canvas.getByRole("switch", {
      name: "Default live updates",
    });
    const medium = canvas.getByRole("switch", { name: "Medium live updates" });
    await expect(small).toHaveAttribute("data-size", "sm");
    await expect(defaultSize).toHaveAttribute("data-size", "md");
    await expect(medium).toHaveAttribute("data-size", "md");
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
      <p>Changes apply immediately to this local preview. ui-sdk owns the uncontrolled setting.</p>
      <Switch checked={liveUpdates} onCheckedChange={setLiveUpdates}>
        Controlled live updates
      </Switch>
      <output aria-label="Live updates setting">{liveUpdates ? "On" : "Off"}</output>
      <Switch defaultChecked>Uncontrolled comment alerts</Switch>
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
  const control = useRef<HTMLButtonElement>(null);
  const [submitted, setSubmitted] = useState("");
  const [refs, setRefs] = useState("");
  return (
    <form
      aria-label="Current review settings"
      className="field-story-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(JSON.stringify(Array.from(new FormData(event.currentTarget).entries())));
      }}
    >
      <p>
        These settings change immediately in this local preview. Reading FormData only snapshots
        the native values; it does not save or apply them.
      </p>
      <Switch
        ref={control}
        name="liveUpdates"
        value="enabled"
        defaultChecked
        className={(state) => (state.checked ? "selected-setting" : "setting-option")}
        style={(state) => ({ fontWeight: state.checked ? 600 : 400 })}
      >
        {(state) => (
          <>
            Live review updates <span aria-hidden="true">{state.checked ? "(On)" : "(Off)"}</span>
          </>
        )}
      </Switch>
      <Switch name="managedUpdates" value="enabled" readOnly defaultChecked>
        Owner-managed updates
      </Switch>
      <Switch name="managedSounds" value="enabled" readOnly>
        Owner-managed sounds
      </Switch>
      <Switch name="archivedUpdates" value="enabled" disabled defaultChecked>
        Archived review updates
      </Switch>
      <Switch name="archivedSounds" value="enabled" disabled>
        Archived review sounds
      </Switch>
      <button type="submit">Read current settings</button>
      <button
        type="button"
        onClick={() => {
          setRefs(`${control.current?.tagName}`);
          control.current?.focus();
        }}
      >
        Focus live updates
      </button>
      <output aria-label="Settings FormData">{submitted}</output>
      <output aria-label="Switch control ref">{refs}</output>
    </form>
  );
}

export const CompositionAndFormData: Story = {
  render: ComposedSettings,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const live = canvas.getByRole("switch", { name: "Live review updates" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus live updates" }));
    await expect(live).toHaveFocus();
    await expect(canvas.getByRole("status", { name: "Switch control ref" })).toHaveTextContent(
      "BUTTON",
    );
    await expect(live).toHaveClass("hashti-switch", "selected-setting");
    await expect(live).toHaveStyle({ fontWeight: 600 });
    await expect(live).toHaveAttribute("data-checked");

    const readonlyOn = canvas.getByRole("switch", {
      name: "Owner-managed updates",
    });
    const readonlyOff = canvas.getByRole("switch", {
      name: "Owner-managed sounds",
    });
    for (const toggle of [readonlyOn, readonlyOff]) {
      await expect(toggle).not.toBeDisabled();
      await userEvent.click(toggle);
      await expect(readonlyOn).toBeChecked();
      await expect(readonlyOff).not.toBeChecked();
      await userEvent.keyboard(" ");
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
    await expect(live).toHaveClass("hashti-switch", "setting-option");
    await expect(live).toHaveStyle({ fontWeight: 400 });
    await userEvent.click(submit);
    await expect(output).toHaveTextContent(JSON.stringify([["managedUpdates", "enabled"]]));
    await expect(readonlyOn).toBeChecked();
  },
};

function LocalizedSettings() {
  const { theme } = useTheme();
  return (
    <div className="field-story-grid">
      <Theme theme={theme} lang="de-DE" className="field-story-stack field-story-narrow">
        <p>Die Einstellung gilt sofort für diese lokale Vorschau.</p>
        <Switch defaultChecked>
          Benachrichtigungen über Änderungen und Kommentare im gemeinsamen Arbeitsbereich{" "}
          <bdi dir="ltr">WS-1042</bdi> sofort anzeigen
        </Switch>
      </Theme>
      <Theme theme={theme} lang="fa-IR" dir="rtl" className="field-story-stack field-story-narrow">
        <p>این تنظیم در همین پیش‌نمایش اعمال می‌شود.</p>
        <Switch defaultChecked>
          نمایش فوری پیام‌های تغییرها و نظرهای تیم برای فضای کاری <bdi dir="ltr">WS-1042</bdi>
        </Switch>
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl" className="field-story-stack field-story-narrow">
        <p>يُطبّق هذا الإعداد فورًا في هذه المعاينة المحلية.</p>
        <Switch defaultChecked>
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
      const control = canvas.getByRole("switch", { name });
      await expect(control.closest("[lang]")).toHaveAttribute("lang", locale);
      await expect(control.closest("[lang]")).toHaveAttribute("dir", direction);
      const identifier = within(control).getByText("WS-1042");
      await expect(identifier.tagName).toBe("BDI");
      await expect(identifier).toHaveAttribute("dir", "ltr");
      await expect(control).toBeVisible();
      await expect(control.scrollWidth).toBeLessThanOrEqual(control.clientWidth + 1);
      await expect(control.scrollHeight).toBeLessThanOrEqual(control.clientHeight + 1);
    }
    const documentRoot = canvasElement.ownerDocument.documentElement;
    await expect(documentRoot.scrollWidth).toBeLessThanOrEqual(documentRoot.clientWidth + 1);
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
      <Switch defaultChecked color="primary">
        Primary
      </Switch>
      <Switch defaultChecked color="secondary">
        Secondary
      </Switch>
      <Switch defaultChecked color="success">
        Success
      </Switch>
      <Switch defaultChecked color="warning">
        Warning
      </Switch>
      <Switch defaultChecked color="danger">
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
