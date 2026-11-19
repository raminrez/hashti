"use client"

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@hashti/react"

export function AccordionDemo() {
  return (
    <Accordion collapsible>
      <AccordionItem value="shipping">
        <AccordionHeader>
          <AccordionTrigger>Shipping</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Orders arrive in five to seven days.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionHeader>
          <AccordionTrigger>Returns</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Free returns within 30 days of delivery.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="warranty">
        <AccordionHeader>
          <AccordionTrigger>Warranty</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>Two years, covering parts and labor.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
