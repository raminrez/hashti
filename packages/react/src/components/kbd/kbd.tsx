"use client";

import { useState, type ComponentPropsWithRef, type ReactNode, type Ref } from "react";
import { cx } from "../../utils";

export interface KbdProps extends ComponentPropsWithRef<"kbd"> {
  keys?: string | string[];
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

const MAC_SYMBOLS: Record<string, string> = {
  command: "⌘",
  cmd: "⌘",
  meta: "⌘",
  mod: "⌘",
  shift: "⇧",
  ctrl: "⌃",
  control: "⌃",
  option: "⌥",
  alt: "⌥",
  enter: "↵",
  return: "↵",
  backspace: "⌫",
  delete: "⌦",
  escape: "Esc",
  esc: "Esc",
  tab: "⇥",
  capslock: "⇪",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

const WIN_SYMBOLS: Record<string, string> = {
  command: "Ctrl",
  cmd: "Ctrl",
  meta: "Win",
  mod: "Ctrl",
  shift: "Shift",
  ctrl: "Ctrl",
  control: "Ctrl",
  option: "Alt",
  alt: "Alt",
  enter: "Enter",
  return: "Enter",
  backspace: "Backspace",
  delete: "Del",
  escape: "Esc",
  esc: "Esc",
  tab: "Tab",
  capslock: "Caps",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

function formatKey(key: string, isMac: boolean): string {
  const normalized = key.trim().toLowerCase();
  const map = isMac ? MAC_SYMBOLS : WIN_SYMBOLS;
  if (map[normalized]) return map[normalized];
  if (normalized.length === 1) return normalized.toUpperCase();
  return key;
}

export function Kbd({ keys, children, className, ref, ...props }: KbdProps) {
  const [isMac] = useState(() => {
    if (typeof navigator !== "undefined") {
      const platform =
        (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData
          ?.platform ??
        navigator.platform ??
        navigator.userAgent;
      return /mac|iphone|ipad|ipod/i.test(platform);
    }
    return true;
  });

  const keyList = keys ? (Array.isArray(keys) ? keys : [keys]) : null;

  return (
    <kbd {...props} ref={ref} className={cx("hashti-kbd", className)}>
      {keyList
        ? keyList.map((k, i) => (
            <span key={i} className="hashti-kbd-key">
              {formatKey(k, isMac)}
            </span>
          ))
        : children}
    </kbd>
  );
}
