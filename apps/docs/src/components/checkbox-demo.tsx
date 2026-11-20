"use client";

import { Checkbox, CheckboxIndicator } from "@hashti/react";

function CheckGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2 6.5 4.5 9 10 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckboxDemo() {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <label className="hashti-choice">
        <Checkbox defaultChecked>
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Email me product updates
      </label>
      <label className="hashti-choice">
        <Checkbox>
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Subscribe to the newsletter
      </label>
      <label className="hashti-choice">
        <Checkbox defaultChecked="indeterminate">
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Select all notifications
      </label>
      <label className="hashti-choice">
        <Checkbox disabled defaultChecked>
          <CheckboxIndicator>
            <CheckGlyph />
          </CheckboxIndicator>
        </Checkbox>
        Managed by your organization
      </label>
    </div>
  );
}
