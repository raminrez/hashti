import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { DropZone, FileTrigger, Button } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Forms/DropZone",
  component: DropZone,
  parameters: {
    docs: {
      description: {
        component:
          "DropZone enables standalone drag-and-drop file targets decoupled from monolithic uploaders, ideal for canvas drops, table import targets, and custom file drop zones.",
      },
    },
  },
} satisfies Meta<typeof DropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaygroundDemo() {
  const [droppedFiles, setDroppedFiles] = useState<string[]>([]);

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Dataset File Ingestion</h4>
        <p className="feedback-card-description">
          Drag CSV, Parquet, or JSON datasets into the drop zone or browse your files.
        </p>

        <DropZone
          aria-label="Upload dataset drop area"
          variant="dashed"
          onDropFiles={(files) => setDroppedFiles(files.map((f) => f.name))}
        >
          <DropZone.Feedback>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span>Drag and drop your dataset files here, or</span>
              <FileTrigger
                acceptedFileTypes={[".csv", ".json", ".parquet"]}
                onSelect={(e) => {
                  if (e) {
                    const files = Array.from(e);
                    setDroppedFiles(files.map((f) => f.name));
                  }
                }}
              >
                <Button variant="secondary" size="md">
                  Browse Files
                </Button>
              </FileTrigger>
            </div>
          </DropZone.Feedback>
        </DropZone>

        {droppedFiles.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <strong>Selected files:</strong>
            <ul>
              {droppedFiles.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // RAC DropZone renders its label on a visually hidden focusable button, not a region.
    const dropzone = canvas.getByRole("button", { name: "Upload dataset drop area" });
    expect(dropzone.closest(".hashti-dropzone")).toHaveAttribute("data-variant", "dashed");

    const browseBtn = canvas.getByRole("button", { name: "Browse Files" });
    expect(browseBtn).toBeInTheDocument();
  },
};

export const Variants: Story = {
  render: () => (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Dashed Variant (Default)</h4>
        <DropZone variant="dashed" aria-label="Dashed drop zone">
          <DropZone.Feedback>
            <p style={{ margin: 0 }}>Dashed outline indicates open drop target area.</p>
          </DropZone.Feedback>
        </DropZone>
      </div>

      <div className="feedback-card">
        <h4 className="feedback-card-title">Solid Variant</h4>
        <DropZone variant="solid" aria-label="Solid drop zone">
          <DropZone.Feedback>
            <p style={{ margin: 0 }}>Solid 1px subtle border for clean inline containers.</p>
          </DropZone.Feedback>
        </DropZone>
      </div>

      <div className="feedback-card">
        <h4 className="feedback-card-title">Card Variant</h4>
        <DropZone variant="card" aria-label="Card drop zone">
          <DropZone.Feedback>
            <p style={{ margin: 0 }}>
              Elevated surface card for dashboards and rich document trays.
            </p>
          </DropZone.Feedback>
        </DropZone>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dashed = canvas
      .getByRole("button", { name: "Dashed drop zone" })
      .closest(".hashti-dropzone")!;
    const solid = canvas
      .getByRole("button", { name: "Solid drop zone" })
      .closest(".hashti-dropzone")!;
    const card = canvas
      .getByRole("button", { name: "Card drop zone" })
      .closest(".hashti-dropzone")!;

    expect(dashed).toHaveAttribute("data-variant", "dashed");
    expect(solid).toHaveAttribute("data-variant", "solid");
    expect(card).toHaveAttribute("data-variant", "card");
  },
};

function StandaloneFileTriggerDemo() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Decoupled FileTrigger</h4>
        <p className="feedback-card-description">
          Attach file picker actions to any arbitrary trigger (avatar button, link, action).
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <FileTrigger
            acceptedFileTypes={["image/*"]}
            onSelect={(e) => {
              if (e) {
                const file = Array.from(e)[0];
                if (file) setFileName(file.name);
              }
            }}
          >
            <Button variant="primary" size="md">
              Upload User Avatar
            </Button>
          </FileTrigger>
          {fileName && <span>Selected: {fileName}</span>}
        </div>
      </div>
    </div>
  );
}

export const StandaloneFileTrigger: Story = {
  render: () => <StandaloneFileTriggerDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Upload User Avatar" });
    expect(button).toBeInTheDocument();
  },
};
