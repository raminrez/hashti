"use client"

import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "@hashti/react"

export function MeterDemo() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 360 }}>
      <Meter value={40}>
        <MeterLabel>Storage</MeterLabel>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
        <MeterValue />
      </Meter>
      <Meter value={92} data-tone="warning" aria-label="CPU">
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
      <Meter value={98} data-tone="danger" aria-label="Quota">
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  )
}
