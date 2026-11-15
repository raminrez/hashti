import type { SVGProps } from "react";

const paths = {
  arrowRight: "M2 8h12M9 3l5 5-5 5",
  chevronDown: "m4 6 4 4 4-4",
  chevronRight: "m6 4 4 4-4 4",
  chevronLeft: "m10 4-4 4 4 4",
  check: "m3 8 3 3 7-7",
  close: "m4 4 8 8M4 12l8-8",
  plus: "M8 2v12M2 8h12",
  minus: "M3 8h10",
  search: "M10.5 10.5 14 14M12 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  calendar: "M3 3h10v11H3V3Zm0 4h10M5 1v4M11 1v4",
  copy: "M6 6h8v8H6V6ZM3 10H2V2h8v1",
  upload: "M8 11V2M4 6l4-4 4 4M2 11v3h12v-3",
  download: "M8 2v9M4 7l4 4 4-4M2 12v2h12v-2",
  info: "M8 7v4M8 4.5v.5M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0",
  warning: "M8 2 1 14h14L8 2Zm0 4v4M8 11.5v.5",
  error: "m6 6 4 4M6 10l4-4M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0",
  success: "m5 8 2 2 4-4M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0",
  overflow: "M8 3v.01M8 8v.01M8 13v.01",
  settings: "M2 4h12M2 12h12M5 2v4M11 10v4",
  code: "m5 4-4 4 4 4M11 4l4 4-4 4M9 2 7 14",
  folder: "M1.5 4h5l1.5 2h6.5v7h-13V4Z",
  file: "M3 1h6l4 4v10H3V1Zm6 0v4h4",
  external: "M9 2h5v5M14 2 7 9M6 3H2v11h11v-4",
  menu: "M2 4h12M2 8h12M2 12h12",
  sun: "M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  moon: "M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8Z",
  user: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1c-3 0-6 1.5-6 3v1h12v-1c0-1.5-3-3-6-3Z",
  star: "m8 2 1.8 3.6L14 6.4l-3 2.9.7 4.1L8 11.4l-3.7 2 .7-4.1-3-2.9 4.2-.8L8 2Z",
  sparkle: "M8 1v3M8 12v3M1 8h3M12 8h3M3 3l2.5 2.5M10.5 10.5 13 13M3 13l2.5-2.5M10.5 5.5 13 3",
  undo: "M4 7h7a3 3 0 1 1 0 6H9M4 7l3-3M4 7l3 3",
  trash: "M3 4h10M6 2h4M5 4v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4M7 6v5M9 6v5",
  alert: "M8 2 1 14h14L8 2Zm0 4v4M8 11.5v.5",
  inbox: "M2 3h12v10H2V3Zm0 7h4l1 2h2l1-2h4",
  image: "M2 3h12v10H2V3Zm0 8 3-3 3 3 2-2 4 4M10 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
  command:
    "M5 2v6h6V2M3 8a2 2 0 1 0 2 2V8H3Zm10 0a2 2 0 1 1-2 2V8h2ZM5 8a2 2 0 1 1-2 2h2V8Zm6 0a2 2 0 1 0 2 2h-2V8Z",
} as const;

export type IconName = keyof typeof paths;
export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: 16 | 20 | 24 | 32;
}

/** Small structural glyphs on a 16 px grid. Label the enclosing control. */
export function Icon({ name, size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "overflow" ? 2.5 : 1.25}
      strokeLinecap={name === "overflow" ? "round" : "square"}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
