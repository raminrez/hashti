import { expect, test, describe } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Listbox,
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  Select,
  ComboBox,
} from "@hashti/react";

describe("Phase 4 Collection & Selection Elevate unit tests", () => {
  describe("Standalone Listbox", () => {
    test("renders Listbox with default bordered style and items", () => {
      const html = renderToStaticMarkup(
        <Listbox aria-label="Operating Systems">
          <Listbox.Item value="macos">macOS</Listbox.Item>
          <Listbox.Item value="linux">Linux</Listbox.Item>
          <Listbox.Item value="windows">Windows</Listbox.Item>
        </Listbox>,
      );
      expect(html).toContain("hashti-listbox");
      expect(html).toContain("hashti-listbox--bordered");
      expect(html).toContain("hashti-listbox-item");
      expect(html).toContain("macOS");
      expect(html).toContain("Linux");
      expect(html).toContain("Windows");
      expect(html).toContain('role="listbox"');
    });

    test("renders Listbox with card, flat variants and sizes", () => {
      const cardHtml = renderToStaticMarkup(
        <Listbox aria-label="Languages" variant="card" size="lg">
          <Listbox.Item value="ts">TypeScript</Listbox.Item>
        </Listbox>,
      );
      expect(cardHtml).toContain("hashti-listbox--card");
      expect(cardHtml).toContain("hashti-listbox--lg");
      expect(cardHtml).toContain("hashti-listbox-item--lg");

      const flatHtml = renderToStaticMarkup(
        <Listbox aria-label="Languages" variant="flat" size="sm">
          <Listbox.Item value="rs">Rust</Listbox.Item>
        </Listbox>,
      );
      expect(flatHtml).toContain("hashti-listbox--flat");
      expect(flatHtml).toContain("hashti-listbox--sm");
      expect(flatHtml).toContain("hashti-listbox-item--sm");
    });

    test("renders Listbox with sections and section headers", () => {
      const html = renderToStaticMarkup(
        <Listbox aria-label="Food Categories">
          <Listbox.Section title="Fruits">
            <Listbox.Item value="apple">Apple</Listbox.Item>
            <Listbox.Item value="banana">Banana</Listbox.Item>
          </Listbox.Section>
          <Listbox.Section title="Vegetables">
            <Listbox.Item value="carrot">Carrot</Listbox.Item>
          </Listbox.Section>
        </Listbox>,
      );
      expect(html).toContain("hashti-listbox-section");
      expect(html).toContain("hashti-listbox-header");
      expect(html).toContain("Fruits");
      expect(html).toContain("Vegetables");
      expect(html).toContain("Apple");
      expect(html).toContain("Carrot");
    });

    test("renders multiple selection with item indicators", () => {
      const html = renderToStaticMarkup(
        <Listbox aria-label="Toppings" multiple defaultValue={["basil"]}>
          <Listbox.Item value="basil">
            Basil
            <Listbox.ItemIndicator>✓</Listbox.ItemIndicator>
          </Listbox.Item>
          <Listbox.Item value="olive">
            Olive
            <Listbox.ItemIndicator>✓</Listbox.ItemIndicator>
          </Listbox.Item>
        </Listbox>,
      );
      expect(html).toContain("hashti-listbox-item");
      expect(html).toContain("Basil");
      expect(html).toContain("Olive");
    });

    test("renders empty state in Listbox", () => {
      const html = renderToStaticMarkup(
        <Listbox
          aria-label="Empty list"
          renderEmptyState={() => <Listbox.EmptyState>No options found</Listbox.EmptyState>}
        />,
      );
      expect(html).toContain("hashti-listbox-empty-state");
      expect(html).toContain("No options found");
    });

    test("renders load-more sentinel rows", () => {
      const html = renderToStaticMarkup(
        <Listbox aria-label="Items List">
          <Listbox.Item value="item-1">Item 1</Listbox.Item>
          <Listbox.LoadMore isLoading label="Loading more items…" />
        </Listbox>,
      );
      expect(html).toContain("hashti-listbox-load-more");
      expect(html).toContain("hashti-spinner");
      expect(html).toContain("Loading more items…");

      const errorHtml = renderToStaticMarkup(
        <Listbox aria-label="Items List">
          <Listbox.Item value="item-1">Item 1</Listbox.Item>
          <Listbox.LoadMore isError errorMessage="Network timeout" retryLabel="Retry loading" onRetry={() => {}} />
        </Listbox>,
      );
      expect(errorHtml).toContain("hashti-load-more-error");
      expect(errorHtml).toContain("Network timeout");
      expect(errorHtml).toContain("Retry loading");
    });
  });

  describe("Autocomplete primitive", () => {
    test("renders Autocomplete with input and suggestion list", () => {
      const html = renderToStaticMarkup(
        <Autocomplete aria-label="Search actions" defaultOpen>
          <AutocompleteInput placeholder="Search actions" />
          <AutocompleteContent>
            <AutocompleteList>
              <AutocompleteItem value="cut">Cut</AutocompleteItem>
              <AutocompleteItem value="copy">Copy</AutocompleteItem>
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>,
      );
      expect(html).toContain("Cut");
      expect(html).toContain("Copy");
    });
  });

  describe("Multi-selection in Select & ComboBox", () => {
    test("Select supports multiple selection with chips display", () => {
      const html = renderToStaticMarkup(
        <Select
          label="Tags"
          multiple
          multipleDisplay="chips"
          placeholder="Pick tags"
          items={[
            { value: "design", label: "Design" },
            { value: "engineering", label: "Engineering" },
          ]}
        />,
      );
      expect(html).toContain("hashti-select");
      expect(html).toContain("hashti-select-trigger");
      expect(html).toContain("data-placeholder");
    });

    test("Select supports multiple selection with badge display", () => {
      const html = renderToStaticMarkup(
        <Select
          label="Categories"
          multiple
          multipleDisplay="badge"
          placeholder="Select categories"
          items={[
            { value: "cat-1", label: "Category 1" },
            { value: "cat-2", label: "Category 2" },
          ]}
        />,
      );
      expect(html).toContain("hashti-select");
      expect(html).toContain("hashti-select-trigger");
    });

    test("Select renders selected chips in the trigger", () => {
      const html = renderToStaticMarkup(
        <Select
          label="Tags"
          multiple
          multipleDisplay="chips"
          defaultValue={["design"]}
          items={[
            { value: "design", label: "Design" },
            { value: "engineering", label: "Engineering" },
          ]}
        />,
      );
      expect(html).toContain("hashti-select-chips-wrapper");
      expect(html).toContain("hashti-select-chip");
      expect(html).toContain("Design");
    });

    test("ComboBox supports multiple selection mode with multipleDisplay", () => {
      const html = renderToStaticMarkup(
        <ComboBox
          label="Multi ComboBox"
          multiple
          multipleDisplay="chips"
          placeholder="Type to add tags"
          defaultValue={["react"]}
          items={[
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" },
          ]}
        />,
      );
      expect(html).toContain("hashti-combobox");
      expect(html).toContain('role="combobox"');
      expect(html).toContain("hashti-combobox-values");
      expect(html).toContain("hashti-combobox-chip");
      expect(html).toContain("React");
    });
  });
});
