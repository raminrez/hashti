import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "./file-input";

// Real File objects keep the list state honest: FileInputList renders one item per file.
const files = [
  new File(["Q3 roadmap"], "q3-roadmap.pdf", { type: "application/pdf" }),
  new File(["Launch checklist"], "launch-checklist.md", {
    type: "text/markdown",
  }),
];

const meta = {
  title: "Components/FileInput",
  component: FileInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    defaultValue: files,
    multiple: true,
    disabled: false,
  },
  argTypes: {
    defaultValue: { table: { disable: true } },
    multiple: { control: "boolean", table: { category: "Behavior" } },
    accept: { control: "text", table: { category: "Validation" } },
    maxFiles: { control: "number", table: { category: "Validation" } },
    disabled: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Validation" } },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <FileInput {...args} style={{ maxInlineSize: 420 }}>
      <FileInputTrigger>Browse files</FileInputTrigger>
      <FileInputDropzone>
        Drop files here or paste from the clipboard
      </FileInputDropzone>
      <FileInputList aria-label="Files">
        <FileInputItem>
          {({ file }) => (
            <>
              <span>{file.name}</span>
              <FileInputItemRemove aria-label={`Remove ${file.name}`}>
                <svg
                  viewBox="0 0 12 12"
                  width="10"
                  height="10"
                  aria-hidden="true"
                >
                  <path
                    d="M2 2l8 8M10 2l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </FileInputItemRemove>
            </>
          )}
        </FileInputItem>
      </FileInputList>
    </FileInput>
  ),
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { defaultValue: [] },
};

export const Disabled: Story = {
  args: { disabled: true },
};
