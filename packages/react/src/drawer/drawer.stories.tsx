import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const places = [
  { name: "Blue Bottle Coffee", detail: "Coffee · 0.2 mi" },
  { name: "Tartine Bakery", detail: "Bakery · 0.4 mi" },
  { name: "Dolores Park", detail: "Park · 0.5 mi" },
  { name: "Mission Dolores", detail: "Landmark · 0.6 mi" },
  { name: "Ritual Coffee Roasters", detail: "Coffee · 0.7 mi" },
  { name: "Bi-Rite Creamery", detail: "Ice cream · 0.7 mi" },
];

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "640px" } },
  },
  tags: ["autodocs"],
  args: {
    open: true,
    side: "bottom",
    onOpenChange: fn(),
  },
  argTypes: {
    open: { control: "boolean", table: { category: "State" } },
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right", "start", "end"],
      table: { category: "Appearance" },
    },
    dismissible: { control: "boolean", table: { category: "Behavior" } },
    snapPoints: { table: { disable: true } },
    onOpenChange: { control: false, table: { category: "Events" } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Drawer
        {...args}
        onOpenChange={(next, details) => {
          args.onOpenChange?.(next, details);
          updateArgs({ open: next });
        }}
      >
        <DrawerTrigger>Open details</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent
          style={args.side === "end" ? { inlineSize: "20rem" } : undefined}
        >
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>
            Everything about this project, from the side.
          </DrawerDescription>
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EndSide: Story = {
  args: { side: "end" },
};

export const SnapPoints: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Drawer snapPoints={[0.25, 0.5, 1]} defaultSnapPoint={0.5}>
      <DrawerTrigger>Find a place</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent style={{ blockSize: "calc(100dvh - 3rem)" }}>
        <DrawerHandle aria-label="Resize" />
        <DrawerTitle>Places nearby</DrawerTitle>
        <DrawerDescription>
          Drag the drawer, or press the handle, to see more.
        </DrawerDescription>
        <ul>
          {places.map((place) => (
            <li key={place.name}>
              <div>{place.name}</div>
              <div className="hashti-drawer__description">{place.detail}</div>
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  ),
};
