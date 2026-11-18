"use client";

import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import {
  Tabs as UiSdkTabs,
  TabsList as UiSdkTabsList,
  TabsPanel as UiSdkTabsPanel,
  TabsTab as UiSdkTabsTab,
  type TabsListState,
  type TabsPanelState,
  type TabsState,
  type TabsTabState,
} from "@ui-sdk/react/tabs";
import { uiClass, type ControlSize } from "../../utils";

type TabsClass<State> = string | ((state: State) => string | undefined);

interface TabsConfig {
  variant: "line" | "contained";
  size: ControlSize;
}

const TabsConfigContext = createContext<TabsConfig>({ variant: "line", size: "md" });

export interface TabsProps<T extends string = string>
  extends Omit<ComponentProps<typeof UiSdkTabs<T>>, "className" | "children"> {
  /** Visual variant: an underline list (`line`) or a segmented box (`contained`). */
  variant?: "line" | "contained";
  size?: ControlSize;
  className?: TabsClass<TabsState<T>>;
  children?: ReactNode;
}

export function TabsRoot<T extends string = string>({
  variant = "line",
  size = "md",
  className,
  children,
  ...props
}: TabsProps<T>) {
  return (
    <TabsConfigContext.Provider value={{ variant, size }}>
      <UiSdkTabs<T>
        {...props}
        className={uiClass(className, "hashti-tabs")}
        data-variant={variant}
        data-size={size}
      >
        {children}
      </UiSdkTabs>
    </TabsConfigContext.Provider>
  );
}

export interface TabsListProps extends Omit<ComponentProps<typeof UiSdkTabsList>, "className"> {
  className?: TabsClass<TabsListState>;
  children?: ReactNode;
}

export function TabsList({ className, ...props }: TabsListProps) {
  return <UiSdkTabsList {...props} className={uiClass(className, "hashti-tabs__list")} />;
}

export interface TabsTabProps extends Omit<ComponentProps<typeof UiSdkTabsTab>, "className"> {
  className?: TabsClass<TabsTabState>;
  children?: ReactNode;
}

export function Tab({ className, ...props }: TabsTabProps) {
  const { size } = useContext(TabsConfigContext);
  return (
    <UiSdkTabsTab {...props} className={uiClass(className, "hashti-tab")} data-size={size} />
  );
}

export interface TabsPanelProps extends Omit<ComponentProps<typeof UiSdkTabsPanel>, "className"> {
  className?: TabsClass<TabsPanelState>;
  children?: ReactNode;
}

export function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <UiSdkTabsPanel {...props} className={uiClass(className, "hashti-tab-panel")} />;
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel: TabsPanel,
});
