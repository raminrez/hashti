"use client";

import type { Ref } from "react";
import {
  Tabs as RACTabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  type TabsProps as RACTabsProps,
  type TabProps,
  type TabListProps,
  type TabPanelProps,
} from "react-aria-components";
import { classes } from "../../utils";

export interface TabsProps extends RACTabsProps {
  variant?: "line" | "contained";
  ref?: Ref<HTMLDivElement>;
}

export function Tabs({ variant = "line", className, ...props }: TabsProps) {
  return (
    <RACTabs {...props} data-variant={variant} className={classes("hashti-tabs", className)} />
  );
}

export { TabList, Tab, TabPanel, TabPanels };
export type { TabProps, TabListProps, TabPanelProps };
