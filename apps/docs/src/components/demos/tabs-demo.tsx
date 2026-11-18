import { Tabs, TabsList, Tab, TabsPanel } from "@hashti/react";

export function TabsLiveDemo() {
  return (
    <div className="w-full max-w-md">
      <Tabs defaultValue="vestibule">
        <TabsList aria-label="Architectural Thresholds">
          <Tab value="portal">Entrance Portal</Tab>
          <Tab value="vestibule">Octagonal Hashti</Tab>
          <Tab value="corridor">Bent Dalan</Tab>
        </TabsList>
        <TabsPanel value="portal" className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
          The Sar-Dar announces identity with Muqarnas vaulted niches and welcoming brickwork.
        </TabsPanel>
        <TabsPanel value="vestibule" className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
          The Hashti provides a tranquil pause, dividing circulation paths toward private and guest
          quarters.
        </TabsPanel>
        <TabsPanel value="corridor" className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
          The Dalan turns at sharp 90-degree angles to preserve acoustic privacy and prevent direct
          visual sightlines.
        </TabsPanel>
      </Tabs>
    </div>
  );
}
