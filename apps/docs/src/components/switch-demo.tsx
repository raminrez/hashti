"use client";

import { Switch, SwitchThumb } from "@hashti/react";

export function SwitchDemo() {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <label className="hashti-choice">
        Airplane mode
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
      </label>
      <label className="hashti-choice">
        Weekly digest
        <Switch>
          <SwitchThumb />
        </Switch>
      </label>
      <label className="hashti-choice">
        Managed by organization
        <Switch disabled defaultChecked>
          <SwitchThumb />
        </Switch>
      </label>
      <label className="hashti-choice">
        Compact switch
        <Switch size="sm">
          <SwitchThumb />
        </Switch>
      </label>
    </div>
  );
}
