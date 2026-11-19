"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  toast,
} from "@hashti/react"

export function ToastDemo() {
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
      <ToastRegion>
        {() => (
          <Toast>
            <ToastTitle />
            <ToastDescription />
            <ToastClose aria-label="Dismiss" />
          </Toast>
        )}
      </ToastRegion>
    </div>
  )
}
