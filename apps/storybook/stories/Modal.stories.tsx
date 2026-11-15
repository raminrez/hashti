import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Button,
  Checkbox,
  Dialog,
  DialogTrigger,
  Form,
  Heading,
  Icon,
  ListBoxItem,
  Modal,
  Select,
  TextField,
  Theme,
  useTheme,
} from "@hashti/react";
import "./overlays.css";
import "./fields.css";

const meta = {
  title: "Overlays/Modal",
  component: Modal,
  args: {
    isDismissable: true,
    size: "md",
    backdrop: "dim",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    backdrop: { control: "select", options: ["dim", "blur", "none"] },
    isDismissable: { control: "boolean" },
    isKeyboardDismissDisabled: { control: "boolean" },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Modal wraps RAC ModalOverlay and RAC Modal, rendering a portalled backdrop and surface. Dialog supplies heading semantics and reachable dismissal. Modal supports size (xs, sm, md, lg), backdrop (dim, blur, none), isDismissable, and independent part access through overlayClassName, overlayRef, and modalStyle. Frame uses an opaque surface with 18px corners (var(--hashti-overlay-radius)), a dark translucent backdrop at rgb(18 22 32 / 50%) (var(--hashti-overlay)), and inner-first Escape handling for nested overlays.",
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="overlay-story-stack">
      <DialogTrigger>
        <Button>Open playground modal</Button>
        <Modal {...args}>
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Workspace settings</Heading>
                <Button
                  slot="close"
                  variant="ghost"
                  size="md"
                  iconOnly
                  aria-label="Close dialog"
                  onPress={close}
                >
                  <Icon name="close" />
                </Button>
                <p>Configure team permissions and shared notification preferences.</p>
                <div className="hashti-dialog-footer">
                  <Button variant="tertiary" onPress={close}>
                    Cancel
                  </Button>
                  <Button variant="primary" onPress={close}>
                    Save changes
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </div>
  ),
};

export const Backdrops: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three backdrop variants. `dim` is the DESIGN scrim (`--hashti-overlay`, rgb(18 22 32 / 50%)) with no blur, `blur` adds a 6px blur on top of it, and `none` leaves the page untouched for surfaces that carry their own scrim.",
      },
    },
  },
  render: () => (
    <div className="overlay-story-grid">
      {(["dim", "blur", "none"] as const).map((backdrop) => (
        <div key={backdrop} className="overlay-story-case">
          <h2>{`Backdrop ${backdrop}`}</h2>
          <DialogTrigger>
            <Button variant="secondary">{`Open ${backdrop} modal`}</Button>
            <Modal backdrop={backdrop}>
              <Dialog>
                {({ close }) => (
                  <>
                    <Heading slot="title">{`Backdrop: ${backdrop}`}</Heading>
                    <Button
                      slot="close"
                      variant="ghost"
                      size="md"
                      iconOnly
                      aria-label={`Close ${backdrop} dialog`}
                      onPress={close}
                    >
                      <Icon name="close" />
                    </Button>
                    <p>The overlay carries `data-backdrop="{backdrop}"`.</p>
                    <div className="hashti-dialog-footer">
                      <Button variant="primary" onPress={close}>
                        Close
                      </Button>
                    </div>
                  </>
                )}
              </Dialog>
            </Modal>
          </DialogTrigger>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open blur modal" }));
    const dialog = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-modal");
      expect(el).not.toBeNull();
      return el!;
    });
    expect(dialog.closest(".hashti-modal-overlay")?.getAttribute("data-backdrop")).toBe("blur");
    await userEvent.click(within(dialog).getByRole("button", { name: "Close blur dialog" }));
    await waitFor(() => expect(document.querySelector(".hashti-modal")).toBeNull());
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <div className="overlay-story-grid">
        {(["xs", "sm", "md", "lg"] as const).map((size) => (
          <div key={size} className="overlay-story-case">
            <h2>Size {size.toUpperCase()}</h2>
            <DialogTrigger>
              <Button variant="secondary">{`Open ${size.toUpperCase()} modal`}</Button>
              <Modal size={size} isDismissable>
                <Dialog>
                  {({ close }) => (
                    <>
                      <Heading slot="title">{`Dialog size: ${size.toUpperCase()}`}</Heading>
                      <Button
                        slot="close"
                        variant="ghost"
                        size="md"
                        iconOnly
                        aria-label={`Close ${size} dialog`}
                        onPress={close}
                      >
                        <Icon name="close" />
                      </Button>
                      <p>
                        This modal demonstrates size <code>{size}</code> with Frame border-radius
                        and responsive padding.
                      </p>
                      <div className="hashti-dialog-footer">
                        <Button variant="primary" onPress={close}>
                          Close size dialog
                        </Button>
                      </div>
                    </>
                  )}
                </Dialog>
              </Modal>
            </DialogTrigger>
          </div>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open MD modal" });
    await userEvent.click(trigger);

    const dialog = await waitFor(() => {
      const el = document.querySelector<HTMLElement>('.hashti-modal[data-size="md"]');
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(dialog).toBeVisible());

    const closeBtn = within(dialog).getByRole("button", { name: "Close size dialog" });
    await userEvent.click(closeBtn);

    await waitFor(() => {
      expect(document.querySelector('.hashti-modal[data-size="md"]')).toBeNull();
    });
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

function FormDialogExample() {
  const [result, setResult] = useState<string>("");
  return (
    <div className="overlay-story-stack">
      <DialogTrigger>
        <Button>Invite teammate</Button>
        <Modal size="sm" isDismissable>
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Invite a teammate</Heading>
                <Button
                  slot="close"
                  variant="ghost"
                  size="md"
                  iconOnly
                  aria-label="Close invite dialog"
                  onPress={close}
                >
                  <Icon name="close" />
                </Button>
                <p>Send an access invitation to join your workspace.</p>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    setResult(
                      `Invited: ${data.get("email")} (notify=${data.get("notify") ? "yes" : "no"})`,
                    );
                    close();
                  }}
                >
                  <TextField
                    autoFocus
                    isRequired
                    label="Teammate email"
                    name="email"
                    type="email"
                    placeholder="teammate@example.com"
                    description="Use their official company address."
                  />
                  <Checkbox name="notify" defaultSelected style={{ marginTop: "0.75rem" }}>
                    Send onboarding digest email
                  </Checkbox>
                  <div className="hashti-dialog-footer">
                    <Button variant="tertiary" onPress={close}>
                      Cancel
                    </Button>
                    <Button type="submit">Send invitation</Button>
                  </div>
                </Form>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
      <output aria-label="Invitation output">{result || "No invitation submitted yet."}</output>
    </div>
  );
}

export const FormDialog: Story = {
  render: () => <FormDialogExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Invite teammate" });
    const output = canvas.getByRole("status", { name: "Invitation output" });

    await userEvent.click(trigger);
    const modal = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-modal");
      expect(el).not.toBeNull();
      return el!;
    });

    const emailInput = within(modal).getByRole("textbox", { name: /Teammate email/ });
    await userEvent.type(emailInput, "alex@cinder.dev");

    const submitBtn = within(modal).getByRole("button", { name: "Send invitation" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(document.querySelector(".hashti-modal")).toBeNull();
    });
    await expect(output).toHaveTextContent("Invited: alex@cinder.dev (notify=yes)");
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const NestedSelect: Story = {
  render: () => {
    return (
      <div className="overlay-story-stack">
        <DialogTrigger>
          <Button>Configure access levels</Button>
          <Modal size="sm" isDismissable>
            <Dialog>
              {({ close }) => (
                <>
                  <Heading slot="title">Access management</Heading>
                  <Button
                    slot="close"
                    variant="ghost"
                    size="md"
                    iconOnly
                    aria-label="Close access modal"
                    onPress={close}
                  >
                    <Icon name="close" />
                  </Button>
                  <p>Assign a role and cluster inside a nested overlay portal.</p>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <Select
                      label="Assigned role"
                      description="Determines system authorizations."
                      defaultSelectedKey="editor"
                    >
                      <ListBoxItem id="admin">Administrator</ListBoxItem>
                      <ListBoxItem id="editor">Editor</ListBoxItem>
                      <ListBoxItem id="viewer">Viewer</ListBoxItem>
                    </Select>
                  </div>
                  <div className="hashti-dialog-footer">
                    <Button variant="tertiary" onPress={close}>
                      Close
                    </Button>
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Configure access levels" });
    await userEvent.click(trigger);

    const modal = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-modal");
      expect(el).not.toBeNull();
      return el!;
    });

    // Open nested select inside modal
    const selectTrigger = within(modal).getByRole("button", { name: /Assigned role/ });
    await userEvent.click(selectTrigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-select-popover");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(popover).toBeVisible());

    // First Escape: closes nested Select popover, modal remains open!
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.querySelector(".hashti-select-popover")).toBeNull();
    });
    await waitFor(() => expect(modal).toBeVisible());
    await waitFor(() => expect(selectTrigger).toHaveFocus());

    // Second Escape: closes Modal, focus returns to original trigger!
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.querySelector(".hashti-modal")).toBeNull();
    });
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

function CustomPartTargetingExample() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [inspected, setInspected] = useState<boolean>(false);

  return (
    <div className="overlay-story-stack">
      <DialogTrigger>
        <Button>Open customized modal</Button>
        <Modal
          isDismissable
          overlayClassName="overlay-custom-backdrop"
          modalStyle={{ outline: "2px dashed var(--hashti-focus)" }}
          overlayRef={overlayRef}
          ref={modalRef}
        >
          <Dialog>
            {({ close }) => (
              <>
                <Heading slot="title">Independent part access</Heading>
                <Button
                  slot="close"
                  variant="ghost"
                  size="md"
                  iconOnly
                  aria-label="Close customized modal"
                  onPress={close}
                >
                  <Icon name="close" />
                </Button>
                <p>
                  This modal verifies <code>overlayClassName</code>, <code>modalStyle</code>, and
                  independent <code>overlayRef</code> / <code>ref</code> targets.
                </p>
                <div className="hashti-dialog-footer">
                  <Button
                    variant="secondary"
                    onPress={() => {
                      const hasOverlay = overlayRef.current !== null;
                      const hasModal = modalRef.current !== null;
                      setInspected(hasOverlay && hasModal);
                    }}
                  >
                    Verify refs
                  </Button>
                  <Button variant="primary" onPress={close}>
                    Done
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
      <output aria-label="Ref inspection result">
        {inspected ? "Both refs resolved correctly." : "Awaiting ref inspection."}
      </output>
    </div>
  );
}

export const CustomPartTargeting: Story = {
  render: () => <CustomPartTargetingExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open customized modal" });
    const output = canvas.getByRole("status", { name: "Ref inspection result" });

    await userEvent.click(trigger);
    const overlay = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-modal-overlay");
      expect(el).not.toBeNull();
      return el!;
    });
    await expect(overlay).toHaveClass(/overlay-custom-backdrop/);

    const modal = document.querySelector<HTMLElement>(".hashti-modal")!;
    expect(modal.style.outline).toContain("dashed");

    const verifyBtn = within(modal).getByRole("button", { name: "Verify refs" });
    await userEvent.click(verifyBtn);
    await expect(output).toHaveTextContent("Both refs resolved correctly.");

    const doneBtn = within(modal).getByRole("button", { name: "Done" });
    await userEvent.click(doneBtn);
    await waitFor(() => {
      expect(document.querySelector(".hashti-modal-overlay")).toBeNull();
    });
  },
};

function LocalizedModalExamples() {
  const { theme } = useTheme();
  return (
    <div className="overlay-story-grid">
      <div className="overlay-story-case">
        <h2>Scrollable content</h2>
        <DialogTrigger>
          <Button variant="secondary">Open scrollable modal</Button>
          <Modal size="sm" isDismissable>
            <Dialog>
              {({ close }) => (
                <>
                  <Heading slot="title">Terms of Service</Heading>
                  <Button
                    slot="close"
                    variant="ghost"
                    size="md"
                    iconOnly
                    aria-label="Close terms modal"
                    onPress={close}
                  >
                    <Icon name="close" />
                  </Button>
                  <div style={{ maxHeight: "14rem", overflowY: "auto", paddingRight: "0.5rem" }}>
                    <p>
                      Section 1: Acceptance of terms. By connecting services to the Atlas platform,
                      you agree to abide by these operating standards.
                    </p>
                    <p>
                      Section 2: Data confidentiality. Cryptographic keys and private tokens remain
                      the exclusive property of the tenant.
                    </p>
                    <p>
                      Section 3: Availability and uptime. Service guarantees apply strictly to
                      production clusters with active redundancy.
                    </p>
                    <p>
                      Section 4: Termination and audit. All access trails are preserved for 90 days
                      following project decommission.
                    </p>
                  </div>
                  <div className="hashti-dialog-footer">
                    <Button variant="primary" onPress={close}>
                      Accept terms
                    </Button>
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
      </div>

      <div className="overlay-story-case">
        <h2>Persian RTL dialog</h2>
        <Theme theme={theme} locale="fa-IR">
          <DialogTrigger>
            <Button>تنظیمات امنیتی سامانه</Button>
            <Modal size="sm" isDismissable>
              <Dialog>
                {({ close }) => (
                  <>
                    <Heading slot="title">تأیید عملیات حساس</Heading>
                    <Button
                      slot="close"
                      variant="ghost"
                      size="md"
                      iconOnly
                      aria-label="بستن پنجره"
                      onPress={close}
                    >
                      <Icon name="close" />
                    </Button>
                    <p>
                      آیا از بازنشانی کلیدهای دسترسی خوشه <code>atlas-sec-01</code> اطمینان دارید؟
                      این عملیات بلافاصله اعمال خواهد شد.
                    </p>
                    <div className="hashti-dialog-footer">
                      <Button variant="tertiary" onPress={close}>
                        انصراف
                      </Button>
                      <Button variant="danger" onPress={close}>
                        بازنشانی کلیدها
                      </Button>
                    </div>
                  </>
                )}
              </Dialog>
            </Modal>
          </DialogTrigger>
        </Theme>
      </div>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: LocalizedModalExamples,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "تنظیمات امنیتی سامانه" });
    await userEvent.click(trigger);

    const modal = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-modal");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() =>
      expect(within(modal).getByRole("heading", { name: "تأیید عملیات حساس" })).toBeVisible(),
    );

    const cancelBtn = within(modal).getByRole("button", { name: "انصراف" });
    await userEvent.click(cancelBtn);

    await waitFor(() => {
      expect(document.querySelector(".hashti-modal")).toBeNull();
    });
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
