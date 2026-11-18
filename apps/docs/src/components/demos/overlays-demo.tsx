import { useState } from "react";
// Menu separators are RAC collection children until the Menu rewrite (TICK-016).
import { Separator, Menu as RACMenu, MenuItem, MenuTrigger, Popover as RACPopover } from "react-aria-components";
import {
  Button,
  Dialog,
  AlertDialog,
  Popover,
  Tooltip,
  TooltipTrigger,
  Drawer,
} from "@hashti/react";

export function DialogLiveDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Architectural Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Backdrop />
        <Dialog.Content className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full">
          <div className="flex flex-col gap-3">
            <Dialog.Title className="text-lg font-bold text-neutral-900 dark:text-white">
              Vestibule Threshold Configuration
            </Dialog.Title>
            <Dialog.Description className="text-sm text-neutral-600 dark:text-neutral-400">
              Configure zenithal skylight diffusion angle and masonry bench orientation.
            </Dialog.Description>
            <div className="flex justify-end gap-2 mt-4">
              <Dialog.Close render={<Button variant="ghost" size="sm">Cancel</Button>} />
              <Dialog.Close
                render={<Button variant="primary" size="sm">Confirm Settings</Button>}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

export function AlertDialogLiveDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Revoke Ingress Certificate
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Revoke Ingress Certificate?"
        confirmLabel="Revoke Access"
        cancelLabel="Keep Active"
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        variant="danger"
      >
        This action will immediately terminate all active TLS sessions through the Darvazeh portal.
      </AlertDialog>
    </div>
  );
}

export function PopoverLiveDemo() {
  return (
    <Popover>
      <Popover.Trigger render={<Button variant="secondary">View Spatial Telemetry</Button>} />
      <Popover.Content
        sideOffset={8}
        className="p-4 w-72 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl"
      >
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--hashti-focus)] font-mono">
            Vestibule Optics
          </span>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Zenith angle is currently aligned at 32° incidence. Ambient temperature is normalized at
            21°C.
          </p>
        </div>
      </Popover.Content>
    </Popover>
  );
}

export function MenuLiveDemo() {
  const [action, setAction] = useState("None");
  return (
    <div className="flex flex-wrap items-center gap-4">
      <MenuTrigger>
        <Button variant="secondary">Repository actions</Button>
        {/* TICK-007 interim: RAC MenuTrigger needs a RAC popover for overlay context. */}
        <RACPopover className="hashti-popover">
          <RACMenu onAction={(key) => setAction(String(key))}>
            <MenuItem id="view">View details</MenuItem>
            <MenuItem id="duplicate">Duplicate repository</MenuItem>
            <MenuItem id="archive">Archive repository</MenuItem>
            <Separator />
            <MenuItem id="delete" data-danger>
              Delete repository
            </MenuItem>
          </RACMenu>
        </RACPopover>
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
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open Side Drawer (Dalan)
      </Button>
      <Drawer side="end" draggable={false} open={open} onOpenChange={setOpen}>
        <Drawer.Backdrop />
        <Drawer.Content>
          <Drawer.Title>Dalan Corridor Inspection</Drawer.Title>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The 90-degree indirect corridor protects the domestic courtyard from sudden public
              scrutiny while exposing progressive state controls.
            </p>
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <Drawer.Close render={<Button size="sm">Close Drawer</Button>} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  );
}

export function PreviewTriggerLiveDemo() {
  // TICK-007: the RAC PreviewTrigger is gone; Popover openOnHover covers hover previews
  // until TICK-016 adds HoverCard.
  return (
    <Popover openOnHover delay={300} closeDelay={150}>
      <Popover.Trigger
        render={
          <Button variant="ghost" size="sm">
            Hover to preview Isfahan Pavilion
          </Button>
        }
      />
      <Popover.Content
        sideOffset={8}
        className="p-3 max-w-xs text-xs bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800"
      >
        <strong className="block font-semibold text-[var(--hashti-focus)]">Isfahan Pavilion</strong>
        <span className="text-neutral-500">
          Historical vaulted octagonal chamber with central zenithal skylight.
        </span>
      </Popover.Content>
    </Popover>
  );
}
