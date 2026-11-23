import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { createToaster } from "@ui-sdk/react/toast";
import { Button } from "../button/button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "./toast";

// duration: Infinity keeps every toast until dismissed, so the canvas is deterministic.
// Module-level toasters fire once at load, so every story renders its toasts
// without needing a click first.
const logDismiss = fn();

const demoToaster = createToaster({ duration: Infinity });
demoToaster("Changes saved", {
  description: "Q3 report.pdf · just now",
  action: { label: "Undo", onAction: () => undefined },
  onDismiss: logDismiss,
});

function Demo(args: {
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  maxVisible?: number;
  expanded?: boolean;
}) {
  return (
    <>
      <Button
        variant="secondary"
        onClick={() =>
          demoToaster("Changes saved", {
            description: "Q3 report.pdf · just now",
            action: { label: "Undo", onAction: () => undefined },
            onDismiss: logDismiss,
          })
        }
      >
        Save Changes
      </Button>
      <ToastRegion
        toaster={demoToaster}
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

const typesToaster = createToaster({ duration: Infinity });
typesToaster.success("Changes saved");
typesToaster.info("A new version is available");
typesToaster.warning("Storage is almost full");
typesToaster.error("Couldn't save changes");

function TypesDemo() {
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button
          variant="secondary"
          onClick={() => typesToaster.success("Changes saved")}
        >
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() => typesToaster.info("A new version is available")}
        >
          Info
        </Button>
        <Button
          variant="secondary"
          onClick={() => typesToaster.warning("Storage is almost full")}
        >
          Warning
        </Button>
        <Button
          variant="secondary"
          onClick={() => typesToaster.error("Couldn't save changes")}
        >
          Error
        </Button>
      </div>
      <ToastRegion toaster={typesToaster}>
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

const dismissToaster = createToaster({ duration: Infinity });
dismissToaster("Your session expires in 5 minutes", {
  dismissible: false,
  cancel: { label: "Got It" },
});

function DismissDemo() {
  return (
    <>
      <Button
        variant="secondary"
        onClick={() =>
          dismissToaster("Your session expires in 5 minutes", {
            dismissible: false,
            cancel: { label: "Got It" },
          })
        }
      >
        Session Warning
      </Button>
      <ToastRegion toaster={dismissToaster}>
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
