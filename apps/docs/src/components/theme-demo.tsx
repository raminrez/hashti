"use client";

import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Theme,
} from "@hashti/react";

export function ThemeDemo() {
  return (
    <>
      <Theme theme="dark">
        <Dialog>
          <DialogTrigger>Open project details</DialogTrigger>
          <DialogBackdrop />
          <DialogContent>
            <DialogTitle>Project details</DialogTitle>
            <DialogDescription>
              The dialog portals into this themed container, so it keeps the
              dark tokens even when the document is light.
            </DialogDescription>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      </Theme>
      <Theme theme="light">
        <Button>Light button</Button>
      </Theme>
      <Theme theme="system">
        <Button>System button</Button>
      </Theme>
    </>
  );
}
