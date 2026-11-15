"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from "react";
import {
  DropZone as RACDropZone,
  FileTrigger as RACFileTrigger,
  isFileDropItem,
  type DropZoneProps as RACDropZoneProps,
  type DropZoneRenderProps,
  type FileTriggerProps as RACFileTriggerProps,
} from "react-aria-components";
import { Button } from "../button";
import { Icon } from "../../icons";
import { classes, cx } from "../../utils";

export interface DropZoneContextValue {
  variant?: "dashed" | "solid" | "card";
  isDropTarget?: boolean;
}

export const DropZoneContext = createContext<DropZoneContextValue>({});

export interface DropZoneRootProps extends Omit<RACDropZoneProps, "className"> {
  variant?: "dashed" | "solid" | "card";
  onDropFiles?: (files: File[]) => void;
  className?: string | ((values: DropZoneRenderProps) => string);
  children?: ReactNode | ((values: DropZoneRenderProps) => ReactNode);
  ref?: Ref<HTMLDivElement>;
}

export function DropZoneRoot({
  variant = "dashed",
  onDropFiles,
  onDrop,
  className,
  children,
  ref,
  ...props
}: DropZoneRootProps) {
  return (
    <RACDropZone
      {...props}
      ref={ref}
      data-variant={variant}
      className={classes(
        cx("react-aria-DropZone", "hashti-dropzone", `hashti-dropzone--${variant}`),
        className,
      )}
      onDrop={async (e) => {
        onDrop?.(e);
        if (onDropFiles) {
          const fileItems = e.items.filter(isFileDropItem);
          const files = await Promise.all(fileItems.map((item) => item.getFile()));
          if (files.length > 0) {
            onDropFiles(files);
          }
        }
      }}
    >
      {(renderProps) => {
        const contextValue: DropZoneContextValue = {
          variant,
          isDropTarget: renderProps.isDropTarget,
        };
        return (
          <DropZoneContext.Provider value={contextValue}>
            {typeof children === "function" ? children(renderProps) : children}
          </DropZoneContext.Provider>
        );
      }}
    </RACDropZone>
  );
}

export interface DropZoneFeedbackProps extends ComponentPropsWithRef<"div"> {
  children?: ReactNode;
}
export function DropZoneFeedback({ children, className, ...props }: DropZoneFeedbackProps) {
  const { isDropTarget } = useContext(DropZoneContext);
  return (
    <div
      {...props}
      data-drop-target={isDropTarget || undefined}
      className={cx("hashti-dropzone-feedback", className)}
    >
      {children}
    </div>
  );
}

export interface FileTriggerProps extends RACFileTriggerProps {
  children: ReactNode;
}
export function FileTrigger({ children, ...props }: FileTriggerProps) {
  return <RACFileTrigger {...props}>{children}</RACFileTrigger>;
}

export interface DropZoneProps extends DropZoneRootProps {}

function DropZoneDefault({ children, ...props }: DropZoneProps) {
  return <DropZoneRoot {...props}>{children}</DropZoneRoot>;
}

export const DropZone = Object.assign(DropZoneDefault, {
  Root: DropZoneRoot,
  Feedback: DropZoneFeedback,
  FileTrigger,
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
  isDisabled?: boolean;
  className?: string;
}

export function FileUploader({
  label,
  description,
  acceptedFileTypes,
  allowsMultiple = false,
  maxSize,
  files: controlledFiles,
  onFilesChange,
  isDisabled,
  className,
}: FileUploaderProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const files = controlledFiles ?? localFiles;

  function update(next: File[]) {
    if (controlledFiles === undefined) setLocalFiles(next);
    onFilesChange?.(next);
  }

  function select(incoming: File[]) {
    const messages: string[] = [];
    const accepted = incoming.filter((file) => {
      const reason = acceptsFile(file, acceptedFileTypes, maxSize);
      if (reason) messages.push(reason);
      return !reason;
    });
    setError(messages.join(" "));
    if (!accepted.length) return;
    update(allowsMultiple ? [...files, ...accepted] : accepted.slice(0, 1));
  }

  return (
    <div className={["hashti-file-uploader", className].filter(Boolean).join(" ")}>
      <div id={`${id}-label`} className="hashti-file-label">
        {label}
      </div>
      {description && (
        <p id={`${id}-description`} className="hashti-description">
          {description}
        </p>
      )}
      <DropZoneRoot
        aria-labelledby={`${id}-label`}
        aria-describedby={
          [description ? `${id}-description` : undefined, error ? errorId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        isDisabled={isDisabled}
        onDrop={async (event) => {
          const incoming = await Promise.all(
            event.items.filter((item) => item.kind === "file").map((item) => item.getFile()),
          );
          select(incoming);
        }}
      >
        <FileTrigger
          acceptedFileTypes={acceptedFileTypes}
          allowsMultiple={allowsMultiple}
          onSelect={(list) => list && select(Array.from(list))}
        >
          <Button variant="ghost" isDisabled={isDisabled}>
            <span>Drag files here or choose files</span>
            <Icon name="upload" />
          </Button>
        </FileTrigger>
      </DropZoneRoot>
      {error && (
        <p id={errorId} role="alert" className="hashti-error-message">
          {error}
        </p>
      )}
      <ul className="hashti-file-list">
        {files.map((file, index) => (
          <li key={`${file.name}-${file.lastModified}-${index}`}>
            <Icon name="file" />
            <span>{file.name}</span>
            <span className="hashti-description">
              {new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(
                file.size >= 1024 * 1024 ? file.size / (1024 * 1024) : file.size / 1024,
              )}{" "}
              {file.size >= 1024 * 1024 ? "MB" : "KB"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              isDisabled={isDisabled}
              aria-label={`Remove ${file.name}`}
              onPress={() => update(files.filter((_, position) => position !== index))}
            >
              <Icon name="close" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
