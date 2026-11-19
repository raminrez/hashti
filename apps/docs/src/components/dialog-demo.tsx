"use client"

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@hashti/react"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger>Open project details</DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <DialogTitle>Project details</DialogTitle>
        <DialogDescription>
          Review the details before continuing.
        </DialogDescription>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
