"use client"

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@hashti/react"

export function CollapsibleDemo() {
  return (
    <Collapsible style={{ maxWidth: 480 }}>
      <CollapsibleTrigger>What is the refund policy?</CollapsibleTrigger>
      <CollapsiblePanel>
        Full refunds within 30 days of delivery, no questions asked.
      </CollapsiblePanel>
    </Collapsible>
  )
}
