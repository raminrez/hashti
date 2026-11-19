"use client"

import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue } from "@hashti/react"

export function ProgressDemo() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 360 }}>
      <Progress value={65} aria-label="Uploading">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Progress value={65}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
        <ProgressValue />
      </Progress>
      <Progress aria-label="Scanning">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Progress value={100} aria-label="Finished">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  )
}
