import { describe, expect, test } from "bun:test";
import React, { useContext } from "react";
import ReactDOMServer from "react-dom/server";
import {
  Sheet,
  SheetRoot,
  SheetTrigger,
  SheetOverlay,
  SheetBackdrop,
  SheetContent,
  SheetHandle,
  SheetContext,
  PreviewTrigger,
  PreviewTriggerRoot,
  Button,
  Popover,
} from "../../packages/react/src";

describe("Sheet & PreviewTrigger unit tests", () => {
  describe("Sheet suite", () => {
    test("exports compound Sheet component and all constituent subcomponents", () => {
      expect(typeof Sheet).toBe("function");
      expect(Sheet.Root).toBe(SheetRoot);
      expect(Sheet.Trigger).toBe(SheetTrigger);
      expect(Sheet.Overlay).toBe(SheetOverlay);
      expect(Sheet.Backdrop).toBe(SheetBackdrop);
      expect(Sheet.Content).toBe(SheetContent);
      expect(Sheet.Handle).toBe(SheetHandle);
    });

    test("renders SheetHandle with default aria-hidden and class names", () => {
      const html = ReactDOMServer.renderToString(<SheetHandle />);
      expect(html).toContain('aria-hidden="true"');
      expect(html).toContain("hashti-sheet-handle");
    });

    test("renders SheetHandle with custom className and data attributes", () => {
      const html = ReactDOMServer.renderToString(
        <SheetHandle className="custom-handle-class" data-testid="grab-handle" />,
      );
      expect(html).toContain("hashti-sheet-handle");
      expect(html).toContain("custom-handle-class");
      expect(html).toContain('data-testid="grab-handle"');
    });

    test("renders SheetTrigger with trigger button and ARIA attributes", () => {
      const html = ReactDOMServer.renderToString(
        <SheetTrigger>
          <Button variant="primary">Open Drawer</Button>
          <SheetOverlay>
            <SheetContent>Inside</SheetContent>
          </SheetOverlay>
        </SheetTrigger>,
      );
      expect(html).toContain("Open Drawer");
      expect(html).toContain("hashti-button");
      expect(html).toContain('aria-expanded="false"');
      expect(html).toContain('type="button"');
    });

    test("SheetTrigger reflects isOpen=true state on trigger button", () => {
      const html = ReactDOMServer.renderToString(
        <SheetTrigger isOpen>
          <Button>Active Sheet</Button>
        </SheetTrigger>,
      );
      expect(html).toContain("Active Sheet");
      expect(html).toContain('aria-expanded="true"');
    });

    test("SheetContext provides position and preventDismissal to tree", () => {
      function ContextConsumer() {
        const ctx = useContext(SheetContext);
        return <div data-position={ctx.position} data-prevent={String(ctx.preventDismissal)} />;
      }

      const defaultHtml = ReactDOMServer.renderToString(<ContextConsumer />);
      expect(defaultHtml).toContain('data-position="bottom"');
      expect(defaultHtml).toContain('data-prevent="undefined"');

      const customHtml = ReactDOMServer.renderToString(
        <SheetContext.Provider value={{ position: "top", preventDismissal: true }}>
          <ContextConsumer />
        </SheetContext.Provider>,
      );
      expect(customHtml).toContain('data-position="top"');
      expect(customHtml).toContain('data-prevent="true"');
    });
  });

  describe("PreviewTrigger suite", () => {
    test("exports PreviewTrigger with compound namespacing", () => {
      expect(typeof PreviewTrigger).toBe("function");
      expect(PreviewTrigger.Root).toBe(PreviewTriggerRoot);
      expect(PreviewTrigger.Popover).toBe(Popover);
    });

    test("renders PreviewTrigger with trigger button and contextual popover", () => {
      const html = ReactDOMServer.renderToString(
        <PreviewTrigger delay={300} closeDelay={150}>
          <Button variant="ghost">@author</Button>
          <Popover>User Card</Popover>
        </PreviewTrigger>,
      );
      expect(html).toContain("@author");
      expect(html).toContain("hashti-button");
      expect(html).toContain('aria-haspopup="dialog"');
      expect(html).toContain('aria-expanded="false"');
    });

    test("renders PreviewTrigger with isOpen=true state on trigger button", () => {
      const html = ReactDOMServer.renderToString(
        <PreviewTrigger isOpen>
          <Button variant="secondary">Preview Link</Button>
          <Popover>Preview</Popover>
        </PreviewTrigger>,
      );
      expect(html).toContain("Preview Link");
      expect(html).toContain('aria-expanded="true"');
    });
  });
});
