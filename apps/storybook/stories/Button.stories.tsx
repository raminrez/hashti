import { Fragment, useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { Button, Icon, Theme, useTheme, type ButtonProps, type ButtonVariant } from "@hashti/react";
import "./actions.css";

const variants = [
  "primary",
  "secondary",
  "ghost",
  "danger",
] as const satisfies readonly ButtonVariant[];
const compatibilityVariants = [
  "tertiary",
  "danger-tertiary",
  "danger-ghost",
] as const satisfies readonly ButtonVariant[];

const meta = {
  title: "Actions/Button",
  component: Button,
  args: {
    children: "Save changes",
    onPress: fn(),
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: [undefined, "sm", "md", "lg"] },
    children: { control: "text" },
    iconOnly: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isPending: { control: "boolean" },
    pendingLabel: { control: "text" },
    "aria-label": { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Four core choices: primary for the main action, secondary for supporting actions, ghost for quiet actions, and danger for destructive actions. Frame defaults to a 44px minimum. Keep action text mounted while pending and localize pendingLabel alongside it.",
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
                (variant.startsWith("danger") ? "Deleting draft" : "Saving changes")
              }
            >
              {variant.startsWith("danger") ? "Delete draft" : "Save changes"}
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

export const CompatibilityVariants: Story = {
  render: (args) => <VariantButtons {...args} variants={compatibilityVariants} />,
  parameters: {
    controls: { exclude: ["variant", "children"] },
    docs: {
      description: {
        story:
          "Existing outlined and quiet-destructive treatments remain supported. Use the four core variants for new Frame interfaces.",
      },
    },
  },
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
          "Frame: default 44px; sm 32px, md 44px, lg 48px, xl 64px, 2xl 80px. These are scalable minimums, so labels and text resizing can increase the height.",
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
    await expect(args.onPress).toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { isDisabled: true },
  render: (args) => (
    <div className="action-story-stack">
      <p>These actions are unavailable until you have permission to edit the draft.</p>
      <VariantButtons {...args} />
    </div>
  ),
  parameters: { controls: { exclude: ["variant", "children", "isDisabled"] } },
  play: async ({ canvasElement, args, userEvent }) => {
    for (const button of within(canvasElement).getAllByRole("button")) {
      await expect(button).toBeDisabled();
      await userEvent.click(button);
    }
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};

export const Pending: Story = {
  args: { isPending: true },
  render: VariantButtons,
  parameters: {
    controls: { exclude: ["variant", "children", "isPending"] },
    docs: {
      description: {
        story:
          "Persistent pending states for inspection. isPending blocks activation without native disabling. Save and retry below demonstrates application-owned request state.",
      },
    },
  },
  play: async ({ canvasElement, args, userEvent }) => {
    const buttons = within(canvasElement).getAllByRole("button");
    await userEvent.tab();
    await expect(buttons[0]).toHaveFocus();
    for (const button of buttons) {
      await expect(button).toHaveAttribute("aria-disabled", "true");
      await expect(button).not.toBeDisabled();
      await expect(within(button).getByRole("progressbar")).toHaveAccessibleName(
        button.textContent?.startsWith("Delete") ? "Deleting draft" : "Saving changes",
      );
      await userEvent.click(button);
      await userEvent.keyboard("{Enter} ");
    }
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};

export const KeyboardAndPointer: Story = {
  args: { children: "Run action", onPress: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const button = within(canvasElement).getByRole("button", { name: "Run action" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute("data-focus-visible");
    await userEvent.keyboard("[Space>]");
    await expect(button).toHaveAttribute("data-pressed");
    await expect(args.onPress).not.toHaveBeenCalled();
    await userEvent.keyboard("[/Space]");
    await expect(button).not.toHaveAttribute("data-pressed");
    await expect(args.onPress).toHaveBeenCalledTimes(1);
    await userEvent.hover(button);
    await expect(button).toHaveAttribute("data-hovered");
    await userEvent.pointer({ target: button, keys: "[MouseLeft>]" });
    await expect(button).toHaveAttribute("data-pressed");
    await expect(args.onPress).toHaveBeenCalledTimes(1);
    await userEvent.pointer({ target: button, keys: "[/MouseLeft]" });
    await expect(button).not.toHaveAttribute("data-pressed");
    await expect(args.onPress).toHaveBeenCalledTimes(2);
    await userEvent.keyboard("{Enter}");
    await expect(args.onPress).toHaveBeenCalledTimes(3);
  },
};

function simulateSave(attempt: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      if (attempt === 1) reject(new Error("The first example request fails."));
      else resolve();
    }, 800);
    signal.addEventListener("abort", abort, { once: true });
  });
}

const saveDraft = fn(simulateSave);

function SaveExample(args: ButtonProps) {
  const [phase, setPhase] = useState<"idle" | "pending" | "error" | "saved">("idle");
  const attempts = useRef(0);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  return (
    <div className="action-story-stack">
      <p>Local example: the first save fails; the next succeeds. No request leaves this page.</p>
      <p>Draft: Weekly review notes</p>
      <Button
        {...args}
        isPending={phase === "pending"}
        onPress={async (event) => {
          args.onPress?.(event);
          const controller = new AbortController();
          request.current = controller;
          setPhase("pending");
          try {
            await saveDraft(++attempts.current, controller.signal);
            if (!controller.signal.aborted) setPhase("saved");
          } catch {
            if (!controller.signal.aborted) setPhase("error");
          }
        }}
      />
      <div className="action-story-feedback">
        {phase === "error" && (
          <p role="alert" className="action-story-error">
            Draft was not saved. It is still here. Choose Save draft to try again.
          </p>
        )}
        <p role="status">{phase === "saved" ? "Draft saved." : ""}</p>
      </div>
    </div>
  );
}

export const SaveAndRetry: Story = {
  args: { children: "Save draft", pendingLabel: "Saving draft", onPress: fn() },
  render: SaveExample,
  parameters: { controls: { exclude: ["children", "isPending", "isDisabled"] } },
  beforeEach: () => {
    saveDraft.mockReset().mockImplementation(simulateSave);
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save draft" });
    let rejectSave: (error: Error) => void = () => {};
    // Control completion explicitly so pending assertions never race the example delay.
    saveDraft.mockReturnValueOnce(
      new Promise<void>((_, reject) => {
        rejectSave = reject;
      }),
    );
    saveDraft.mockResolvedValueOnce();
    const before = button.getBoundingClientRect();
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(button).toHaveAttribute("data-pending");
    await expect(button).toHaveTextContent("Save draft");
    await expect(button).toHaveFocus();
    await expect(
      within(button).getByRole("progressbar", { name: "Saving draft" }),
    ).toBeInTheDocument();
    const pending = button.getBoundingClientRect();
    await expect([pending.width, pending.height]).toEqual([before.width, before.height]);
    await userEvent.click(button);
    await userEvent.keyboard("{Enter} ");
    await expect(saveDraft).toHaveBeenCalledTimes(1);
    await expect(button).toHaveFocus();
    rejectSave(new Error("Example save failed."));
    await expect(await canvas.findByRole("alert")).toHaveTextContent("Draft was not saved.");
    await expect(button).not.toHaveAttribute("data-pending");
    await expect(button).toHaveFocus();
    await expect(canvas.getByText("Draft: Weekly review notes")).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("Draft saved."));
    await expect(saveDraft).toHaveBeenCalledTimes(2);
    await expect(button).toHaveFocus();
  },
};

function CustomButton(args: ButtonProps) {
  return (
    <div className="action-story-row">
      <Button
        {...args}
        className={({ isPressed }) =>
          `action-story-custom-button${isPressed ? " action-story-custom-button--pressed" : ""}`
        }
        style={({ isPressed, defaultStyle }) => ({
          ...defaultStyle,
          borderStyle: isPressed ? "dashed" : "solid",
        })}
        render={(domProps) => <button {...domProps} data-custom-render="true" />}
      >
        {({ isPressed }) => (
          <>
            <Icon name={isPressed ? "check" : "file"} />
            Save draft
          </>
        )}
      </Button>
      {/* No JSX ref: Storybook's source serializer reads element.ref, which React 19 deprecates. */}
      <Button
        variant="ghost"
        onPress={() => document.querySelector<HTMLButtonElement>("[data-custom-render]")?.focus()}
      >
        Focus save action
      </Button>
    </div>
  );
}

export const Customization: Story = {
  args: { variant: "secondary" },
  render: CustomButton,
  parameters: { controls: { exclude: ["children", "iconOnly"] } },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Save draft" });
    await userEvent.click(canvas.getByRole("button", { name: "Focus save action" }));
    await expect(button).toHaveFocus();
    await expect(button).toHaveClass("hashti-button", "action-story-custom-button");
    await expect(button).toHaveAttribute("data-custom-render", "true");
    await userEvent.keyboard("[Space>]");
    await expect(button).toHaveClass("action-story-custom-button--pressed");
    await expect(button).toHaveStyle({ borderStyle: "dashed" });
    await expect(button).toHaveAccessibleName("Save draft");
    await userEvent.keyboard("[/Space]");
    await expect(button).not.toHaveAttribute("data-pressed");
    await expect(button).not.toHaveClass("action-story-custom-button--pressed");
    await expect(button).toHaveStyle({ borderStyle: "solid" });
  },
};

function LongLabelExample(args: ButtonProps) {
  const { theme } = useTheme();
  return (
    <Theme theme={theme} locale="de-DE" className="action-story-narrow">
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
      <Theme theme={theme} locale="fa-IR" className="action-story-stack">
        <p>
          فارسی · فضای کاری <bdi dir="ltr">WS-1042</bdi>
        </p>
        <Button {...args} pendingLabel="در حال ذخیرهٔ تغییرات">
          ذخیرهٔ تغییرات تنظیمات فضای کاری <Icon name="chevronLeft" />
        </Button>
      </Theme>
      <Theme theme={theme} locale="ar" className="action-story-stack">
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
};
