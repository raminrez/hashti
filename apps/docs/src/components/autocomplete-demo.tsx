"use client";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@hashti/react";

const cities = ["Amsterdam", "Berlin", "Copenhagen", "Lisbon", "Paris"];

export function AutocompleteDemo() {
  // The root renders no element, so the width lives on a wrapping div.
  return (
    <div style={{ maxWidth: 320 }}>
      <Autocomplete>
        <AutocompleteLabel>City</AutocompleteLabel>
        <AutocompleteInput placeholder="Start typing a city…" />
        <AutocompleteContent>
          <AutocompleteList>
            {cities.map((c) => (
              <AutocompleteItem key={c} value={c}>
                {c}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
          <AutocompleteEmpty>No city matches.</AutocompleteEmpty>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
}
