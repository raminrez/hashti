"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Drawer as UiDrawer,
  DrawerBackdrop as UiDrawerBackdrop,
  DrawerClose as UiDrawerClose,
  DrawerContent as UiDrawerContent,
  DrawerDescription as UiDrawerDescription,
  DrawerHandle as UiDrawerHandle,
  DrawerTitle as UiDrawerTitle,
  DrawerTrigger as UiDrawerTrigger,
} from "@ui-sdk/react/drawer";
import { useOverlayTheme } from "../theme";

function Drawer(props: ComponentProps<typeof UiDrawer>) {
  const theme = useOverlayTheme();
  return <UiDrawer container={theme?.container} {...props} />;
}

function DrawerTrigger(props: ComponentProps<typeof UiDrawerTrigger>) {
  return (
    <UiDrawerTrigger
      {...props}
      className={join("hashti-drawer-trigger", props.className)}
    />
  );
}

function DrawerBackdrop(props: ComponentProps<typeof UiDrawerBackdrop>) {
  return (
    <UiDrawerBackdrop
      {...props}
      className={join("hashti-drawer-backdrop", props.className)}
    />
  );
}

function DrawerContent(props: ComponentProps<typeof UiDrawerContent>) {
  return (
    <UiDrawerContent
      {...props}
      className={join("hashti-drawer-content", props.className)}
    />
  );
}

function DrawerTitle(props: ComponentProps<typeof UiDrawerTitle>) {
  return (
    <UiDrawerTitle
      {...props}
      className={join("hashti-drawer__title", props.className)}
    />
  );
}

function DrawerDescription(props: ComponentProps<typeof UiDrawerDescription>) {
  return (
    <UiDrawerDescription
      {...props}
      className={join("hashti-drawer__description", props.className)}
    />
  );
}

function DrawerHandle(props: ComponentProps<typeof UiDrawerHandle>) {
  return (
    <UiDrawerHandle
      {...props}
      className={join("hashti-drawer-handle", props.className)}
    />
  );
}

function DrawerClose(props: ComponentProps<typeof UiDrawerClose>) {
  return (
    <UiDrawerClose
      {...props}
      className={join("hashti-drawer-close", props.className)}
    />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerBackdrop,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerHandle,
  DrawerClose,
};
