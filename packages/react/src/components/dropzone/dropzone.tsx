"use client";

import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
  type Ref,
} from "react";
import {
  FileInput as UiSdkFileInput,
  FileInputDropzone as UiSdkFileInputDropzone,
  FileInputTrigger as UiSdkFileInputTrigger,
  FileInputList,
  FileInputItem,
  FileInputItemRemove,
  formatFileSize,
  type FileInputDropzoneState,
  type FileInputValueChangeDetails,
} from "@ui-sdk/react/file-input";
import { Button } from "../button";
import { Icon } from "../../icons";
import { cx } from "../../utils";

export type FileInputVariant = "dashed" | "solid" | "card";

export interface FileInputContextValue {
  variant?: FileInputVariant;
  dragging?: boolean;
}

export const FileInputContext = createContext<FileInputContextValue>({});

export type FileInputRootProps = Omit<
  ComponentProps<typeof UiSdkFileInput>,
  "children" | "className"
> & {
  variant?: FileInputVariant;
  /** Convenience: the accepted files after a drop or pick. */
  onDropFiles?: (files: File[]) => void;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

function FileInputRoot({
  variant = "dashed",
  onDropFiles,
  onValueChange,
  className,
  children,
  ...props
}: FileInputRootProps) {
  const handleChange = (value: File[], details: FileInputValueChangeDetails) => {
    onValueChange?.(value, details);
    onDropFiles?.(value);
  };
  return (
    <UiSdkFileInput
      {...props}
      onValueChange={handleChange}
      className={cx(`hashti-dropzone hashti-dropzone--${variant}`, className)}
      data-variant={variant}
    >
      <FileInputContext.Provider value={{ variant }}>
        {children}
      </FileInputContext.Provider>
    </UiSdkFileInput>
  );
}

export type FileInputDropzoneProps = ComponentProps<typeof UiSdkFileInputDropzone>;

/** The drop surface. Takes dropped or pasted files; keep a trigger beside it. */
function FileInputDropzone({ className, children, ...props }: FileInputDropzoneProps) {
  const hook =
    typeof className === "function"
      ? (state: FileInputDropzoneState) => cx("hashti-dropzone-feedback", className(state))
      : cx("hashti-dropzone-feedback", className);
  return (
    <UiSdkFileInputDropzone {...props} className={hook}>
      {children}
    </UiSdkFileInputDropzone>
  );
}

export type FileInputTriggerProps = ComponentProps<typeof UiSdkFileInputTrigger> & {
  children?: ReactNode;
};

/** Opens the system file picker. */
function FileInputTrigger({ children, ...props }: FileInputTriggerProps) {
  return <UiSdkFileInputTrigger {...props}>{children}</UiSdkFileInputTrigger>;
}

export type FileInputProps = FileInputRootProps;

function FileInputDefault({ children, ...props }: FileInputProps) {
  return (
    <FileInputRoot {...props}>
      {children ?? (
        <>
          <FileInputDropzone>
            <p>Drag and drop files here</p>
            <FileInputTrigger>
              <Button variant="ghost">
                <span>Browse files</span>
                <Icon name="upload" />
              </Button>
            </FileInputTrigger>
          </FileInputDropzone>
          <FileInputList aria-label="Files" className="hashti-file-list">
            <FileInputItem>
              {({ file }) => (
                <>
                  <Icon name="file" />
                  <span>{file.name}</span>
                  <span className="hashti-description">{formatFileSize(file.size)}</span>
                  <FileInputItemRemove className="hashti-button" data-variant="ghost">
                    <Icon name="close" />
                  </FileInputItemRemove>
                </>
              )}
            </FileInputItem>
          </FileInputList>
        </>
      )}
    </FileInputRoot>
  );
}

export const FileInput = Object.assign(FileInputDefault, {
  Root: FileInputRoot,
  Dropzone: FileInputDropzone,
  Trigger: FileInputTrigger,
  List: FileInputList,
  Item: FileInputItem,
  ItemRemove: FileInputItemRemove,
});

export function acceptsFile(
  file: Pick<File, "name" | "type" | "size">,
  acceptedFileTypes: readonly string[] = [],
  maxSize?: number,
): string | null {
  if (maxSize != null && file.size > maxSize) return `${file.name} exceeds the size limit.`;
  const mime = file.type.split(";", 1)[0]!.trim().toLowerCase();
  const valid =
    !acceptedFileTypes.length ||
    acceptedFileTypes.some((accept) => {
      const pattern = accept.trim().toLowerCase();
      if (pattern.startsWith(".")) return file.name.toLowerCase().endsWith(pattern);
      if (pattern.endsWith("/*")) return mime.startsWith(pattern.slice(0, -1));
      return mime === pattern;
    });
  return valid ? null : `${file.name} is not an accepted file type.`;
}

export interface FileUploaderProps {
  label: ReactNode;
  description?: ReactNode;
  acceptedFileTypes?: string[];
  allowsMultiple?: boolean;
  maxSize?: number;
  files?: readonly File[];
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * A FileInput with a label, description, accept/size validation and a file
 * list — the pattern the old FileUploader shipped, on ui-sdk file-input.
 */
export function FileUploader({
  label,
  description,
  acceptedFileTypes,
  allowsMultiple = false,
  maxSize,
  files: controlledFiles,
  onFilesChange,
  disabled,
  className,
}: FileUploaderProps) {
  return (
    <div className={cx("hashti-file-uploader", className)}>
      <div className="hashti-file-label">{label}</div>
      {description && <p className="hashti-description">{description}</p>}
      <FileInput
        multiple={allowsMultiple}
        accept={acceptedFileTypes}
        maxSize={maxSize}
        disabled={disabled}
        value={controlledFiles ? [...controlledFiles] : undefined}
        onValueChange={(value) => onFilesChange?.([...value])}
      />
    </div>
  );
}
