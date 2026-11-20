"use client";

import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@hashti/react";
import { DrawerHandle } from "@ui-sdk/react/drawer";

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
  );
}

const places = [
  { name: "Blue Bottle Coffee", detail: "Coffee · 0.2 mi" },
  { name: "Tartine Bakery", detail: "Bakery · 0.4 mi" },
  { name: "Dolores Park", detail: "Park · 0.5 mi" },
  { name: "Mission Dolores", detail: "Landmark · 0.6 mi" },
  { name: "Ritual Coffee Roasters", detail: "Coffee · 0.7 mi" },
  { name: "Bi-Rite Creamery", detail: "Ice cream · 0.7 mi" },
];

export function DrawerSnapPointsDemo() {
  return (
    <Drawer snapPoints={[0.25, 0.5, 1]} defaultSnapPoint={0.5}>
      <DrawerTrigger>Find a place</DrawerTrigger>
      <DrawerBackdrop />
      <DrawerContent style={{ blockSize: "calc(100dvh - 3rem)" }}>
        <DrawerHandle className="hashti-drawer-handle" aria-label="Resize" />
        <DrawerTitle>Places nearby</DrawerTitle>
        <DrawerDescription>
          Drag the drawer, or press the handle, to see more.
        </DrawerDescription>
        <ul>
          {places.map((place) => (
            <li key={place.name}>
              <div>{place.name}</div>
              <div className="hashti-drawer__description">{place.detail}</div>
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  );
}
