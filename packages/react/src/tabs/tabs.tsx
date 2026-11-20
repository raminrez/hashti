"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Tabs as UiTabs,
  TabsIndicator as UiTabsIndicator,
  TabsList as UiTabsList,
  TabsPanel as UiTabsPanel,
  TabsTab as UiTabsTab,
} from "@ui-sdk/react/tabs";

function Tabs(props: ComponentProps<typeof UiTabs>) {
  return <UiTabs {...props} className={join("hashti-tabs", props.className)} />;
}

function TabsList(props: ComponentProps<typeof UiTabsList>) {
  return (
    <UiTabsList
      {...props}
      className={join("hashti-tabs-list", props.className)}
    />
  );
}

function TabsTab(props: ComponentProps<typeof UiTabsTab>) {
  return (
    <UiTabsTab
      {...props}
      className={join("hashti-tabs-tab", props.className)}
    />
  );
}

function TabsIndicator(props: ComponentProps<typeof UiTabsIndicator>) {
  return (
    <UiTabsIndicator
      {...props}
      className={join("hashti-tabs-indicator", props.className)}
    />
  );
}

function TabsPanel(props: ComponentProps<typeof UiTabsPanel>) {
  return (
    <UiTabsPanel
      {...props}
      className={join("hashti-tabs-panel", props.className)}
    />
  );
}

export { Tabs, TabsList, TabsTab, TabsIndicator, TabsPanel };
