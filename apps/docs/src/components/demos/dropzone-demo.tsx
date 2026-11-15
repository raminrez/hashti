import { useState } from "react";
import { DropZone, FileTrigger, Button, FileUploader } from "@hashti/react";

export function FileUploaderLiveDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-sm">
      <FileUploader
        label="Server certificate bundle"
        description="Only PEM, CRT, or CER formats up to 5 MB are supported."
        acceptedFileTypes={[".crt", ".pem", ".cer"]}
        maxSize={5 * 1024 * 1024}
        files={files}
        onFilesChange={setFiles}
      />
    </div>
  );
}

export function DropZoneLiveDemo() {
  const [droppedFiles, setDroppedFiles] = useState<string[]>([]);

  return (
    <div className="w-full max-w-sm space-y-3">
      <DropZone
        onDrop={(e) => {
          const files = e.items
            .filter((item) => item.kind === "file")
            .map((item: any) => item.name);
          setDroppedFiles(files);
        }}
        className="p-6 text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Drag & drop architectural drawings here
          </p>
          <p className="text-xs text-neutral-500">Supports PNG, SVG, PDF up to 25MB</p>
          <FileTrigger
            onSelect={(e) => {
              const files = Array.from(e ?? []).map((file) => file.name);
              setDroppedFiles(files);
            }}
          >
            <Button variant="secondary" size="sm">
              Browse Files
            </Button>
          </FileTrigger>
        </div>
      </DropZone>
      {droppedFiles.length > 0 && (
        <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
          Selected: {droppedFiles.join(", ")}
        </div>
      )}
    </div>
  );
}
