"use client"

import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@hashti/react"

export function TabsDemo() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="activity">Activity</TabsTab>
        <TabsTab value="settings">Settings</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value="overview">The project at a glance.</TabsPanel>
      <TabsPanel value="activity">Recent changes and comments.</TabsPanel>
      <TabsPanel value="settings">Notifications, access and integrations.</TabsPanel>
    </Tabs>
  )
}
