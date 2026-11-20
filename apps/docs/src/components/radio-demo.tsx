"use client";

import { Radio, RadioGroup, RadioIndicator } from "@hashti/react";

export function RadioDemo() {
  return (
    <RadioGroup defaultValue="standard">
      <label className="hashti-choice">
        <Radio value="standard">
          <RadioIndicator />
        </Radio>
        Standard
      </label>
      <label className="hashti-choice">
        <Radio value="express">
          <RadioIndicator />
        </Radio>
        Express
      </label>
      <label className="hashti-choice">
        <Radio value="overnight" disabled>
          <RadioIndicator />
        </Radio>
        Overnight (unavailable)
      </label>
    </RadioGroup>
  );
}
