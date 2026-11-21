import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "./file-input";

// Demo files only: the trigger opens a real file picker, which a story cannot drive.
const files = [
  { name: "q3-roadmap.pdf", size: 2_400_000 },
  { name: "launch-checklist.md", size: 12_000 },
];

const meta = {
  title: "Components/FileInput",
  component: FileInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    multiple: false,
    disabled: false,
  },
  argTypes: {
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
        {files.map((file) => (
          <FileInputItem key={file.name} aria-label={file.name}>
            <span>{file.name}</span>
            <FileInputItemRemove aria-label={`Remove ${file.name}`}>
              ×
            </FileInputItemRemove>
          </FileInputItem>
        ))}
      </FileInputList>
    </FileInput>
  ),
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = {
  args: { multiple: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
