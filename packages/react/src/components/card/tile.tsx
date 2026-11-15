"use client";

import { useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { Icon } from "../../icons";

export interface TileProps extends ComponentPropsWithRef<"div"> {
  children: ReactNode;
  as?: "div" | "article" | "section";
}
export function Tile({ className, as: Component = "div", ...props }: TileProps) {
  return <Component {...props} className={["hashti-tile", className].filter(Boolean).join(" ")} />;
}

export interface ClickableTileProps extends ComponentPropsWithRef<"a"> {
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}
export function ClickableTile({ className, disabled, children, ...props }: ClickableTileProps) {
  return (
    <a
      {...props}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : (props.tabIndex ?? 0)}
      data-clickable="true"
      className={[
        "hashti-tile",
        "hashti-tile--clickable",
        disabled && "hashti-tile--disabled",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </a>
  );
}

export interface SelectableTileProps extends Omit<ComponentPropsWithRef<"label">, "onChange"> {
  children: ReactNode;
  id?: string;
  name?: string;
  value?: string;
  selected?: boolean;
  defaultSelected?: boolean;
  onChange?: (selected: boolean) => void;
  disabled?: boolean;
  title?: string;
}
export function SelectableTile({
  children,
  className,
  id,
  name,
  value,
  selected: controlledSelected,
  defaultSelected = false,
  onChange,
  disabled,
  title,
  ...props
}: SelectableTileProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isSelected = controlledSelected !== undefined ? controlledSelected : internalSelected;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;
    if (controlledSelected === undefined) {
      setInternalSelected(next);
    }
    onChange?.(next);
  }

  return (
    <label
      {...props}
      data-selectable="true"
      data-selected={isSelected || undefined}
      data-disabled={disabled || undefined}
      className={[
        "hashti-tile",
        "hashti-tile--selectable",
        isSelected && "hashti-tile--selected",
        disabled && "hashti-tile--disabled",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isSelected}
        disabled={disabled}
        onChange={handleChange}
        className="hashti-visually-hidden"
        title={title}
      />
      <span className="hashti-tile-checkmark" aria-hidden="true">
        <Icon name="check" />
      </span>
      <div className="hashti-tile-content">{children}</div>
    </label>
  );
}

export interface ExpandableTileProps extends Omit<ComponentPropsWithRef<"div">, "onToggle"> {
  children?: ReactNode;
  tileAboveTheFoldContent: ReactNode;
  tileBelowTheFoldContent: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}
export function ExpandableTile({
  className,
  tileAboveTheFoldContent,
  tileBelowTheFoldContent,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onToggle,
  ...props
}: ExpandableTileProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  function toggle() {
    const next = !isExpanded;
    if (controlledExpanded === undefined) {
      setInternalExpanded(next);
    }
    onToggle?.(next);
  }

  return (
    <div
      {...props}
      data-expandable="true"
      data-expanded={isExpanded || undefined}
      className={[
        "hashti-tile",
        "hashti-tile--expandable",
        isExpanded && "hashti-tile--expanded",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="hashti-tile-above-fold">{tileAboveTheFoldContent}</div>
      <button
        type="button"
        aria-expanded={isExpanded}
        className="hashti-tile-expand-button"
        onClick={toggle}
      >
        <span>{isExpanded ? "Show less" : "Show more"}</span>
        <Icon name="chevronDown" />
      </button>
      {isExpanded && <div className="hashti-tile-below-fold">{tileBelowTheFoldContent}</div>}
    </div>
  );
}
