import { expect, test, describe, mock } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ListBox,
  Table,
  TableHeader,
  TableBody,
  Row,
  Cell,
  Column,
  GridList,
  NavigationTree,
  ComboBox,
  ListBoxItem,
} from "@hashti/react";

describe("Phase 5: Advanced RAC Collection Features and Ergonomics", () => {
  describe("LoadMore Infinite Scrolling", () => {
    test("ListBox.LoadMore renders with loading spinner and sentinel", () => {
      const html = renderToStaticMarkup(
        <ListBox aria-label="Items List">
          <ListBox.Item id="item-1">Item 1</ListBox.Item>
          <ListBox.LoadMore id="load-more" isLoading={true} label="Loading more items…" />
        </ListBox>,
      );

      expect(html).toContain("hashti-listbox-load-more");
      expect(html).toContain('data-testid="loadMoreSentinel"');
      expect(html).toContain("hashti-spinner");
      expect(html).toContain("Loading more items…");
    });

    test("ListBox.LoadMore renders error state and retry affordance", () => {
      const handleRetry = mock(() => {});
      const html = renderToStaticMarkup(
        <ListBox aria-label="Items List">
          <ListBox.Item id="item-1">Item 1</ListBox.Item>
          <ListBox.LoadMore
            id="load-more"
            isError={true}
            errorMessage="Network timeout"
            retryLabel="Retry loading"
            onRetry={handleRetry}
          />
        </ListBox>,
      );

      expect(html).toContain("hashti-load-more-error");
      expect(html).toContain("Network timeout");
      expect(html).toContain("Retry loading");
      expect(html).toContain("hashti-load-more-retry");
    });

    test("Table.LoadMore renders with table-row role and column span sentinel", () => {
      const html = renderToStaticMarkup(
        <Table aria-label="Users Table">
          <TableHeader>
            <Column id="name" isRowHeader>
              Name
            </Column>
            <Column id="role">Role</Column>
          </TableHeader>
          <TableBody>
            <Row id="row-1">
              <Cell>Alice</Cell>
              <Cell>Admin</Cell>
            </Row>
            <Table.LoadMore id="load-more-row" isLoading={true} label="Loading more rows…" />
          </TableBody>
        </Table>,
      );

      expect(html).toContain("hashti-table-load-more");
      expect(html).toContain('data-testid="loadMoreSentinel"');
      expect(html).toContain("Loading more rows…");
      expect(html).toContain("hashti-spinner");
    });

    test("GridList.LoadMore renders with loading indicator and sentinel", () => {
      const html = renderToStaticMarkup(
        <GridList aria-label="Media gallery">
          <GridList.Item id="photo-1" textValue="Photo 1">
            Photo 1
          </GridList.Item>
          <GridList.LoadMore id="load-more-photos" isLoading={true} label="Loading more photos…" />
        </GridList>,
      );

      expect(html).toContain("hashti-grid-list-load-more");
      expect(html).toContain('data-testid="loadMoreSentinel"');
      expect(html).toContain("Loading more photos…");
      expect(html).toContain("hashti-spinner");
    });
  });

  describe("NavigationTree", () => {
    test("NavigationTree renders hierarchy with links and current route styling", () => {
      const html = renderToStaticMarkup(
        <NavigationTree aria-label="Documentation Navigation" selectedRoute="/docs/components">
          <NavigationTree.Section>
            <NavigationTree.Header>Getting Started</NavigationTree.Header>
            <NavigationTree.Item id="intro" href="/docs/intro" textValue="Introduction">
              <NavigationTree.Content>Introduction</NavigationTree.Content>
            </NavigationTree.Item>
            <NavigationTree.Item id="components" href="/docs/components" textValue="Components">
              <NavigationTree.Content>Components</NavigationTree.Content>
            </NavigationTree.Item>
          </NavigationTree.Section>
        </NavigationTree>,
      );

      expect(html).toContain("hashti-navigation-tree");
      expect(html).toContain("hashti-navigation-tree-section");
      expect(html).toContain("hashti-navigation-tree-header");
      expect(html).toContain("Getting Started");
      expect(html).toContain('data-href="/docs/components"');
      expect(html).toContain('data-current="true"');
      expect(html).toContain("Components");
    });

    test("NavigationTree supports expandable parent item with indicator", () => {
      const html = renderToStaticMarkup(
        <NavigationTree aria-label="App Navigation">
          <NavigationTree.Item id="settings" textValue="Settings">
            <NavigationTree.Content>
              <NavigationTree.Indicator />
              <span>Settings</span>
            </NavigationTree.Content>
            <NavigationTree.Item id="profile" href="/settings/profile" textValue="Profile">
              <NavigationTree.Content>Profile</NavigationTree.Content>
            </NavigationTree.Item>
          </NavigationTree.Item>
        </NavigationTree>,
      );

      expect(html).toContain("hashti-navigation-tree-indicator");
      expect(html).toContain("Settings");
      expect(html).toContain('data-has-child-items="true"');
    });
  });

  describe("ComboBox Dynamic Creation", () => {
    test("ComboBox renders with allowCreateItem prop and CreateItem subcomponent", () => {
      const handleCreate = mock(() => {});
      const html = renderToStaticMarkup(
        <ComboBox label="Tags" allowCreateItem={true} onCreateItem={handleCreate}>
          <ListBoxItem id="react">React</ListBoxItem>
          <ListBoxItem id="vue">Vue</ListBoxItem>
        </ComboBox>,
      );

      expect(html).toContain("hashti-combobox");
      expect(html).toContain("Tags");
    });

    test("ComboBox.CreateItem renders creation item markup when mounted", () => {
      const handleCreate = mock(() => {});
      const html = renderToStaticMarkup(
        <div className="custom-combobox-popover">
          <div
            role="button"
            tabIndex={0}
            data-testid="combobox-create-item"
            className="hashti-combobox-create-item"
            onClick={() => handleCreate()}
            onKeyDown={() => handleCreate()}
          >
            <span className="hashti-combobox-create-item-text">Create &quot;Svelte&quot;</span>
          </div>
        </div>,
      );

      expect(html).toContain("hashti-combobox-create-item");
      expect(html).toContain("Create &quot;Svelte&quot;");
    });
  });
});
