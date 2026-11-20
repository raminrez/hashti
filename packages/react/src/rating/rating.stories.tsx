import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import { Rating, RatingItem } from "./rating";

function Star() {
  return (
    <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true">
      <path
        d="M8 1.5 10 6l4.5.5-3.3 3 .9 4.5L8 11.6 3.9 14l.9-4.5-3.3-3L6 6Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Components/Rating",
  component: Rating,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    value: 3,
    max: 5,
    step: 1,
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: "number", table: { category: "Value" } },
    max: { control: "number", table: { category: "Value" } },
    step: {
      control: "inline-radio",
      options: [1, 0.5],
      table: { category: "Value" },
    },
    defaultValue: { control: false, table: { category: "Value" } },
    deselectable: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    readOnly: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Validation" } },
    loop: { control: "boolean", table: { category: "State" } },
    getValueLabel: { control: false, table: { category: "Accessibility" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs<{ value: number | null }>();
    return (
      <Rating
        {...args}
        value={value}
        onValueChange={(next, details) => {
          args.onValueChange?.(next, details);
          updateArgs({ value: next });
        }}
      >
        <RatingItem>
          <Star />
          <span className="hashti-rating-item__fill" aria-hidden="true">
            <Star />
          </span>
        </RatingItem>
      </Rating>
    );
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rated: Story = {};

export const Empty: Story = {
  args: { value: null },
};

export const HalfStar: Story = {
  args: { value: 3.5, step: 0.5 },
};

// A read-only rating shows any score, like an average of 4.2.
export const ReadOnlyAverage: Story = {
  args: { value: 4.2, readOnly: true },
};

export const Disabled: Story = {
  args: { value: 3, disabled: true },
};
