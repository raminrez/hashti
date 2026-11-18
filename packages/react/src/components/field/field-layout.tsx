"use client";

import type { ReactNode } from "react";
import { useTheme } from "../../theme";
import {
  FieldDescription,
  FieldErrorMessage,
  FieldHelp,
  FieldLabel,
  FieldStatusIcon,
  FieldStatusMessage,
} from "./field-parts";

export interface FieldContentProps {
  label?: ReactNode;
  labelTooltip?: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
}

/**
 * The reading order every typed field shares: label, guidance (before the
 * control in the frame themes), the control itself, then recovery and status.
 */
export function FieldLayout({
  label,
  labelTooltip,
  description,
  errorMessage,
  children,
  inlineIcon,
}: FieldContentProps & { children: ReactNode; inlineIcon?: boolean }) {
  const { theme } = useTheme();
  const isFrame = theme === "frame-light" || theme === "frame-dark" || theme.startsWith("hashti-");
  return (
    <>
      {label != null && <FieldLabel labelTooltip={labelTooltip}>{label}</FieldLabel>}
      {isFrame && description != null && <FieldDescription>{description}</FieldDescription>}
      {children}
      {inlineIcon && <FieldStatusIcon />}
      <FieldHelp>
        {!isFrame && description != null && <FieldDescription>{description}</FieldDescription>}
        {errorMessage != null && <FieldErrorMessage>{errorMessage}</FieldErrorMessage>}
        <FieldStatusMessage />
      </FieldHelp>
    </>
  );
}
