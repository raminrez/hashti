import { describe, expect, test } from "bun:test";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSeparator,
  Disclosure,
  DisclosureRoot,
  DisclosureTrigger,
  DisclosureIndicator,
  DisclosurePanel,
  DisclosureGroup,
  Button,
} from "../../packages/react/src";

describe("Toolbar & Disclosure unit tests", () => {
  describe("Toolbar component suite", () => {
    test("renders horizontal flat Toolbar with groups and items", () => {
      const html = ReactDOMServer.renderToString(
        <Toolbar aria-label="Editor actions">
          <Toolbar.Group ariaLabel="Text formatting">
            <Button variant="ghost">Bold</Button>
            <Button variant="ghost">Italic</Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group ariaLabel="History">
            <Button variant="ghost">Undo</Button>
          </Toolbar.Group>
        </Toolbar>,
      );

      expect(html).toContain('role="toolbar"');
      expect(html).toContain('data-size="md"');
      expect(html).toContain('data-orientation="horizontal"');
      expect(html).toContain('data-variant="flat"');
      expect(html).toContain("hashti-toolbar");
      expect(html).toContain("hashti-toolbar-group");
      expect(html).toContain("hashti-toolbar-separator");
      expect(html).toContain('aria-orientation="vertical"');
    });

    test("renders vertical floating Toolbar with custom size", () => {
      const html = ReactDOMServer.renderToString(
        <Toolbar orientation="vertical" variant="floating" size="sm" aria-label="Vertical tools">
          <Toolbar.Item>
            <Button variant="ghost" size="sm">
              Draw
            </Button>
          </Toolbar.Item>
          <Toolbar.Separator />
          <Toolbar.Item>
            <Button variant="ghost" size="sm">
              Erase
            </Button>
          </Toolbar.Item>
        </Toolbar>,
      );

      expect(html).toContain('data-orientation="vertical"');
      expect(html).toContain('data-variant="floating"');
      expect(html).toContain('data-size="sm"');
      expect(html).toContain("hashti-toolbar-item");
      // In vertical toolbar, the separator renders as horizontal divider (<hr>)
      expect(html).toContain("<hr");
      expect(html).toContain("hashti-toolbar-separator");
    });

    test("supports disabled toolbar state and standalone component imports", () => {
      const html = ReactDOMServer.renderToString(
        <Toolbar isDisabled variant="raised" aria-label="Disabled bar">
          <ToolbarGroup aria-label="Cluster">
            <ToolbarItem>
              <Button>Action</Button>
            </ToolbarItem>
            <ToolbarSeparator />
          </ToolbarGroup>
        </Toolbar>,
      );

      expect(html).toContain('data-disabled="true"');
      expect(html).toContain('data-variant="raised"');
    });
  });

  describe("Disclosure & DisclosureGroup component suite", () => {
    test("renders standalone Disclosure with Trigger, Indicator, and Panel", () => {
      const html = ReactDOMServer.renderToString(
        <Disclosure defaultExpanded>
          <Disclosure.Trigger headingLevel={2}>
            <span>Advanced Configuration</span>
            <Disclosure.Indicator />
          </Disclosure.Trigger>
          <Disclosure.Panel>
            <p>Panel details and content</p>
          </Disclosure.Panel>
        </Disclosure>,
      );

      expect(html).toContain("hashti-disclosure");
      expect(html).toContain('data-size="md"');
      expect(html).toContain('data-variant="default"');
      expect(html).toContain('data-expanded="true"');
      expect(html).toContain("<h2");
      expect(html).toContain("hashti-disclosure-trigger");
      expect(html).toContain("hashti-disclosure-indicator");
      expect(html).toContain("hashti-disclosure-panel");
      expect(html).toContain("hashti-disclosure-panel-inner");
      expect(html).toContain("Panel details and content");
    });

    test("renders Disclosure with card and flush variants", () => {
      const cardHtml = ReactDOMServer.renderToString(
        <Disclosure variant="card" size="lg">
          <Disclosure.Trigger>Card Summary</Disclosure.Trigger>
          <Disclosure.Panel>Card Body</Disclosure.Panel>
        </Disclosure>,
      );

      expect(cardHtml).toContain('data-variant="card"');
      expect(cardHtml).toContain('data-size="lg"');

      const flushHtml = ReactDOMServer.renderToString(
        <Disclosure variant="flush" size="sm">
          <Disclosure.Trigger>Flush Summary</Disclosure.Trigger>
          <Disclosure.Panel>Flush Body</Disclosure.Panel>
        </Disclosure>,
      );

      expect(flushHtml).toContain('data-variant="flush"');
      expect(flushHtml).toContain('data-size="sm"');
    });

    test("renders DisclosureGroup coordinating multiple Disclosures", () => {
      const html = ReactDOMServer.renderToString(
        <DisclosureGroup
          defaultExpandedKeys={["security"]}
          allowsMultipleExpanded
          variant="card"
          size="sm"
        >
          <Disclosure id="general">
            <Disclosure.Trigger headingLevel={3}>General Settings</Disclosure.Trigger>
            <Disclosure.Panel>General details</Disclosure.Panel>
          </Disclosure>
          <Disclosure id="security">
            <Disclosure.Trigger headingLevel={3}>Security Settings</Disclosure.Trigger>
            <Disclosure.Panel>Security details</Disclosure.Panel>
          </Disclosure>
        </DisclosureGroup>,
      );

      expect(html).toContain("hashti-disclosure-group");
      expect(html).toContain('data-variant="card"');
      expect(html).toContain('data-size="sm"');
      // id="security" is expanded
      expect(html).toContain('data-expanded="true"');
    });

    test("supports standalone subcomponent imports (DisclosureRoot, DisclosureTrigger, etc.)", () => {
      const html = ReactDOMServer.renderToString(
        <DisclosureRoot>
          <DisclosureTrigger>Trigger</DisclosureTrigger>
          <DisclosureIndicator />
          <DisclosurePanel>Panel</DisclosurePanel>
        </DisclosureRoot>,
      );

      expect(html).toContain("hashti-disclosure");
      expect(html).toContain("hashti-disclosure-trigger");
      expect(html).toContain("hashti-disclosure-indicator");
      expect(html).toContain("hashti-disclosure-panel");
    });
  });
});
