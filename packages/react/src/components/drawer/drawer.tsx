"use client";

import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import {
  Drawer as UiSdkDrawer,
  DrawerTrigger as UiSdkDrawerTrigger,
  DrawerBackdrop as UiSdkDrawerBackdrop,
  DrawerContent as UiSdkDrawerContent,
  DrawerHandle as UiSdkDrawerHandle,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerShortcut,
  DrawerOutlet,
  createDrawerController,
  sheetPhysics,
} from "@ui-sdk/react/drawer";
import type { DialogBackdropVariant } from "../dialog";
import { useOverlayTheme } from "../../theme";
import { cx, uiClass } from "../../utils";

export type DrawerSide = "top" | "right" | "bottom" | "left" | "start" | "end";
export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";
export type { SnapPoint } from "@ui-sdk/react/drawer";

interface DrawerContextValue {
  backdrop: DialogBackdropVariant;
  appearanceClassName?: string;
  theme: { dir?: string; lang?: string; [attribute: string]: unknown };
}

const DrawerContext = createContext<DrawerContextValue>({ backdrop: "dim", theme: {} });

export interface DrawerRootProps extends ComponentProps<typeof UiSdkDrawer> {
  /** The scrim behind the drawer: `dim` (default), `blur`, or `none`. */
  backdrop?: DialogBackdropVariant;
  /**
   * Whether the sheet follows a pointer drag. Set false for desktop panel-from-edge
   * surfaces that only open and close.
   *
   * ui-sdk gates swipe, Escape and outside-press dismissal behind the one
   * `dismissible` switch, so `draggable={false}` maps to `dismissible={false}`:
   * dismiss a non-draggable panel through `Drawer.Close`, a trigger, or a
   * controller. Pass `dismissible` explicitly to override.
   *
   * @default true
   */
  draggable?: boolean;
}

function DrawerRoot({
  backdrop = "dim",
  draggable = true,
  dismissible,
  children,
  ...props
}: DrawerRootProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <DrawerContext.Provider value={{ backdrop, appearanceClassName, theme }}>
      <UiSdkDrawer {...props} dismissible={dismissible ?? draggable}>
        {children}
      </UiSdkDrawer>
    </DrawerContext.Provider>
  );
}

export type DrawerTriggerProps = ComponentProps<typeof UiSdkDrawerTrigger>;

function DrawerTrigger({ className, ...props }: DrawerTriggerProps) {
  return (
    <UiSdkDrawerTrigger {...props} className={uiClass(className, "hashti-drawer-trigger")} />
  );
}

export type DrawerBackdropProps = ComponentProps<typeof UiSdkDrawerBackdrop>;

function DrawerBackdrop({ className, ...props }: DrawerBackdropProps) {
  const { backdrop, appearanceClassName, theme } = useContext(DrawerContext);
  return (
    <UiSdkDrawerBackdrop
      {...props}
      {...theme}
      data-backdrop={backdrop}
      className={uiClass(className, "hashti-overlay", appearanceClassName)}
    />
  );
}

export interface DrawerContentProps extends ComponentProps<typeof UiSdkDrawerContent> {
  size?: DrawerSize;
}

function DrawerContent({ size = "md", className, ...props }: DrawerContentProps) {
  const { appearanceClassName, theme } = useContext(DrawerContext);
  return (
    <UiSdkDrawerContent
      {...props}
      {...theme}
      data-size={size}
      className={uiClass(className, "hashti-drawer", appearanceClassName)}
    />
  );
}

export type DrawerHandleProps = ComponentProps<typeof UiSdkDrawerHandle>;

function DrawerHandle({ className, ...props }: DrawerHandleProps) {
  return (
    <UiSdkDrawerHandle
      aria-label="Resize drawer"
      {...props}
      className={uiClass(className, "hashti-sheet-handle")}
    />
  );
}

interface DrawerCompound {
  (props: DrawerRootProps): ReactNode;
  Trigger: typeof DrawerTrigger;
  Backdrop: typeof DrawerBackdrop;
  Content: typeof DrawerContent;
  Handle: typeof DrawerHandle;
  Title: typeof DrawerTitle;
  Description: typeof DrawerDescription;
  Close: typeof DrawerClose;
  Shortcut: typeof DrawerShortcut;
  Outlet: typeof DrawerOutlet;
}

export const Drawer: DrawerCompound = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Backdrop: DrawerBackdrop,
  Content: DrawerContent,
  Handle: DrawerHandle,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  Shortcut: DrawerShortcut,
  Outlet: DrawerOutlet,
});

export {
  createDrawerController,
  sheetPhysics,
  DrawerRoot,
  DrawerTrigger,
  DrawerBackdrop,
  DrawerContent,
  DrawerHandle,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerShortcut,
  DrawerOutlet,
};
