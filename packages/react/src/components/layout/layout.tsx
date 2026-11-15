"use client";

import type { ComponentPropsWithRef, ReactNode, CSSProperties } from "react";
import { Link, type LinkProps } from "../button";

export interface StackProps extends ComponentPropsWithRef<"div"> {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  orientation?: "horizontal" | "vertical";
}
export function Stack({
  gap = 5,
  orientation = "vertical",
  className,
  style,
  ...props
}: StackProps) {
  return (
    <div
      {...props}
      data-orientation={orientation}
      className={["hashti-stack", className].filter(Boolean).join(" ")}
      style={
        {
          "--stack-gap": `var(--hashti-spacing-${String(gap).padStart(2, "0")}, var(--hashti-spacing-${String(gap).padStart(2, "0")}))`,
          ...style,
        } as CSSProperties
      }
    />
  );
}
export function Grid({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div {...props} className={["hashti-grid", className].filter(Boolean).join(" ")} />;
}
export interface ColumnLayoutProps extends ComponentPropsWithRef<"div"> {
  sm?: 1 | 2 | 3 | 4;
  md?: number;
  lg?: number;
}
export function GridColumn({
  sm = 4,
  md = 8,
  lg = 16,
  className,
  style,
  ...props
}: ColumnLayoutProps) {
  return (
    <div
      {...props}
      className={["hashti-grid-column", className].filter(Boolean).join(" ")}
      style={{ "--grid-sm": sm, "--grid-md": md, "--grid-lg": lg, ...style } as CSSProperties}
    />
  );
}

export interface HeaderProps extends ComponentPropsWithRef<"header"> {
  children: ReactNode;
}
export function Header({ className, ...props }: HeaderProps) {
  return <header {...props} className={["hashti-header", className].filter(Boolean).join(" ")} />;
}
export function HeaderName({ className, ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={
        typeof className === "function"
          ? (state) => `hashti-header-name ${className(state)}`
          : `hashti-header-name ${className ?? ""}`
      }
    />
  );
}
export function HeaderNav({ className, ...props }: ComponentPropsWithRef<"nav">) {
  return <nav {...props} className={["hashti-header-nav", className].filter(Boolean).join(" ")} />;
}
export function SideNav({ className, ...props }: ComponentPropsWithRef<"nav">) {
  return <nav {...props} className={["hashti-side-nav", className].filter(Boolean).join(" ")} />;
}

export type ListProps =
  | ({ ordered: true } & ComponentPropsWithRef<"ol">)
  | ({ ordered?: false } & ComponentPropsWithRef<"ul">);

export function List(props: ListProps) {
  if (props.ordered) {
    const { ordered, className, ...rest } = props;
    return <ol {...rest} className={["hashti-list", className].filter(Boolean).join(" ")} />;
  }
  const { ordered, className, ...rest } = props;
  return <ul {...rest} className={["hashti-list", className].filter(Boolean).join(" ")} />;
}

export interface StructuredListProps extends ComponentPropsWithRef<"dl"> {
  children: ReactNode;
}

export function StructuredList({ className, ...props }: StructuredListProps) {
  return (
    <dl {...props} className={["hashti-structured-list", className].filter(Boolean).join(" ")} />
  );
}

export interface StructuredListRowProps extends ComponentPropsWithRef<"div"> {
  children?: ReactNode;
  label?: ReactNode;
  value?: ReactNode;
}

export function StructuredListRow({
  className,
  children,
  label,
  value,
  ...props
}: StructuredListRowProps) {
  return (
    <div {...props} className={["hashti-structured-list-row", className].filter(Boolean).join(" ")}>
      {label && <dt>{label}</dt>}
      {value && <dd>{value}</dd>}
      {children}
    </div>
  );
}
