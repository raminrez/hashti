"use client";

import { Fragment, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { Button, Icon, Theme, useTheme, type ButtonProps, type ButtonVariant } from "@hashti/react";
import "./actions.css";

const variants = [
  "primary",
  "secondary",
  "danger",
  "ghost",
  "outline",
] as const satisfies readonly ButtonVariant[];

const meta = {
  title: "Actions/Button",
  component: Button,
  args: {
    children: "Save changes",
    onClick: fn(),
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: [undefined, "sm", "md", "lg"] },
    children: { control: "text" },
    iconOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    pendingLabel: { control: "text" },
    agentConfirm: { control: "text" },
    "aria-label": { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Five core choices: primary for the main action, secondary for supporting actions, ghost for quiet actions, outline for bordered quiet actions, and danger for destructive actions. Frame defaults to a 44px minimum. Return a Promise from onClick to keep the button pending until it settles; pendingLabel is what screen readers hear after a second.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function VariantButtons({
  variants: choices = variants,
  ...args
}: ButtonProps & { variants?: readonly ButtonVariant[] }) {
  return (
    <dl className="action-story-matrix">
      {choices.map((variant) => (
        <Fragment key={variant}>
          <dt>
            <code>{variant}</code>
          </dt>
          <dd>
            <Button
              {...args}
              variant={variant}
              pendingLabel={
                args.pendingLabel ??
                (variant === "danger" ? "Deleting draft" : "Saving changes")
              }
            >
              {variant === "danger" ? "Delete draft" : "Save changes"}
            </Button>
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}

export const Variants: Story = {
  render: VariantButtons,
  parameters: { controls: { exclude: ["variant", "children"] } },
};

export const Sizes: Story = {
  render: (args) => (
    <dl className="action-story-matrix">
      {([undefined, "sm", "md", "lg"] as const).map((size) => (
        <Fragment key={size ?? "default"}>
          <dt>
            <code>{size ?? "default (omitted)"}</code>
          </dt>
          <dd>
            <Button {...args} size={size} />
          </dd>
        </Fragment>
      ))}
    </dl>
  ),
  parameters: {
    controls: { exclude: ["size"] },
    docs: {
      description: {
        story:
          "Frame: default 44px; sm 32px, md 44px, lg 48px. These are scalable minimums, so labels and text resizing can increase the height.",
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    variant: "ghost",
    iconOnly: true,
    "aria-label": "Copy workspace link",
    children: <Icon name="copy" />,
  },
  parameters: { controls: { exclude: ["children"] } },
  play: async ({ canvasElement, args, userEvent }) => {
    const button = within(canvasElement).getByRole("button", { name: "Copy workspace link" });
    await expect(button).toHaveAccessibleName("Copy workspace link");
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="action-story-stack">
      <p>These actions are unavailable until you have permission to edit the draft.</p>
      <VariantButtons {...args} />
    </div>
  ),
  parameters: { controls: { exclude: ["variant", "children", "disabled"] } },
  play: async ({ canvasElement, args, userEvent }) => {
    for (const button of within(canvasElement).getAllByRole("button")) {
      await expect(button).toBeDisabled();
      await userEvent.click(button);
    }
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const KeyboardAndPointer: Story = {
  args: { children: "Run action", onClick: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const button = within(canvasElement).getByRole("button", { name: "Run action" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("[Space>]");
    await expect(args.onClick).not.toHaveBeenCalled();
    await userEvent.keyboard("[/Space]");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Pending: Story = {
  args: {
    children: "Save draft",
    pendingLabel: "Saving draft",
  },
  render: (args) => <Button {...args} onClick={() => wait(2000)} />,
  parameters: { controls: { exclude: ["onClick"] } },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save draft" });
    const before = button.getBoundingClientRect();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    // ui-sdk drives pending from the handler's Promise: busy, unpressable, focused.
    await waitFor(() => expect(button).toHaveAttribute("data-pending"));
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toHaveAttribute("aria-disabled", "true");
    await expect(button).toHaveTextContent("Save draft");
    await expect(button).toHaveFocus();
    await expect(within(button).getByText("Save draft")).toBeInTheDocument();
    expect(button.querySelector(".hashti-spinner")).not.toBeNull();
    const pendingRect = button.getBoundingClientRect();
    await expect([pendingRect.width, pendingRect.height]).toEqual([before.width, before.height]);
    await userEvent.click(button);
    await waitFor(() => expect(button).not.toHaveAttribute("data-pending"), {
      timeout: 4000,
    });
  },
};

function SaveExample(args: ButtonProps) {
  const [attempts, setAttempts] = useState(0);
  const [saved, setSaved] = useState(false);

  return (
    <div className="action-story-stack">
      <p>Local example: the first save fails; the next succeeds. No request leaves this page.</p>
      <Button
        {...args}
        pendingLabel="Saving draft"
        onClick={async () => {
          const attempt = attempts + 1;
          setAttempts(attempt);
          setSaved(false);
          await wait(600);
          if (attempt === 1) throw new Error("The first example request fails.");
          setSaved(true);
        }}
      >
        {attempts > 0 && !saved ? "Try again" : "Save draft"}
      </Button>
      <p role="status">{saved ? "Draft saved." : ""}</p>
    </div>
  );
}

export const SaveAndRetry: Story = {
  args: { children: "Save draft" },
  render: SaveExample,
  parameters: {
    controls: { exclude: ["children", "disabled"] },
    docs: {
      description: {
        story:
          "ui-sdk keeps the button pending while the handler's Promise runs and clears the failure on the next press. Keep the label stable; the announcement says it is working.",
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => expect(button).toHaveTextContent("Try again"));
    await userEvent.click(button);
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("Draft saved."));
  },
};

export const AgentConfirm: Story = {
  args: {
    variant: "danger",
    children: "Delete workspace",
    agentConfirm: "Permanently deletes the workspace and all of its projects",
  },
  parameters: {
    controls: { exclude: ["variant", "children"] },
    docs: {
      description: {
        story:
          "agentConfirm emits ui-sdk's data-agent-confirm mark: an agent sees the sentence in its snapshot and must wait for a person before pressing.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Delete workspace" });
    await expect(button).toHaveAttribute(
      "data-agent-confirm",
      "Permanently deletes the workspace and all of its projects",
    );
  },
};

export const AsLink: Story = {
  args: {
    variant: "outline",
    children: "Publishing guidelines",
    render: <a href="#link-guidelines" />,
  },
  parameters: {
    controls: { exclude: ["render", "children"] },
    docs: {
      description: {
        story: "render swaps the element; the button look and behavior stay. See the Link stories for prose links.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Publishing guidelines" });
    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("href", "#link-guidelines");
  },
};

function CustomButton(args: ButtonProps) {
  return (
    <div className="action-story-row">
      <Button
        {...args}
        className="action-story-custom-button"
      />
      <Button
        variant="ghost"
        onClick={() => document.querySelector<HTMLButtonElement>(".action-story-custom-button")?.focus()}
      >
        Focus save action
      </Button>
    </div>
  );
}

export const Customization: Story = {
  args: { variant: "secondary", children: "Save draft" },
  render: CustomButton,
  parameters: { controls: { exclude: ["children", "iconOnly"] } },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save draft" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus save action" }));
    await expect(button).toHaveFocus();
    await expect(button).toHaveClass("hashti-button", "action-story-custom-button");
  },
};

function LongLabelExample(args: ButtonProps) {
  const { theme } = useTheme();
  return (
    <Theme theme={theme} lang="de-DE" className="action-story-narrow">
      <Button {...args}>
        Projektbenachrichtigungseinstellungen für diesen Arbeitsbereich speichern
      </Button>
    </Theme>
  );
}

export const LongLabel: Story = {
  args: { pendingLabel: "Änderungen werden gespeichert" },
  render: LongLabelExample,
  parameters: { controls: { exclude: ["children", "iconOnly"] } },
};

function RightToLeftExample(args: ButtonProps) {
  const { theme } = useTheme();
  return (
    <div className="action-story-stack action-story-narrow">
      <Theme theme={theme} lang="fa-IR" dir="rtl" className="action-story-stack">
        <p>
          فارسی · فضای کاری <bdi dir="ltr">WS-1042</bdi>
        </p>
        <Button {...args} pendingLabel="در حال ذخیرهٔ تغییرات">
          ذخیرهٔ تغییرات تنظیمات فضای کاری <Icon name="chevronLeft" />
        </Button>
      </Theme>
      <Theme theme={theme} lang="ar" dir="rtl" className="action-story-stack">
        <p>
          العربية · مساحة العمل <bdi dir="ltr">WS-1042</bdi>
        </p>
        <Button {...args} pendingLabel="جارٍ حفظ التغييرات">
          حفظ تغييرات إعدادات مساحة العمل <Icon name="chevronLeft" />
        </Button>
      </Theme>
    </div>
  );
}

export const RightToLeft: Story = {
  render: RightToLeftExample,
  parameters: { controls: { exclude: ["children", "iconOnly", "pendingLabel"] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const persian = canvas.getByRole("button", { name: /ذخیرهٔ تغییرات/ });
    const arabic = canvas.getByRole("button", { name: /حفظ تغييرات/ });
    await expect(persian).toBeInTheDocument();
    await expect(arabic).toBeInTheDocument();
    await expect(persian.closest("[dir='rtl']")).not.toBeNull();
    await expect(arabic.closest("[dir='rtl']")).not.toBeNull();
  },
};
