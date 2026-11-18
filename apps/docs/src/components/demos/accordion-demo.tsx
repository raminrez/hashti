import { useState } from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionPanel } from "@hashti/react";

export function AccordionLiveDemo() {
  const [open, setOpen] = useState<string[]>(["intro"]);

  return (
    <div className="w-full max-w-md space-y-4">
      <Accordion value={open} onValueChange={(next) => setOpen(next)}>
        <AccordionItem value="intro">
          <AccordionHeader>
            <AccordionTrigger>Persian Octagonal Spatial Logic</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 p-2">
              The geometry of the Hashti functions as an acoustic baffle and thermal buffer,
              providing spatial gradation between the harsh exterior bazaar and the private
              domestic courtyard.
            </p>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Accordion defaultValue={["item-1"]} aria-label="Hashti thresholds">
        <AccordionItem value="item-1">
          <AccordionHeader headingLevel={3}>
            <AccordionTrigger>Threshold 01: Sar-Dar (Portal)</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 p-2">
              The entrance portal welcoming guests with monumental tilework and niche vaulted
              geometries.
            </p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionHeader headingLevel={3}>
            <AccordionTrigger>Threshold 02: Dalan (Corridor)</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 p-2">
              The angled transition passage preventing direct sightlines into family living spaces.
            </p>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
