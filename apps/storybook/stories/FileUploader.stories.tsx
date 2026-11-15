import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FileUploader, Theme, useTheme } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Forms/FileUploader",
  component: FileUploader,
  args: {
    label: "Upload files",
  },
  parameters: {
    docs: {
      description: {
        component:
          "FileUploader enables users to select one or multiple files through drag-and-drop or file system browsing with client-side file type and size constraints.",
      },
    },
  },
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundExample() {
  const [files, setFiles] = useState<File[]>([
    new File(["cert-content"], "tls-bundle-production.crt", {
      type: "application/x-x509-ca-cert",
      lastModified: 1731100000000,
    }),
  ]);

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h3 className="feedback-card-title">TLS Certificate Upload</h3>
          <p className="feedback-card-description">
            Upload custom CA certificates or private keys to cluster keystore.
          </p>
        </div>
        <FileUploader
          label="Server certificate bundle"
          description="Only PEM, CRT, or CER formats up to 5 MB are supported."
          acceptedFileTypes={[".crt", ".pem", ".cer"]}
          files={files}
          onFilesChange={setFiles}
        />
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Server certificate bundle")).toBeInTheDocument();
    expect(canvas.getByText("tls-bundle-production.crt")).toBeInTheDocument();

    const removeBtn = canvas.getByRole("button", { name: "Remove tls-bundle-production.crt" });
    expect(removeBtn).toBeInTheDocument();
    await userEvent.click(removeBtn);
    expect(canvas.queryByText("tls-bundle-production.crt")).not.toBeInTheDocument();
  },
};

function MultiFileWithLimitsExample() {
  const [files, setFiles] = useState<File[]>([
    new File(["doc-1"], "architecture-diagram.png", {
      type: "image/png",
      lastModified: 1731100000000,
    }),
    new File(["doc-2"], "compliance-audit-2026.pdf", {
      type: "application/pdf",
      lastModified: 1731100000000,
    }),
  ]);

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Compliance Documentation</h4>
          <p className="feedback-card-description">
            Attach verified architecture specifications and signed audits.
          </p>
        </div>
        <FileUploader
          label="Verification documents"
          description="Attach PDF, PNG, or JPG files. Maximum 25 MB per file."
          acceptedFileTypes={[".pdf", ".png", ".jpg", ".jpeg"]}
          allowsMultiple
          maxSize={25 * 1024 * 1024}
          files={files}
          onFilesChange={setFiles}
        />
      </div>
    </div>
  );
}

export const MultiFileWithLimits: Story = {
  render: () => <MultiFileWithLimitsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("architecture-diagram.png")).toBeInTheDocument();
    expect(canvas.getByText("compliance-audit-2026.pdf")).toBeInTheDocument();

    const dropZone = canvas.getByRole("button", { name: /Drag files here or choose files/i });
    expect(dropZone).toBeInTheDocument();
  },
};

function DisabledStateExample() {
  const sampleFiles = [
    new File(["read-only"], "immutable-system-manifest.json", {
      type: "application/json",
      lastModified: 1731100000000,
    }),
  ];

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <div>
          <h4 className="feedback-card-title">Locked Project Manifest</h4>
          <p className="feedback-card-description">
            File updates are locked during active production release.
          </p>
        </div>
        <FileUploader
          label="System manifest"
          description="Modifications are disabled by workspace release policy."
          files={sampleFiles}
          isDisabled
        />
      </div>
    </div>
  );
}

export const DisabledState: Story = {
  render: () => <DisabledStateExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("immutable-system-manifest.json")).toBeInTheDocument();

    const removeBtn = canvas.getByRole("button", { name: "Remove immutable-system-manifest.json" });
    expect(removeBtn).toBeDisabled();
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();
  const [faFiles, setFaFiles] = useState<File[]>([
    new File(["contract"], "قرارداد-سرویس-ابری-۱۴۰۵.pdf", {
      type: "application/pdf",
      lastModified: 1731100000000,
    }),
  ]);

  return (
    <div className="feedback-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="feedback-card">
          <div>
            <h4 className="feedback-card-title">بارگذاری مدارک و مستندات سازمانی</h4>
            <p className="feedback-card-description">ارسال مدارک حقوقی و فنی در محیط راست‌به‌چپ</p>
          </div>
          <FileUploader
            label="فایل قرارداد همکاری"
            description="فرمت‌های مجاز: PDF، حداکثر حجم ۱۰ مگابایت"
            acceptedFileTypes={[".pdf"]}
            files={faFiles}
            onFilesChange={setFaFiles}
          />
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("بارگذاری مدارک و مستندات سازمانی")).toBeInTheDocument();
    expect(canvas.getByText("قرارداد-سرویس-ابری-۱۴۰۵.pdf")).toBeInTheDocument();
  },
};
