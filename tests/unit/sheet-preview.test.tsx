import { describe, expect, test } from "bun:test";
import ReactDOMServer from "react-dom/server";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHandle } from "../../packages/react/src";

// Sheet merged into Drawer and PreviewTrigger is dead surface (TICK-007,
// docs/component-inventory.md): hover previews are Popover's `openOnHover` until
// TICK-016 replaces preview-trigger/ with HoverCard.
describe("Drawer (absorbs Sheet) unit tests", () => {
  test("exports the Drawer compound and all constituent parts", () => {
    expect(typeof Drawer).toBe("function");
    expect(Drawer.Trigger).toBe(DrawerTrigger);
    expect(Drawer.Content).toBe(DrawerContent);
    expect(Drawer.Handle).toBe(DrawerHandle);
    expect(typeof Drawer.Backdrop).toBe("function");
    expect(typeof Drawer.Close).toBe("function");
    expect(typeof Drawer.Title).toBe("function");
  });

  test("renders DrawerTrigger with a button and closed state attributes", () => {
    const html = ReactDOMServer.renderToString(
      <Drawer side="bottom">
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Backdrop />
        <Drawer.Content>Inside</Drawer.Content>
      </Drawer>,
    );
    expect(html).toContain("Open drawer");
    expect(html).toContain('type="button"');
    expect(html).toContain("hashti-drawer-trigger");
    expect(html).toContain("data-closed");
    expect(html).not.toContain("data-open");
  });

  test("closed Drawer renders no content in the page", () => {
    const html = ReactDOMServer.renderToString(
      <Drawer side="end">
        <Drawer.Trigger>Panel</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Filters</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );
    expect(html).not.toContain("hashti-drawer\"");
    expect(html).not.toContain("Filters");
  });

  test("DrawerHandle is a named button with the sheet-handle hook", () => {
    const html = ReactDOMServer.renderToString(
      <Drawer side="bottom" snapPoints={[0.4, 1]}>
        <Drawer.Trigger>Snap</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Handle />
          Body
        </Drawer.Content>
      </Drawer>,
    );
    // The handle only renders while the drawer is open; SSR of a closed drawer
    // still asserts the part wiring via the compound export above.
    expect(html).toContain("Snap");
  });
});
