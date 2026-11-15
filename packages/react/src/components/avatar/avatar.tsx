"use client";

import {
  Children,
  createContext,
  useContext,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from "react";
import { Icon } from "../../icons";
import { cx } from "../../utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarPresence = "online" | "offline" | "away" | "busy" | "dnd";

const AvatarGroupContext = createContext<{
  size?: AvatarSize;
} | null>(null);

export interface AvatarProps extends ComponentPropsWithRef<"div"> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  presence?: AvatarPresence;
  presenceLabel?: string;
  fallback?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Extracts grapheme-safe initials (supporting Persian/Arabic grapheme clusters). */
export function getInitials(name: string, locale?: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  const firstWord = parts[0] ?? "";
  const lastWord = parts[parts.length - 1] ?? "";

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(locale ?? "und", { granularity: "grapheme" });
    const getFirstGrapheme = (str: string) => {
      const segments = Array.from(segmenter.segment(str));
      return segments[0]?.segment ?? "";
    };
    if (parts.length === 1) {
      return getFirstGrapheme(firstWord);
    }
    return getFirstGrapheme(firstWord) + getFirstGrapheme(lastWord);
  }

  // Fallback
  if (parts.length === 1) return Array.from(firstWord)[0] ?? "";
  return (Array.from(firstWord)[0] ?? "") + (Array.from(lastWord)[0] ?? "");
}

export function Avatar({
  src,
  alt = "",
  name,
  size: sizeProp,
  presence,
  presenceLabel,
  fallback,
  className,
  ref,
  ...props
}: AvatarProps) {
  const groupContext = useContext(AvatarGroupContext);
  const size = sizeProp ?? groupContext?.size ?? "md";
  const [imageFailed, setImageFailed] = useState(false);

  const initials = name ? getInitials(name, props.lang) : undefined;
  const showImage = Boolean(src && !imageFailed);

  return (
    <div
      {...props}
      ref={ref}
      role="img"
      aria-label={props["aria-label"] ?? name ?? alt ?? "Avatar"}
      data-size={size}
      className={cx("hashti-avatar", className)}
    >
      <div className="hashti-avatar-inner">
        {showImage ? (
          <img src={src} alt={alt} onError={() => setImageFailed(true)} />
        ) : initials ? (
          <span aria-hidden="true">{initials}</span>
        ) : fallback ? (
          fallback
        ) : (
          <Icon name="user" size={size === "xs" || size === "sm" ? 16 : 20} />
        )}
      </div>

      {presence && (
        <span
          className="hashti-avatar-presence"
          data-status={presence}
          role="status"
          aria-label={presenceLabel ?? presence}
        />
      )}
    </div>
  );
}

export interface AvatarGroupProps extends ComponentPropsWithRef<"div"> {
  size?: AvatarSize;
  max?: number;
  overflowRenderer?: (count: number) => ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function AvatarGroup({
  size = "md",
  max,
  overflowRenderer,
  children,
  className,
  ref,
  ...props
}: AvatarGroupProps) {
  const allChildren = Children.toArray(children);
  const total = allChildren.length;
  const visibleCount = max != null && max < total ? max : total;
  const overflowCount = total - visibleCount;

  const visibleChildren = allChildren.slice(0, visibleCount);

  return (
    <AvatarGroupContext.Provider value={{ size }}>
      <div {...props} ref={ref} role="group" className={cx("hashti-avatar-group", className)}>
        {visibleChildren}

        {overflowCount > 0 && (
          <span className="hashti-avatar-group-count" aria-label={`${overflowCount} more members`}>
            {overflowRenderer ? overflowRenderer(overflowCount) : `+${overflowCount}`}
          </span>
        )}
      </div>
    </AvatarGroupContext.Provider>
  );
}
