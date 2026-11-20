"use client"

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@hashti/react"

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete project</AlertDialogTrigger>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
        <AlertDialogDescription>
          This removes every file and comment. It cannot be undone.
        </AlertDialogDescription>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <AlertDialogClose value="cancel">Cancel</AlertDialogClose>
          <AlertDialogClose value="confirm" data-danger>
            Delete
          </AlertDialogClose>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
