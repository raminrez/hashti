import { Tabs, TabList, Tab, TabPanel } from "@hashti/react";

export function TabsLiveDemo() {
  return (
    <div className="w-full max-w-md">
      <Tabs defaultSelectedKey="vestibule">
        <TabList aria-label="Architectural Thresholds">
          <Tab id="portal">Entrance Portal</Tab>
          <Tab id="vestibule">Octagonal Hashti</Tab>
          <Tab id="corridor">Bent Dalan</Tab>
        </TabList>
        <TabPanel id="portal" className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
          The Sar-Dar announces identity with Muqarnas vaulted niches and welcoming brickwork.
        </TabPanel>
        <TabPanel id="vestibule" className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
          The Hashti provides a tranquil pause, dividing circulation paths toward private and guest
          quarters.
        </TabPanel>
        <TabPanel id="corridor" className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
          The Dalan turns at sharp 90-degree angles to preserve acoustic privacy and prevent direct
          visual sightlines.
        </TabPanel>
      </Tabs>
    </div>
  );
}
