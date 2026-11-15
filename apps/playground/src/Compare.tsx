import { useState } from "react";
import { ListBoxItem, Select as HashtiSelect, Theme } from "@hashti/react";
import {
  Select as SdkSelect,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import type { Key } from "react-aria-components";

const REGIONS = [
  { value: "europe", label: "Europe" },
  { value: "north-america", label: "North America" },
  { value: "asia-pacific", label: "Asia Pacific" },
];

export default function Compare() {
  const [hashti, setHashti] = useState<Key>("europe");
  const [sdk, setSdk] = useState("europe");

  return (
    <div className="compare">
      <section>
        <h2>hashti Select</h2>
        <Theme className="compare__theme">
          <HashtiSelect
            label="Region"
            selectedKey={hashti}
            onSelectionChange={(key) => setHashti(key ?? "europe")}
          >
            {REGIONS.map((item) => (
              <ListBoxItem key={item.value} id={item.value}>
                {item.label}
              </ListBoxItem>
            ))}
          </HashtiSelect>
        </Theme>
      </section>

      <section>
        <h2>ui-sdk Select</h2>
        <SdkSelect items={REGIONS} value={sdk} onValueChange={(value) => setSdk(String(value))}>
          <SelectLabel className="sdk-label">Region</SelectLabel>
          <SelectTrigger className="sdk-trigger">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="sdk-content">
            {REGIONS.map((region) => (
              <SelectItem key={region.value} value={region.value} className="sdk-item">
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SdkSelect>
      </section>
    </div>
  );
}