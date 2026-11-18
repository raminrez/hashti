import { useState } from "react";
import { Drawer, Button } from "@hashti/react";

export function SheetLiveDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open Gesture Sheet
      </Button>

      <Drawer
        side="bottom"
        open={open}
        onOpenChange={setOpen}
        snapPoints={["35%", "70%", "95%"]}
        defaultSnapPoint="70%"
      >
        <Drawer.Backdrop />
        <Drawer.Content>
          <Drawer.Handle />
          <Drawer.Title>Persian Architectural Vestibule</Drawer.Title>
          <Drawer.Description>
            Swipe down or tap the backdrop to dismiss the sheet.
          </Drawer.Description>
          <div className="space-y-4 py-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The <strong>Hashti</strong> is an octagonal transitional threshold designed to create
              an intentional sensory pause between the public bazaar and the domestic courtyard
              sanctuary.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Drawer.Close render={<Button variant="secondary">Close</Button>} />
              <Drawer.Close render={<Button variant="primary">Confirm Spatial Layout</Button>} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  );
}
