"use client"

import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  toast,
} from "@hashti/react"

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export function ToastDemo() {
  const attempts = React.useRef(0)

  function save(): Promise<void> {
    const succeeds = ++attempts.current % 2 === 1
    return new Promise((resolve, reject) =>
      setTimeout(() => (succeeds ? resolve() : reject(new Error("Network error"))), 1500),
    )
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        type="button"
        className="hashti-button"
        data-variant="secondary"
        onClick={() => toast("Event created", { description: "Friday at 10:00 AM" })}
      >
        Default
      </button>
      <button
        type="button"
        className="hashti-button"
        data-variant="secondary"
        onClick={() => toast.success("Saved")}
      >
        Success
      </button>
      <button
        type="button"
        className="hashti-button"
        data-variant="secondary"
        onClick={() => toast.warning("Storage almost full")}
      >
        Warning
      </button>
      <button
        type="button"
        className="hashti-button"
        data-variant="danger"
        onClick={() => toast.error("Couldn't save. Try again.")}
      >
        Error
      </button>
      <button
        type="button"
        className="hashti-button"
        data-variant="secondary"
        onClick={() =>
          toast.promise(save, {
            loading: "Saving changes…",
            success: "Changes saved",
            error: "Couldn't save. Try again.",
          })
        }
      >
        Promise
      </button>
      <ToastRegion>
        {() => (
          <Toast>
            <span className="hashti-toast__icons" aria-hidden="true">
              <CheckIcon data-show="success" />
              <AlertIcon data-show="error" />
              <span className="hashti-toast__spinner" data-show="loading" />
            </span>
            <ToastTitle />
            <ToastDescription />
            <ToastClose aria-label="Dismiss" />
          </Toast>
        )}
      </ToastRegion>
    </div>
  )
}
