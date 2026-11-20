"use client"

import { Button, Preferences, createLocalStorage, createPreference, usePreference } from "@hashti/react"

const view = createPreference({
  values: ["list", "grid"],
  defaultValue: "list",
  attribute: "data-view",
  storage: createLocalStorage("hashti-preferences-view"),
})

const files = [
  { name: "Q3 roadmap.pdf", detail: "2.4 MB" },
  { name: "Launch checklist.md", detail: "12 KB" },
  { name: "Offsite photos", detail: "24 items" },
  { name: "Brand assets.zip", detail: "18 MB" },
]

export function PreferencesDemo() {
  const { value } = usePreference(view)

  return (
    <Preferences preferences={[view]}>
      <style>{`
        .preferences-demo__controls { display: flex; gap: 0.5rem; margin-block-end: 0.75rem; }
        .preferences-demo__files { display: grid; gap: 0.5rem; margin: 0; padding: 0; list-style: none; }
        .preferences-demo__files li {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--hashti-border-subtle-00);
          border-radius: var(--hashti-border-radius-08);
        }
        [data-view="grid"] .preferences-demo__files { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .preferences-demo__detail { color: var(--hashti-text-secondary); font-size: 0.8125rem; }
      `}</style>
      <div className="preferences-demo__controls" role="group" aria-label="View">
        <Button size="sm" aria-pressed={value === "list"} onClick={() => view.set("list")}>
          List
        </Button>
        <Button size="sm" aria-pressed={value === "grid"} onClick={() => view.set("grid")}>
          Grid
        </Button>
      </div>
      <ul className="preferences-demo__files" aria-label="Files">
        {files.map((file) => (
          <li key={file.name}>
            <span>{file.name}</span>
            <span className="preferences-demo__detail">{file.detail}</span>
          </li>
        ))}
      </ul>
    </Preferences>
  )
}
