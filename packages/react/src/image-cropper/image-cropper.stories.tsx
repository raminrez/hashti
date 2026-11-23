import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
} from "./image-cropper";

// Inline SVG so the story needs no network and renders the same every run.
const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#e5e5e5"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a3a3a3"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#525252"/></svg>`,
)}`;

const meta = {
  title: "Components/ImageCropper",
  component: ImageCropper,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { src: photo, aspectRatio: 16 / 9 },
  argTypes: {
    src: { control: false, table: { category: "Content" } },
    aspectRatio: { control: "number", table: { category: "Appearance" } },
    mode: {
      control: "inline-radio",
      options: ["box", "frame"],
      table: { category: "Behavior" },
    },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <ImageCropper
      {...args}
      aria-label="Cover photo"
      style={{ maxInlineSize: 360 }}
    >
      <ImageCropperViewport style={{ blockSize: 240 }}>
        <ImageCropperImage alt="Mountains at sunset" />
        <ImageCropperSelection>
          <ImageCropperGrid />
        </ImageCropperSelection>
        <ImageCropperHandle position="nw" />
        <ImageCropperHandle position="ne" />
        <ImageCropperHandle position="sw" />
        <ImageCropperHandle position="se" />
      </ImageCropperViewport>
      <div className="hashti-image-cropper__controls">
        <ImageCropperZoom aria-label="Zoom" />
        <ImageCropperRotate>Rotate</ImageCropperRotate>
        <ImageCropperFlip>Flip</ImageCropperFlip>
      </div>
    </ImageCropper>
  ),
} satisfies Meta<typeof ImageCropper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Square: Story = {
  args: { aspectRatio: 1 },
};
