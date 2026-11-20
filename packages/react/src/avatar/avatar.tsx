"use client";

import type { ComponentProps } from "react";
import {
  Avatar as UiAvatar,
  AvatarImage as UiAvatarImage,
  AvatarFallback as UiAvatarFallback,
} from "@ui-sdk/react/avatar";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends ComponentProps<typeof UiAvatar> {
  size?: AvatarSize;
}

function Avatar({ size, className, ...props }: AvatarProps) {
  return (
    <UiAvatar
      className={`hashti-avatar${className ? ` ${className}` : ""}`}
      data-size={size}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof UiAvatarImage>) {
  return (
    <UiAvatarImage
      className={`hashti-avatar__image${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof UiAvatarFallback>) {
  return (
    <UiAvatarFallback
      className={`hashti-avatar__fallback${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, type AvatarSize };
