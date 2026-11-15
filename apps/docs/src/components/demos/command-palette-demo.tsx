import { useState } from "react";
import { CommandPalette, Button, Kbd } from "@hashti/react";

export function CommandPaletteLiveDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  const GROUPS = [
    {
      heading: "Architectural Portals",
      items: [
        { id: "hashti", label: "Hashti (Octagonal Vestibule)", shortcut: "⌘1" },
        { id: "sardar", label: "Sar-Dar (Entrance Portal)", shortcut: "⌘2" },
        { id: "dalan", label: "Dalan (Indirect Corridor)", shortcut: "⌘3" },
      ],
    },
    {
      heading: "Design System",
      items: [
        { id: "tokens", label: "Color Tokens & Mineral Glazes", shortcut: "⇧T" },
        { id: "typography", label: "Satoshi + Vazirmatn Scale", shortcut: "⇧Y" },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        <span>Open Command Palette</span>
        <Kbd>⌘K</Kbd>
      </Button>

      {lastSelected && (
        <span className="text-xs text-neutral-500 font-mono">
          Executed:{" "}
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {lastSelected}
          </span>
        </span>
      )}

      <CommandPalette
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placeholder="Type a command or portal element..."
        onSelect={(key) => setLastSelected(String(key))}
      >
        {GROUPS.map((group) => (
          <CommandPalette.Group key={group.heading} heading={group.heading}>
            {group.items.map((item) => (
              <CommandPalette.Item key={item.id} id={item.id} shortcut={item.shortcut}>
                {item.label}
              </CommandPalette.Item>
            ))}
          </CommandPalette.Group>
        ))}
      </CommandPalette>
    </div>
  );
}
