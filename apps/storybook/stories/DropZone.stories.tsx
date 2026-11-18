import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FileInput, Button } from "@hashti/react";
import "./feedback.css";

const meta = {
  title: "Forms/FileInput",
  component: FileInput,
  parameters: {
    docs: {
      description: {
        component:
          "FileInput enables standalone drag-and-drop file targets decoupled from monolithic uploaders, ideal for canvas drops, table import targets, and custom file drop zones. Built on ui-sdk file-input.",
      },
    },
  },
} satisfies Meta<typeof FileInput>;

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

        <FileInput
          aria-label="Upload dataset drop area"
          variant="dashed"
          accept={[".csv", ".json", ".parquet"]}
          onDropFiles={(files) => setDroppedFiles(files.map((f) => f.name))}
        >
          <FileInput.Dropzone>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span>Drag and drop your dataset files here, or</span>
              <FileInput.Trigger>
                <Button variant="secondary" size="md">
                  Browse Files
                </Button>
              </FileInput.Trigger>
            </div>
          </FileInput.Dropzone>
        </FileInput>

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
    const dropzone = canvasElement.querySelector(".hashti-dropzone")!;
    expect(dropzone).toHaveAttribute("data-variant", "dashed");
    const browseBtn = canvas.getByRole("button", { name: "Browse Files" });
    expect(browseBtn).toBeInTheDocument();
  },
};

export const Variants: Story = {
  render: () => (
    <div className="feedback-story-stack">
      <div className="feedback-card">
        <h4 className="feedback-card-title">Dashed Variant (Default)</h4>
        <FileInput variant="dashed" aria-label="Dashed drop zone">
          <FileInput.Dropzone>
            <p style={{ margin: 0 }}>Dashed outline indicates open drop target area.</p>
          </FileInput.Dropzone>
        </FileInput>
      </div>

      <div className="feedback-card">
        <h4 className="feedback-card-title">Solid Variant</h4>
        <FileInput variant="solid" aria-label="Solid drop zone">
          <FileInput.Dropzone>
            <p style={{ margin: 0 }}>Solid 1px subtle border for clean inline containers.</p>
          </FileInput.Dropzone>
        </FileInput>
      </div>

      <div className="feedback-card">
        <h4 className="feedback-card-title">Card Variant</h4>
        <FileInput variant="card" aria-label="Card drop zone">
          <FileInput.Dropzone>
            <p style={{ margin: 0 }}>
              Elevated surface card for dashboards and rich document trays.
            </p>
          </FileInput.Dropzone>
        </FileInput>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const zones = canvasElement.querySelectorAll(".hashti-dropzone");
    expect(zones[0]).toHaveAttribute("data-variant", "dashed");
    expect(zones[1]).toHaveAttribute("data-variant", "solid");
    expect(zones[2]).toHaveAttribute("data-variant", "card");
  },
};
