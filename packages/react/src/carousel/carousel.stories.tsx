import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "./carousel";

const slides = ["First slide", "Second slide", "Third slide"];

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d={flip ? "m6 3 5 5-5 5" : "m10 3-5 5 5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    defaultPage: 1,
    loop: false,
    orientation: "horizontal",
  },
  argTypes: {
    defaultPage: { control: "number", table: { category: "State" } },
    loop: { control: "boolean", table: { category: "Behavior" } },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    slidesPerPage: { control: "number", table: { category: "Appearance" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Carousel {...args} aria-label="Highlights" style={{ maxInlineSize: 480 }}>
      <CarouselViewport>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide}>
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  blockSize: 160,
                  background: "var(--hashti-layer-03)",
                  borderRadius: "var(--hashti-popover-radius)",
                  fontSize: "0.875rem",
                }}
              >
                {slide} {index + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CarouselPrevious aria-label="Previous slide">
          <Chevron />
        </CarouselPrevious>
        <CarouselIndicatorGroup aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <CarouselIndicator
              key={slide}
              page={index + 1}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </CarouselIndicatorGroup>
        <CarouselNext aria-label="Next slide">
          <Chevron flip />
        </CarouselNext>
      </div>
    </Carousel>
  ),
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecondPage: Story = {
  args: { defaultPage: 2 },
};

export const Loop: Story = {
  args: { loop: true },
};
