"use client";

import { useRef, useState, type ClipboardEvent, type KeyboardEvent, type Ref } from "react";
import { cx } from "../../utils";

export interface InputOTPProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  isDisabled?: boolean;
  isInvalid?: boolean;
  "aria-label"?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function InputOTP({
  length = 6,
  value: controlledValue,
  defaultValue = "",
  onChange,
  onComplete,
  isDisabled = false,
  isInvalid = false,
  "aria-label": ariaLabel = "One-time code",
  className,
  ref,
}: InputOTPProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const rawValue = isControlled ? controlledValue : internalValue;
  const digits = rawValue.split("").slice(0, length);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateValue = (newVal: string) => {
    const trimmed = newVal.slice(0, length);
    if (!isControlled) {
      setInternalValue(trimmed);
    }
    onChange?.(trimmed);
    if (trimmed.length === length) {
      onComplete?.(trimmed);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const currentDigits = [...digits];
      if (currentDigits[index]) {
        currentDigits[index] = "";
        updateValue(currentDigits.join(""));
      } else if (index > 0) {
        currentDigits[index - 1] = "";
        updateValue(currentDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (index: number, char: string) => {
    const clean = char.replace(/[^0-9]/g, "");
    if (!clean) return;

    const currentDigits = Array.from({ length }, (_, i) => digits[i] ?? "");
    currentDigits[index] = clean[clean.length - 1] ?? "";
    const nextVal = currentDigits.join("");
    updateValue(nextVal);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;

    updateValue(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={cx("hashti-input-otp", className)}
    >
      {Array.from({ length }, (_, index) => {
        const digit = digits[index] ?? "";
        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            disabled={isDisabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={isInvalid || undefined}
            data-filled={digit ? "true" : undefined}
            data-invalid={isInvalid ? "true" : undefined}
            className="hashti-input-otp-slot"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
          />
        );
      })}
    </div>
  );
}
