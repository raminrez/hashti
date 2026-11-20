"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  FileInput as UiFileInput,
  FileInputDropzone as UiFileInputDropzone,
  FileInputItem as UiFileInputItem,
  FileInputItemRemove as UiFileInputItemRemove,
  FileInputList as UiFileInputList,
  FileInputTrigger as UiFileInputTrigger,
} from "@ui-sdk/react/file-input";

function FileInput(props: ComponentProps<typeof UiFileInput>) {
  return (
    <UiFileInput
      {...props}
      className={join("hashti-file-input", props.className)}
    />
  );
}

function FileInputTrigger(props: ComponentProps<typeof UiFileInputTrigger>) {
  return (
    <UiFileInputTrigger
      {...props}
      className={join("hashti-file-input-trigger", props.className)}
    />
  );
}

function FileInputDropzone(props: ComponentProps<typeof UiFileInputDropzone>) {
  return (
    <UiFileInputDropzone
      {...props}
      className={join("hashti-file-input-dropzone", props.className)}
    />
  );
}

function FileInputList(props: ComponentProps<typeof UiFileInputList>) {
  return (
    <UiFileInputList
      {...props}
      className={join("hashti-file-input-list", props.className)}
    />
  );
}

function FileInputItem(props: ComponentProps<typeof UiFileInputItem>) {
  return (
    <UiFileInputItem
      {...props}
      className={join("hashti-file-input-item", props.className)}
    />
  );
}

function FileInputItemRemove(
  props: ComponentProps<typeof UiFileInputItemRemove>,
) {
  return (
    <UiFileInputItemRemove
      {...props}
      className={join("hashti-file-input-item-remove", props.className)}
    />
  );
}

export {
  FileInput,
  FileInputTrigger,
  FileInputDropzone,
  FileInputList,
  FileInputItem,
  FileInputItemRemove,
};
