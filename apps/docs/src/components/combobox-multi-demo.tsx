"use client";

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@hashti/react";

const skills = ["TypeScript", "React", "CSS", "Accessibility", "Testing"];

const label = (value: string) => value;

function XIcon() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
      <path
        d="M2 2l8 8M10 2l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ComboboxMultiDemo() {
  // The root renders no element, so the width lives on a wrapping div.
  return (
    <div style={{ maxWidth: 320 }}>
      <Combobox multiple defaultValue={["TypeScript"]} itemToLabel={label}>
        <ComboboxLabel>Skills</ComboboxLabel>
        <ComboboxChips>
          <ComboboxValue>
            {(state) =>
              // Multiple mode guarantees string values; the generic value type is unknown.
              // oxlint-disable-next-line typescript/no-unsafe-type-assertion
              (state.value as string[]).map((value, index) => (
                <ComboboxChip key={value} value={value}>
                  {state.labels[index]}
                  <ComboboxChipRemove
                    aria-label={`Remove ${state.labels[index]}`}
                  >
                    <XIcon />
                  </ComboboxChipRemove>
                </ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxInput placeholder="Add a skill…" />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            {skills.map((skill) => (
              <ComboboxItem key={skill} value={skill}>
                {skill}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
