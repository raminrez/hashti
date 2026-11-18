import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button, Drawer, Theme } from "@hashti/react";
import "./overlays.css";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component:
          "Drawer wraps @ui-sdk/react/drawer: an edge-anchored sheet with drag, snap points and a managed backdrop. It absorbs the old Sheet (side, snapPoints, Drawer.Handle) and keeps a draggable={false} mode for desktop panel-from-edge surfaces. `side` accepts start/end (writing-direction aware) or top/right/bottom/left.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="overlay-story-stack">
      <Drawer side="end" draggable={false}>
        <Drawer.Trigger render={<Button>Open settings drawer</Button>} />
        <Drawer.Backdrop />
        <Drawer.Content size="md">
          <Drawer.Title>Project settings</Drawer.Title>
          <Drawer.Description>
            Configure environment variables and the deployment pipeline.
          </Drawer.Description>
          <div className="hashti-drawer-body">
            <p style={{ margin: 0, color: "var(--hashti-text-secondary)", fontSize: "0.875rem" }}>
              Changes deploy automatically after commit.
            </p>
          </div>
          <div className="hashti-dialog-footer">
            <Drawer.Close render={<Button variant="secondary">Cancel</Button>} />
            <Drawer.Close render={<Button variant="primary">Save changes</Button>} />
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open settings drawer" });
    await userEvent.click(trigger);

    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", { name: "Project settings" }),
    );
    await waitFor(() => expect(dialog).toBeVisible());

    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(document.querySelector(".hashti-drawer")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Sides: Story = {
  render: () => (
    <div className="overlay-story-grid">
      {(["start", "end", "top", "bottom"] as const).map((side) => (
        <div key={side} className="overlay-story-case">
          <h2>{`Side ${side}`}</h2>
          <Drawer side={side} draggable={false}>
            <Drawer.Trigger
              render={<Button variant="secondary">{`Open ${side} drawer`}</Button>}
            />
            <Drawer.Backdrop />
            <Drawer.Content>
              <Drawer.Title>{`${side.toUpperCase()} drawer`}</Drawer.Title>
              <Drawer.Description>{`Anchored to the ${side} edge.`}</Drawer.Description>
              <div className="hashti-dialog-footer">
                <Drawer.Close render={<Button variant="primary">Close</Button>} />
              </div>
            </Drawer.Content>
          </Drawer>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open start drawer" }));
    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", { name: "START drawer" }),
    );
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-drawer")).toBeNull());
  },
};

export const SnapPoints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A draggable bottom sheet resting at snap points. Drawer.Handle cycles them on press; the content carries data-snap-point, and data-expanded at the largest.",
      },
    },
  },
  render: () => (
    <div className="overlay-story-stack">
      <Drawer side="bottom" snapPoints={[0.35, 0.75, 1]}>
        <Drawer.Trigger render={<Button variant="secondary">Open snap-point sheet</Button>} />
        <Drawer.Backdrop />
        <Drawer.Content>
          <Drawer.Handle />
          <Drawer.Title>Transit lines</Drawer.Title>
          <Drawer.Description>
            Drag the sheet or press the handle to move between snap points.
          </Drawer.Description>
          <div className="hashti-drawer-body">
            <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
              <li>Downtown Express — Platform 2</li>
              <li>Airport Shuttle — Bay 14</li>
              <li>Crosstown Line — Platform 5</li>
            </ul>
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open snap-point sheet" }));
    const content = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-drawer");
      expect(el).not.toBeNull();
      return el!;
    });
    await waitFor(() => expect(content).toBeVisible());
    expect(content.getAttribute("data-side")).toBe("bottom");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-drawer")).toBeNull());
  },
};

export const Backdrops: Story = {
  render: () => (
    <div className="overlay-story-grid">
      {(["dim", "blur", "none"] as const).map((backdrop) => (
        <div key={backdrop} className="overlay-story-case">
          <h2>{`Backdrop ${backdrop}`}</h2>
          <Drawer side="end" draggable={false} backdrop={backdrop}>
            <Drawer.Trigger
              render={<Button variant="secondary">{`Open ${backdrop} drawer`}</Button>}
            />
            <Drawer.Backdrop />
            <Drawer.Content size="sm">
              <Drawer.Title>{`Backdrop: ${backdrop}`}</Drawer.Title>
              <Drawer.Description>
                Drawer takes the same backdrop prop as Dialog.
              </Drawer.Description>
              <div className="hashti-dialog-footer">
                <Drawer.Close render={<Button variant="primary">Close</Button>} />
              </div>
            </Drawer.Content>
          </Drawer>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open blur drawer" }));
    const backdrop = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-overlay");
      expect(el).not.toBeNull();
      return el!;
    });
    expect(backdrop.getAttribute("data-backdrop")).toBe("blur");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector(".hashti-drawer")).toBeNull());
  },
};

function RtlDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <Theme dir="rtl" lang="fa-IR">
      <div dir="rtl" className="overlay-story-stack">
        <Button onClick={() => setOpen(true)}>باز کردن کشوی کناری</Button>
        <Drawer side="end" draggable={false} open={open} onOpenChange={setOpen}>
          <Drawer.Backdrop />
          <Drawer.Content size="md">
            <Drawer.Title>تنظیمات پروژه</Drawer.Title>
            <Drawer.Description>پیکربندی متغیرهای محیطی و خط لوله انتشار.</Drawer.Description>
            <div className="hashti-dialog-footer">
              <Drawer.Close render={<Button variant="secondary">انصراف</Button>} />
              <Drawer.Close render={<Button variant="primary">ذخیره تغییرات</Button>} />
            </div>
          </Drawer.Content>
        </Drawer>
      </div>
    </Theme>
  );
}

export const RTL: Story = {
  render: () => <RtlDrawer />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "باز کردن کشوی کناری" });
    await userEvent.click(trigger);

    const dialog = await waitFor(() =>
      within(document.body).getByRole("dialog", { name: "تنظیمات پروژه" }),
    );
    await waitFor(() => expect(dialog).toBeVisible());

    await userEvent.click(within(dialog).getByRole("button", { name: "انصراف" }));
    await waitFor(() => expect(document.querySelector(".hashti-drawer")).toBeNull());
  },
};
