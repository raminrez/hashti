import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { useArgs } from "storybook/preview-api";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    page: 6,
    pageCount: 10,
    siblings: 1,
    boundaries: 1,
    onPageChange: fn(),
  },
  argTypes: {
    page: { control: "number", table: { category: "Value" } },
    pageCount: { control: "number", table: { category: "Value" } },
    siblings: { control: "number", table: { category: "Value" } },
    boundaries: { control: "number", table: { category: "Value" } },
    defaultPage: { control: false, table: { category: "Value" } },
    total: { control: false, table: { category: "Value" } },
    pageSize: { control: false, table: { category: "Value" } },
    disabled: { control: "boolean", table: { category: "State" } },
    getHref: { control: false, table: { category: "Navigation" } },
    onPageChange: { control: false, table: { category: "Events" } },
    className: { table: { disable: true } },
  },
  render: function Render(args) {
    const [{ page }, updateArgs] = useArgs<{ page: number }>();
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(next, details) => {
          args.onPageChange?.(next, details);
          updateArgs({ page: next });
        }}
      >
        <PaginationList>
          {({ items }) => (
            <>
              <PaginationItem>
                <PaginationPrevious aria-label="Previous page" />
              </PaginationItem>
              {items.map((item) => (
                <PaginationItem key={item}>
                  {typeof item === "number" ? (
                    <PaginationLink page={item} />
                  ) : (
                    <PaginationEllipsis />
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext aria-label="Next page" />
              </PaginationItem>
            </>
          )}
        </PaginationList>
      </Pagination>
    );
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Middle: Story = {};

export const FirstPage: Story = {
  args: { page: 1 },
};

export const LastPage: Story = {
  args: { page: 10 },
};

export const SinglePage: Story = {
  args: { page: 1, pageCount: 1 },
};
