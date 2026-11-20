"use client"

import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@hashti/react"

export function DrawerDemo() {
  return (
    <Drawer side="end">
      <DrawerTrigger>Open details</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent style={{ inlineSize: "20rem" }}>
        <DrawerTitle>Project details</DrawerTitle>
        <DrawerDescription>
          Everything about this project, from the side.
        </DrawerDescription>
        <DrawerClose>Close</DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
