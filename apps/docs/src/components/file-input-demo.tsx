"use client"

import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@hashti/react"

export function FileInputDemo() {
  return (
    <FileInput multiple style={{ maxWidth: 420 }}>
      <FileInputTrigger>Browse files</FileInputTrigger>
      <FileInputDropzone>Drop files here or paste from the clipboard</FileInputDropzone>
      <FileInputList aria-label="Files">
        <FileInputItem>
          {({ file }) => (
            <>
              <span>{file.name}</span>
              <FileInputItemRemove aria-label={`Remove ${file.name}`}>×</FileInputItemRemove>
            </>
          )}
        </FileInputItem>
      </FileInputList>
    </FileInput>
  )
}
