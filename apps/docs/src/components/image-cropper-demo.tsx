"use client";

import {
  ImageCropper,
  ImageCropperFlip,
  ImageCropperGrid,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperRotate,
  ImageCropperSelection,
  ImageCropperViewport,
  ImageCropperZoom,
} from "@hashti/react";

const photo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420"><rect width="640" height="420" fill="#e5e5e5"/><circle cx="460" cy="150" r="56" fill="#fafafa"/><path d="M0 280 120 170l110 100 120-130 130 125 90-60 70 40v175H0z" fill="#a3a3a3"/><path d="M0 330l160-80 120 70 150-80 210 85v95H0z" fill="#525252"/><path d="M0 380q160-35 320-10t320-5v55H0z" fill="#262626"/></svg>`,
)}`;

export function ImageCropperDemo() {
  return (
    <ImageCropper
      aria-label="Cover photo"
      src={photo}
      aspectRatio={16 / 9}
      style={{ maxWidth: 360 }}
    >
      <ImageCropperViewport style={{ blockSize: 240 }}>
        <ImageCropperImage alt="Mountains at sunset" />
        <ImageCropperSelection>
          <ImageCropperGrid />
        </ImageCropperSelection>
        <ImageCropperHandle position="nw" />
        <ImageCropperHandle position="ne" />
        <ImageCropperHandle position="sw" />
        <ImageCropperHandle position="se" />
      </ImageCropperViewport>
      <div className="hashti-image-cropper__controls">
        <ImageCropperZoom aria-label="Zoom" />
        <ImageCropperRotate>Rotate</ImageCropperRotate>
        <ImageCropperFlip>Flip</ImageCropperFlip>
      </div>
    </ImageCropper>
  );
}
