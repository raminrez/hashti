"use client"

import {
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallRow,
  WaterfallRowHeader,
} from "@hashti/react"

const requests = [
  { value: "document", label: "/", start: 0, duration: 182 },
  { value: "styles", label: "app.css", start: 190, duration: 96 },
  { value: "script", label: "app.js", start: 192, duration: 410 },
]

export function WaterfallDemo() {
  return (
    <Waterfall aria-label="Network requests" items={requests}>
      <WaterfallHeaderRow>
        <WaterfallColumnHeader>Name</WaterfallColumnHeader>
        <WaterfallColumnHeader aria-label="Timeline">
          <WaterfallAxis maxTicks={4} />
        </WaterfallColumnHeader>
      </WaterfallHeaderRow>
      {requests.map((request) => (
        <WaterfallRow key={request.value} value={request.value}>
          <WaterfallRowHeader>{request.label}</WaterfallRowHeader>
          <WaterfallBar />
        </WaterfallRow>
      ))}
    </Waterfall>
  )
}
