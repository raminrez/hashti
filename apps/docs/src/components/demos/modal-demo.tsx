import { useState } from "react";
import { Dialog, Button } from "@hashti/react";

export function ModalLiveDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open Modal Dialog
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Backdrop />
        <Dialog.Content>
          <div className="space-y-4">
            <Dialog.Title className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Architectural Threshold Confirmation
            </Dialog.Title>
            <Dialog.Description className="text-sm text-neutral-600 dark:text-neutral-400">
              You are transitioning from the exterior street into the octagonal vestibule. The
              interior environment provides acoustic damping and diffused natural light.
            </Dialog.Description>
            <div className="flex justify-end gap-3 pt-3">
              <Dialog.Close render={<Button variant="secondary">Cancel</Button>} />
              <Dialog.Close render={<Button variant="primary">Proceed Through Portal</Button>} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
