import { expect, test, describe } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { GridList, Tree, Collection } from "@hashti/react";

describe("Phase 4 Collection Components unit tests", () => {
  describe("GridList suite", () => {
    test("renders GridList with default bordered variant and items", () => {
      const html = renderToStaticMarkup(
        <GridList aria-label="Teams" selectionMode="single">
          <GridList.Item id="design" textValue="Design">
            <span>Design Team</span>
          </GridList.Item>
          <GridList.Item id="engineering" textValue="Engineering">
            <span>Engineering Team</span>
          </GridList.Item>
        </GridList>,
      );
      expect(html).toContain("hashti-grid-list");
      expect(html).toContain("hashti-grid-list--bordered");
      expect(html).toContain("hashti-grid-list-item");
      expect(html).toContain("Design Team");
      expect(html).toContain("Engineering Team");
      expect(html).toContain('role="grid"');
    });

    test("renders GridList with card and flat variants and custom sizes", () => {
      const cardHtml = renderToStaticMarkup(
        <GridList aria-label="Projects" variant="card" size="lg">
          <GridList.Item id="1" textValue="Project 1">
            <span>Project 1</span>
          </GridList.Item>
        </GridList>,
      );
      expect(cardHtml).toContain("hashti-grid-list--card");
      expect(cardHtml).toContain("hashti-grid-list--lg");
      expect(cardHtml).toContain("hashti-grid-list-item--lg");

      const flatHtml = renderToStaticMarkup(
        <GridList aria-label="Projects" variant="flat" size="sm">
          <GridList.Item id="1" textValue="Project 1">
            <span>Project 1</span>
          </GridList.Item>
        </GridList>,
      );
      expect(flatHtml).toContain("hashti-grid-list--flat");
      expect(flatHtml).toContain("hashti-grid-list--sm");
      expect(flatHtml).toContain("hashti-grid-list-item--sm");
    });

    test("renders selection checkboxes and drag handles for drag-and-drop reordering", () => {
      const html = renderToStaticMarkup(
        <GridList aria-label="Reorderable items" selectionMode="multiple">
          <GridList.Item id="item-1" textValue="Item 1">
            <GridList.DragHandle aria-label="Reorder Item 1" />
            <GridList.Checkbox aria-label="Select Item 1" />
            <span>Item 1 Content</span>
          </GridList.Item>
        </GridList>,
      );
      expect(html).toContain("hashti-grid-list-drag-handle");
      expect(html).toContain("hashti-grid-list-checkbox");
      expect(html).toContain('slot="drag"');
      expect(html).toContain('slot="selection"');
      expect(html).toContain("Item 1 Content");
    });

    test("renders empty state when collection has no items", () => {
      const html = renderToStaticMarkup(
        <GridList
          aria-label="Empty list"
          renderEmptyState={() => <GridList.EmptyState>No items available</GridList.EmptyState>}
        >
          {[]}
        </GridList>,
      );
      expect(html).toContain("hashti-grid-list-empty-state");
      expect(html).toContain("No items available");
    });
  });

  describe("Tree suite", () => {
    test("renders Tree root and items with hierarchical structure", () => {
      const html = renderToStaticMarkup(
        <Tree aria-label="Directory tree" selectionMode="single" showGuideLines>
          <Tree.Item id="src" textValue="src">
            <Tree.Content>
              <Tree.Indicator aria-label="Toggle src" />
              <span>src</span>
            </Tree.Content>
          </Tree.Item>
        </Tree>,
      );
      expect(html).toContain("hashti-tree");
      expect(html).toContain("hashti-tree--guidelines");
      expect(html).toContain("hashti-tree-item");
      expect(html).toContain("hashti-tree-content");
      expect(html).toContain("hashti-tree-indicator");
      expect(html).toContain('slot="chevron"');
      expect(html).toContain("src");
      expect(html).toContain('role="treegrid"');
    });

    test("renders Tree items with selection checkboxes and size variants", () => {
      const html = renderToStaticMarkup(
        <Tree aria-label="Config tree" size="sm" selectionMode="multiple">
          <Tree.Item id="settings" textValue="settings">
            <Tree.Content>
              <Tree.Indicator />
              <Tree.Checkbox aria-label="Select settings" />
              <span>settings</span>
            </Tree.Content>
          </Tree.Item>
        </Tree>,
      );
      expect(html).toContain("hashti-tree--sm");
      expect(html).toContain("hashti-tree-item--sm");
      expect(html).toContain("hashti-tree-checkbox");
      expect(html).toContain('slot="selection"');
      expect(html).toContain("settings");
    });

    test("supports nested Collection branches inside Tree.Item when expanded", () => {
      const items = [
        {
          id: "folder",
          name: "Documents",
          children: [{ id: "file", name: "Report.pdf" }],
        },
      ];

      const html = renderToStaticMarkup(
        <Tree aria-label="File manager" items={items} defaultExpandedKeys={["folder"]}>
          {(item) => (
            <Tree.Item id={item.id} textValue={item.name}>
              <Tree.Content>
                <Tree.Indicator />
                <span>{item.name}</span>
              </Tree.Content>
              {item.children && (
                <Collection items={item.children}>
                  {(child) => (
                    <Tree.Item id={child.id} textValue={child.name}>
                      <Tree.Content>
                        <span>{child.name}</span>
                      </Tree.Content>
                    </Tree.Item>
                  )}
                </Collection>
              )}
            </Tree.Item>
          )}
        </Tree>,
      );
      expect(html).toContain("Documents");
      expect(html).toContain("Report.pdf");
    });
  });
});
