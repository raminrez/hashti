import { useState } from "react";
import { Select, ListBoxItem } from "@hashti/react";
import type { Key, Selection } from "react-aria-components";

export function SelectLiveDemo() {
  const [selectedCity, setSelectedCity] = useState<Key>("isfahan");
  const [multiSelected, setMultiSelected] = useState<Selection>(
    new Set(["turquoise", "terracotta"]),
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg items-start justify-center">
      <div className="w-full md:w-1/2">
        <Select
          label="Historic Portal City"
          placeholder="Select an architectural site"
          selectedKey={selectedCity}
          onSelectionChange={(key) => setSelectedCity(key ?? "isfahan")}
        >
          <ListBoxItem id="isfahan">Isfahan (Naqsh-e Jahan)</ListBoxItem>
          <ListBoxItem id="shiraz">Shiraz (Vakil Bazaar)</ListBoxItem>
          <ListBoxItem id="yazd">Yazd (Windcatchers)</ListBoxItem>
          <ListBoxItem id="kashan">Kashan (Fin Garden)</ListBoxItem>
        </Select>
      </div>

      <div className="w-full md:w-1/2">
        <Select
          label="Glaze Palette (Multi-Select)"
          selectionMode="multiple"
          multipleDisplay="chips"
          selectedKeys={multiSelected}
          onSelectionChange={setMultiSelected}
          placeholder="Pick colors"
        >
          <ListBoxItem id="turquoise">Turquoise Glaze</ListBoxItem>
          <ListBoxItem id="amber">Persian Amber</ListBoxItem>
          <ListBoxItem id="terracotta">Terracotta Earth</ListBoxItem>
          <ListBoxItem id="lapis">Lapis Lazuli</ListBoxItem>
        </Select>
      </div>
    </div>
  );
}
