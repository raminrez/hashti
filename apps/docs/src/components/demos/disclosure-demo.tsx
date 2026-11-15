import { useState } from "react";
import { Disclosure, DisclosureGroup, DisclosureTrigger, DisclosurePanel } from "@hashti/react";

export function DisclosureLiveDemo() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full max-w-md space-y-4">
      <Disclosure isExpanded={isOpen} onExpandedChange={setIsOpen}>
        <DisclosureTrigger>Persian Octagonal Spatial Logic</DisclosureTrigger>
        <DisclosurePanel>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 p-2">
            The geometry of the Hashti functions as an acoustic baffle and thermal buffer, providing
            spatial gradation between the harsh exterior bazaar and the private domestic courtyard.
          </p>
        </DisclosurePanel>
      </Disclosure>

      <DisclosureGroup defaultExpandedKeys={["item-1"]} aria-label="Hashti thresholds">
        <Disclosure id="item-1">
          <DisclosureTrigger headingLevel={3}>Threshold 01: Sar-Dar (Portal)</DisclosureTrigger>
          <DisclosurePanel>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 p-2">
              The entrance portal welcoming guests with monumental tilework and niche vaulted
              geometries.
            </p>
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="item-2">
          <DisclosureTrigger headingLevel={3}>Threshold 02: Dalan (Corridor)</DisclosureTrigger>
          <DisclosurePanel>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 p-2">
              The angled transition passage preventing direct sightlines into family living spaces.
            </p>
          </DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>
    </div>
  );
}
