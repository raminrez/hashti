"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  ImageCropper as UiImageCropper,
  ImageCropperFlip as UiImageCropperFlip,
  ImageCropperGrid as UiImageCropperGrid,
  ImageCropperHandle as UiImageCropperHandle,
  ImageCropperImage as UiImageCropperImage,
  ImageCropperRotate as UiImageCropperRotate,
  ImageCropperSelection as UiImageCropperSelection,
  ImageCropperViewport as UiImageCropperViewport,
  ImageCropperZoom as UiImageCropperZoom,
} from "@ui-sdk/react/image-cropper";

function ImageCropper(props: ComponentProps<typeof UiImageCropper>) {
  return (
    <UiImageCropper
      {...props}
      className={join("hashti-image-cropper", props.className)}
    />
  );
}

function ImageCropperViewport(
  props: ComponentProps<typeof UiImageCropperViewport>,
) {
  return (
    <UiImageCropperViewport
      {...props}
      className={join("hashti-image-cropper-viewport", props.className)}
    />
  );
}

function ImageCropperImage(props: ComponentProps<typeof UiImageCropperImage>) {
  return (
    <UiImageCropperImage
      {...props}
      className={join("hashti-image-cropper-image", props.className)}
    />
  );
}

function ImageCropperSelection(
  props: ComponentProps<typeof UiImageCropperSelection>,
) {
  return (
    <UiImageCropperSelection
      {...props}
      className={join("hashti-image-cropper-selection", props.className)}
    />
  );
}

function ImageCropperGrid(props: ComponentProps<typeof UiImageCropperGrid>) {
  return (
    <UiImageCropperGrid
      {...props}
      className={join("hashti-image-cropper-grid", props.className)}
    />
  );
}

function ImageCropperHandle(
  props: ComponentProps<typeof UiImageCropperHandle>,
) {
  return (
    <UiImageCropperHandle
      {...props}
      className={join("hashti-image-cropper-handle", props.className)}
    />
  );
}

function ImageCropperZoom(props: ComponentProps<typeof UiImageCropperZoom>) {
  return (
    <UiImageCropperZoom
      {...props}
      className={join("hashti-image-cropper-zoom", props.className)}
    />
  );
}

function ImageCropperRotate(
  props: ComponentProps<typeof UiImageCropperRotate>,
) {
  return (
    <UiImageCropperRotate
      {...props}
      className={join("hashti-image-cropper-rotate", props.className)}
    />
  );
}

function ImageCropperFlip(props: ComponentProps<typeof UiImageCropperFlip>) {
  return (
    <UiImageCropperFlip
      {...props}
      className={join("hashti-image-cropper-flip", props.className)}
    />
  );
}

export {
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
};
