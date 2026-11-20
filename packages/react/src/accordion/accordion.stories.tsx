import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "./accordion";

const faq = [
  {
    value: "shipping",
    question: "When do orders arrive?",
    answer: "Orders arrive in five to seven days.",
  },
  {
    value: "returns",
    question: "What is your return policy?",
    answer: "Free returns within 30 days of delivery.",
  },
  {
    value: "warranty",
    question: "Is there a warranty?",
    answer: "Two years, covering parts and labor.",
  },
];

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    value: ["shipping"],
    multiple: false,
    collapsible: true,
    onValueChange: fn(),
  },
  argTypes: {
    value: { table: { disable: true } },
    multiple: { control: "boolean", table: { category: "Behavior" } },
    collapsible: { control: "boolean", table: { category: "Behavior" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return (
      <Accordion
        {...args}
        onValueChange={(next, details) => {
          args.onValueChange?.(next, details);
          updateArgs({ value: next });
        }}
      >
        {faq.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionHeader>
              <AccordionTrigger>{item.question}</AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>{item.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllClosed: Story = {
  args: { value: [] },
};

export const Multiple: Story = {
  args: { multiple: true, value: ["shipping", "returns"] },
};

export const DisabledItem: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Accordion defaultValue={["shipping"]}>
      {faq.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          disabled={item.value === "warranty"}
        >
          <AccordionHeader>
            <AccordionTrigger>{item.question}</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>{item.answer}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
