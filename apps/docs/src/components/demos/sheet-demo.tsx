import { useState } from "react";
import { Sheet, Button } from "@hashti/react";

export function SheetLiveDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        Open Gesture Sheet
      </Button>

      <Sheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        snapPoints={["35%", "70%", "95%"]}
        defaultSnapPoint="70%"
      >
        <Sheet.Header>
          <Sheet.Title>Persian Architectural Vestibule</Sheet.Title>
          <Sheet.Description>
            Swipe down or tap the backdrop to dismiss the sheet.
          </Sheet.Description>
        </Sheet.Header>
        <Sheet.Content className="space-y-4 py-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            The <strong>Hashti</strong> is an octagonal transitional threshold designed to create an
            intentional sensory pause between the public bazaar and the domestic courtyard
            sanctuary.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onPress={() => setIsOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onPress={() => setIsOpen(false)}>
              Confirm Spatial Layout
            </Button>
          </div>
        </Sheet.Content>
      </Sheet>
    </div>
  );
}
