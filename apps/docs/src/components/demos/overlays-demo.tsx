import { useState } from "react";
import {
  Button,
  Dialog,
  AlertDialog,
  Popover,
  Tooltip,
  TooltipTrigger,
  Drawer,
  PreviewTrigger,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuTrigger,
  Separator,
} from "@hashti/react";

export function DialogLiveDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onPress={() => setOpen(true)}>Open Architectural Dialog</Button>
      {open && (
        <Dialog
          aria-label="Spatial Configuration"
          className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full"
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Vestibule Threshold Configuration
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Configure zenithal skylight diffusion angle and masonry bench orientation.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onPress={() => setOpen(false)}>
                Confirm Settings
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export function AlertDialogLiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button variant="danger" onPress={() => setIsOpen(true)}>
        Revoke Ingress Certificate
      </Button>
      {isOpen && (
        <AlertDialog
          title="Revoke Ingress Certificate?"
          confirmLabel="Revoke Access"
          cancelLabel="Keep Active"
          onConfirm={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
          tone="danger"
        >
          This action will immediately terminate all active TLS sessions through the Darvazeh
          portal.
        </AlertDialog>
      )}
    </div>
  );
}

export function PopoverLiveDemo() {
  return (
    <DialogTrigger>
      <Button variant="secondary">View Spatial Telemetry</Button>
      <Popover className="p-4 w-72 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--hashti-focus)] font-mono">
            Vestibule Optics
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Zenith angle is currently aligned at 32° incidence. Ambient temperature is normalized at
            21°C.
          </p>
        </div>
      </Popover>
    </DialogTrigger>
  );
}

export function MenuLiveDemo() {
  const [action, setAction] = useState("None");
  return (
    <div className="flex flex-wrap items-center gap-4">
      <MenuTrigger>
        <Button variant="secondary">Repository actions</Button>
        <Popover>
          <Menu onAction={(key) => setAction(String(key))}>
            <MenuItem id="view">View details</MenuItem>
            <MenuItem id="duplicate">Duplicate repository</MenuItem>
            <MenuItem id="archive">Archive repository</MenuItem>
            <Separator />
            <MenuItem id="delete" data-danger>
              Delete repository
            </MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
      <span className="text-sm text-neutral-500">Last action: {action}</span>
    </div>
  );
}

export function TooltipLiveDemo() {
  return (
    <div className="flex items-center gap-4">
      <TooltipTrigger delay={100}>
        <Button variant="ghost">Hover for Tooltip</Button>
        <Tooltip>Tactile touch target meets WCAG 2.2 AAA specifications</Tooltip>
      </TooltipTrigger>
    </div>
  );
}

export function DrawerLiveDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="secondary" onPress={() => setOpen(true)}>
        Open Side Drawer (Dalan)
      </Button>
      <Drawer
        isOpen={open}
        onOpenChange={setOpen}
        title="Dalan Corridor Inspection"
        position="right"
      >
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The 90-degree indirect corridor protects the domestic courtyard from sudden public
            scrutiny while exposing progressive state controls.
          </p>
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
            <Button size="sm" onPress={() => setOpen(false)}>
              Close Drawer
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export function PreviewTriggerLiveDemo() {
  return (
    <PreviewTrigger
      preview={
        <div className="p-3 max-w-xs text-xs bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800">
          <strong className="block font-semibold text-[var(--hashti-focus)]">
            Isfahan Pavilion
          </strong>
          <span className="text-neutral-500">
            Historical vaulted octagonal chamber with central zenithal skylight.
          </span>
        </div>
      }
    >
      <span className="underline decoration-[var(--hashti-focus)] decoration-2 cursor-pointer font-medium">
        Hover to preview Isfahan Pavilion
      </span>
    </PreviewTrigger>
  );
}
