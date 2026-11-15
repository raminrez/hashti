import {
  NavigationTree,
  NavigationTreeSection,
  NavigationTreeHeader,
  NavigationTreeItem,
} from "@hashti/react";

export function TreeLiveDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-white dark:bg-black">
      <NavigationTree aria-label="Portal Navigation Hierarchy" size="sm">
        <NavigationTreeSection>
          <NavigationTreeHeader>Spatial Sequences</NavigationTreeHeader>
          <NavigationTreeItem href="#koucheh" textValue="Koucheh">
            1. Koucheh (Public Street)
          </NavigationTreeItem>
          <NavigationTreeItem href="#sardar" textValue="Sar-Dar">
            2. Sar-Dar (Entrance Portal)
          </NavigationTreeItem>
          <NavigationTreeItem href="#hashti" textValue="Hashti">
            3. Hashti (Octagonal Vestibule)
          </NavigationTreeItem>
          <NavigationTreeItem href="#dalan" textValue="Dalan">
            4. Dalan (Indirect Corridor)
          </NavigationTreeItem>
          <NavigationTreeItem href="#hayat" textValue="Hayat">
            5. Hayat (Courtyard Sanctuary)
          </NavigationTreeItem>
        </NavigationTreeSection>
      </NavigationTree>
    </div>
  );
}
