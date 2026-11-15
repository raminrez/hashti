import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button, Drawer, TextField, Theme, type DrawerPlacement } from "@hashti/react";
import "./overlays.css";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component:
          "Drawer (slide-over sheet) provides edge-anchored overlay surfaces for secondary views, filters, and forms. Supports start/end/top/bottom placement, a backdrop choice shared with Modal (dim, blur, none), and full RTL mirroring. Corners flush to the viewport edge are square; only the side facing the page is rounded, per placement and in RTL.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof Drawer>;

function DrawerDemo({ placement = "end" }: { placement?: DrawerPlacement }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overlay-story-stack">
      <Button onPress={() => setIsOpen(true)}>Open {placement} Drawer</Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement={placement}
        title="Project Settings"
        description="Configure your environment variables and deployment pipeline."
        footer={
          <>
            <Button variant="secondary" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={() => setIsOpen(false)}>
              Save changes
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <TextField label="Deployment Name" defaultValue="hashti-production" />
          <TextField label="Domain" defaultValue="app.cinder.dev" />
          <p style={{ margin: 0, color: "var(--hashti-text-secondary)", fontSize: "0.875rem" }}>
            Changes will be deployed automatically after commit.
          </p>
        </div>
      </Drawer>
    </div>
  );
}

export const Playground: Story = {
  render: () => <DrawerDemo placement="end" />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Open end Drawer/i });
    await userEvent.click(trigger);

    const body = within(document.body);
    expect(await body.findByText("Project Settings")).toBeInTheDocument();

    const cancelBtn = body.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelBtn);
  },
};

function DrawerPlacementsDemo() {
  const [activePlacement, setActivePlacement] = useState<DrawerPlacement | null>(null);

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {(["start", "end", "top", "bottom"] as const).map((p) => (
        <Button key={p} variant="secondary" onPress={() => setActivePlacement(p)}>
          {p.toUpperCase()} Drawer
        </Button>
      ))}
      {activePlacement && (
        <Drawer
          isOpen={true}
          onOpenChange={(open) => !open && setActivePlacement(null)}
          placement={activePlacement}
          title={`${activePlacement.toUpperCase()} Drawer`}
          description={`Drawer mounted from the ${activePlacement} edge of the screen.`}
          footer={
            <Button variant="primary" onPress={() => setActivePlacement(null)}>
              Close
            </Button>
          }
        >
          <p>Drawer content aligned to {activePlacement}.</p>
        </Drawer>
      )}
    </div>
  );
}

function DrawerRtlDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Theme direction="rtl">
      <div dir="rtl" className="overlay-story-stack">
        <Button onPress={() => setIsOpen(true)}>باز کردن کشوی کناری</Button>
        <Drawer
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          dir="rtl"
          placement="end"
          title="تنظیمات پروژه"
          description="پیکربندی متغیرهای محیطی و خط لوله انتشار."
          footer={
            <>
              <Button variant="secondary" onPress={() => setIsOpen(false)}>
                انصراف
              </Button>
              <Button variant="primary" onPress={() => setIsOpen(false)}>
                ذخیره تغییرات
              </Button>
            </>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TextField label="نام استقرار" defaultValue="hashti-production" />
            <TextField label="دامنه اصلی" defaultValue="app.cinder.dev" />
          </div>
        </Drawer>
      </div>
    </Theme>
  );
}

function DrawerBackdropDemo({ backdrop }: { backdrop: "dim" | "blur" | "none" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overlay-story-case">
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        {`Open ${backdrop} drawer`}
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="end"
        backdrop={backdrop}
        title={`Backdrop: ${backdrop}`}
        description="Drawer takes the same backdrop prop as Modal."
      >
        <p>Scrim variant: {backdrop}.</p>
      </Drawer>
    </div>
  );
}

export const Backdrops: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Drawer takes the same `backdrop` prop as Modal. A drawer flush to the viewport edge keeps square corners on that edge and only rounds the side facing the page.",
      },
    },
  },
  render: () => (
    <div className="overlay-story-grid">
      {(["dim", "blur", "none"] as const).map((backdrop) => (
        <DrawerBackdropDemo key={backdrop} backdrop={backdrop} />
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open blur drawer" }));

    const body = within(document.body);
    expect(await body.findByText("Backdrop: blur")).toBeInTheDocument();
    expect(document.querySelector(".hashti-drawer-overlay")?.getAttribute("data-backdrop")).toBe(
      "blur",
    );

    await userEvent.click(body.getByRole("button", { name: "Close drawer" }));
  },
};

export const Placements: Story = {
  render: () => <DrawerPlacementsDemo />,
};

export const RTL: Story = {
  render: () => <DrawerRtlDemo />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "باز کردن کشوی کناری" });
    await userEvent.click(trigger);

    const body = within(document.body);
    expect(await body.findByText("تنظیمات پروژه")).toBeInTheDocument();

    const cancelBtn = body.getByRole("button", { name: "انصراف" });
    await userEvent.click(cancelBtn);
  },
};
