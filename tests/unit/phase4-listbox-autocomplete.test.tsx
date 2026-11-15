import { expect, test, describe } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ListBox,
  Autocomplete,
  Select,
  ComboBox,
  SearchField,
  Input,
  Menu,
  MenuItem,
} from "@hashti/react";

describe("Phase 4 Collection & Selection Elevate unit tests", () => {
  describe("Standalone ListBox", () => {
    test("renders ListBox with default bordered style and items", () => {
      const html = renderToStaticMarkup(
        <ListBox aria-label="Operating Systems" selectionMode="single">
          <ListBox.Item id="macos">macOS</ListBox.Item>
          <ListBox.Item id="linux">Linux</ListBox.Item>
          <ListBox.Item id="windows">Windows</ListBox.Item>
        </ListBox>,
      );
      expect(html).toContain("hashti-listbox");
      expect(html).toContain("hashti-listbox--bordered");
      expect(html).toContain("hashti-listbox-item");
      expect(html).toContain("macOS");
      expect(html).toContain("Linux");
      expect(html).toContain("Windows");
      expect(html).toContain('role="listbox"');
    });

    test("renders ListBox with card, flat variants and sizes", () => {
      const cardHtml = renderToStaticMarkup(
        <ListBox aria-label="Languages" variant="card" size="lg">
          <ListBox.Item id="ts">TypeScript</ListBox.Item>
        </ListBox>,
      );
      expect(cardHtml).toContain("hashti-listbox--card");
      expect(cardHtml).toContain("hashti-listbox--lg");
      expect(cardHtml).toContain("hashti-listbox-item--lg");

      const flatHtml = renderToStaticMarkup(
        <ListBox aria-label="Languages" variant="flat" size="sm">
          <ListBox.Item id="rs">Rust</ListBox.Item>
        </ListBox>,
      );
      expect(flatHtml).toContain("hashti-listbox--flat");
      expect(flatHtml).toContain("hashti-listbox--sm");
      expect(flatHtml).toContain("hashti-listbox-item--sm");
    });

    test("renders ListBox with sections and section headers", () => {
      const html = renderToStaticMarkup(
        <ListBox aria-label="Food Categories">
          <ListBox.Section title="Fruits">
            <ListBox.Item id="apple">Apple</ListBox.Item>
            <ListBox.Item id="banana">Banana</ListBox.Item>
          </ListBox.Section>
          <ListBox.Section title="Vegetables">
            <ListBox.Item id="carrot">Carrot</ListBox.Item>
          </ListBox.Section>
        </ListBox>,
      );
      expect(html).toContain("hashti-listbox-section");
      expect(html).toContain("hashti-listbox-header");
      expect(html).toContain("Fruits");
      expect(html).toContain("Vegetables");
      expect(html).toContain("Apple");
      expect(html).toContain("Carrot");
    });

    test("renders drag handle and selection checkbox in ListBox items", () => {
      const html = renderToStaticMarkup(
        <ListBox aria-label="Reorderable options" selectionMode="multiple">
          <ListBox.Item id="1" textValue="Item 1">
            <ListBox.DragHandle aria-label="Reorder item 1" />
            <ListBox.Checkbox aria-label="Select item 1" />
            <span>Item 1</span>
          </ListBox.Item>
        </ListBox>,
      );
      expect(html).toContain("hashti-listbox-drag-handle");
      expect(html).toContain("hashti-listbox-checkbox");
      expect(html).toContain('slot="drag"');
      expect(html).toContain('slot="selection"');
      expect(html).toContain("Item 1");
    });

    test("renders empty state in ListBox", () => {
      const html = renderToStaticMarkup(
        <ListBox
          aria-label="Empty list"
          renderEmptyState={() => <ListBox.EmptyState>No options found</ListBox.EmptyState>}
        >
          {[]}
        </ListBox>,
      );
      expect(html).toContain("hashti-listbox-empty-state");
      expect(html).toContain("No options found");
    });
  });

  describe("Autocomplete primitive", () => {
    test("renders Autocomplete wrapper around search field and menu", () => {
      const html = renderToStaticMarkup(
        <Autocomplete
          filter={(itemText, inputVal) => itemText.toLowerCase().includes(inputVal.toLowerCase())}
        >
          <SearchField aria-label="Search actions">
            <Input />
          </SearchField>
          <Menu aria-label="Actions">
            <MenuItem id="cut">Cut</MenuItem>
            <MenuItem id="copy">Copy</MenuItem>
            <MenuItem id="paste">Paste</MenuItem>
          </Menu>
        </Autocomplete>,
      );
      expect(html).toContain("hashti-search-field");
      expect(html).toContain("react-aria-Menu");
      expect(html).toContain("Cut");
      expect(html).toContain("Copy");
    });
  });

  describe("Multi-selection in Select & ComboBox", () => {
    test("Select supports multiple selection with chips display", () => {
      const html = renderToStaticMarkup(
        <Select
          label="Tags"
          selectionMode="multiple"
          multipleDisplay="chips"
          placeholder="Pick tags"
        >
          <ListBox.Item id="design">Design</ListBox.Item>
          <ListBox.Item id="engineering">Engineering</ListBox.Item>
        </Select>,
      );
      expect(html).toContain("hashti-select");
      expect(html).toContain("hashti-select-trigger");
      expect(html).toContain('data-placeholder="true"');
    });

    test("Select supports multiple selection with badge display", () => {
      const html = renderToStaticMarkup(
        <Select
          label="Categories"
          selectionMode="multiple"
          multipleDisplay="badge"
          placeholder="Select categories"
        >
          <ListBox.Item id="cat-1">Category 1</ListBox.Item>
          <ListBox.Item id="cat-2">Category 2</ListBox.Item>
        </Select>,
      );
      expect(html).toContain("hashti-select");
      expect(html).toContain("hashti-select-trigger");
    });

    test("ComboBox supports multiple selection mode with multipleDisplay", () => {
      const html = renderToStaticMarkup(
        <ComboBox
          label="Multi ComboBox"
          selectionMode="multiple"
          multipleDisplay="chips"
          placeholder="Type to add tags"
        >
          <ListBox.Item id="react">React</ListBox.Item>
          <ListBox.Item id="vue">Vue</ListBox.Item>
        </ComboBox>,
      );
      expect(html).toContain("hashti-combobox");
      expect(html).toContain('role="combobox"');
      expect(html).toContain("hashti-combobox-values");
    });
  });
});
