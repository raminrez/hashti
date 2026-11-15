import { useState } from "react";
import { Modal, Dialog, Button } from "@hashti/react";

export function ModalLiveDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        Open Modal Dialog
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Dialog>
          {({ close }) => (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Architectural Threshold Confirmation
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                You are transitioning from the exterior street into the octagonal vestibule. The
                interior environment provides acoustic damping and diffused natural light.
              </p>
              <div className="flex justify-end gap-3 pt-3">
                <Button variant="secondary" onPress={close}>
                  Cancel
                </Button>
                <Button variant="primary" onPress={close}>
                  Proceed Through Portal
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </Modal>
    </div>
  );
}
