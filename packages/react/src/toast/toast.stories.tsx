import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { createToaster } from "@ui-sdk/react/toast";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "./toast";

// duration: Infinity keeps every toast until dismissed, so the canvas is deterministic.
const logDismiss = fn();

function Demo(args: {
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  maxVisible?: number;
  expanded?: boolean;
}) {
  const [toaster] = useState(() => createToaster({ duration: Infinity }));
  return (
    <>
      <button
        type="button"
        onClick={() =>
          toaster("Changes saved", {
            description: "Q3 report.pdf · just now",
            action: { label: "Undo", onAction: () => undefined },
            onDismiss: logDismiss,
          })
        }
      >
        Save Changes
      </button>
      <ToastRegion
        toaster={toaster}
        side={args.side ?? "bottom"}
        align={args.align ?? "end"}
        maxVisible={args.maxVisible ?? 3}
        expanded={args.expanded ?? false}
      >
        {() => (
          <Toast>
            <div data-slot="stack">
              <ToastTitle />
              <ToastDescription />
            </div>
            <ToastAction data-variant="solid" />
          </Toast>
        )}
      </ToastRegion>
    </>
  );
}

function TypesDemo() {
  const [toaster] = useState(() => createToaster({ duration: Infinity }));
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => toaster.success("Changes saved")}>
          Success
        </button>
        <button
          type="button"
          onClick={() => toaster.info("A new version is available")}
        >
          Info
        </button>
        <button
          type="button"
          onClick={() => toaster.warning("Storage is almost full")}
        >
          Warning
        </button>
        <button
          type="button"
          onClick={() => toaster.error("Couldn't save changes")}
        >
          Error
        </button>
      </div>
      <ToastRegion toaster={toaster}>
        {() => (
          <Toast>
            <div className="hashti-toast__icons">
              <svg
                data-show="success"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  d="M3 8.5 6.5 12 13 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                data-show="error"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span data-show="loading" className="hashti-toast__spinner" />
            </div>
            <ToastTitle />
          </Toast>
        )}
      </ToastRegion>
    </>
  );
}

function DismissDemo() {
  const [toaster] = useState(() => createToaster({ duration: Infinity }));
  return (
    <>
      <button
        type="button"
        onClick={() =>
          toaster("Your session expires in 5 minutes", {
            dismissible: false,
            cancel: { label: "Got It" },
          })
        }
      >
        Session Warning
      </button>
      <ToastRegion toaster={toaster}>
        {(item) => (
          <Toast>
            <ToastTitle />
            {item.cancel && (
              <ToastClose data-variant="solid" action={item.cancel.onCancel}>
                {item.cancel.label}
              </ToastClose>
            )}
          </Toast>
        )}
      </ToastRegion>
    </>
  );
}

const meta = {
  title: "Components/Toast",
  component: ToastRegion,
  tags: ["autodocs"],
  // Overlay: the region portals to document.body, so keep it out of the Docs page flow.
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  args: {
    side: "bottom",
    align: "end",
    maxVisible: 3,
    expanded: false,
  },
  argTypes: {
    side: {
      control: "select",
      options: ["bottom", "top"],
      table: { category: "Appearance" },
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      table: { category: "Appearance" },
    },
    maxVisible: { control: "number", table: { category: "Appearance" } },
    expanded: { control: "boolean", table: { category: "State" } },
    shortcut: { control: false, table: { category: "Events" } },
    toaster: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof ToastRegion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAction: Story = {};

export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => <TypesDemo />,
};

export const UntilDismissed: Story = {
  parameters: { controls: { disable: true } },
  render: () => <DismissDemo />,
};
