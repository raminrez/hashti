import { describe, expect, test } from "bun:test";
import React from "react";
import ReactDOMServer from "react-dom/server";
// Direct imports keep this suite independent of the barrel while other
// components are mid-migration.
import {
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSeparator,
} from "../../packages/react/src/components/toolbar";
import { Button } from "../../packages/react/src/components/button";
import {
  Accordion,
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionIndicator,
  AccordionPanel,
} from "../../packages/react/src/components/accordion";
import { Tabs, TabsList, Tab, TabsPanel } from "../../packages/react/src/components/tabs";

describe("Toolbar & Accordion unit tests", () => {
  describe("Toolbar component suite", () => {
    test("renders horizontal flat Toolbar with groups and items", () => {
      const html = ReactDOMServer.renderToString(
        <Toolbar aria-label="Editor actions">
          <Toolbar.Group aria-label="Text formatting">
            <Button variant="ghost">Bold</Button>
            <Button variant="ghost">Italic</Button>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group aria-label="History">
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
      // The separator's line runs across the toolbar's axis.
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
      // In vertical toolbar, the separator's line runs horizontally.
      expect(html).toContain('role="separator"');
      expect(html).toContain('aria-orientation="horizontal"');
      expect(html).toContain("hashti-toolbar-separator");
    });

    test("supports disabled toolbar state and standalone component imports", () => {
      const html = ReactDOMServer.renderToString(
        <Toolbar disabled variant="raised" aria-label="Disabled bar">
          <ToolbarGroup aria-label="Cluster">
            <ToolbarItem>
              <Button>Action</Button>
            </ToolbarItem>
            <ToolbarSeparator />
          </ToolbarGroup>
        </Toolbar>,
      );

      expect(html).toContain("data-disabled");
      expect(html).toContain('data-variant="raised"');
    });
  });

  describe("Accordion component suite (replaces Disclosure & DisclosureGroup)", () => {
    test("renders an Accordion with Trigger, Indicator, and Panel", () => {
      const html = ReactDOMServer.renderToString(
        <Accordion defaultValue={["advanced"]}>
          <Accordion.Item value="advanced">
            <Accordion.Header headingLevel={2}>
              <Accordion.Trigger>
                <span>Advanced Configuration</span>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>
              <p>Panel details and content</p>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>,
      );

      expect(html).toContain("hashti-accordion");
      expect(html).toContain("hashti-accordion-item");
      expect(html).toContain('data-size="md"');
      expect(html).toContain('data-variant="default"');
      expect(html).toContain("data-open");
      expect(html).toContain("<h2");
      expect(html).toContain("hashti-accordion-trigger");
      expect(html).toContain('aria-expanded="true"');
      expect(html).toContain("hashti-accordion-indicator");
      expect(html).toContain("hashti-accordion-panel");
      expect(html).toContain("hashti-accordion-panel-inner");
      expect(html).toContain("Panel details and content");
    });

    test("renders Accordion with card and flush variants", () => {
      const cardHtml = ReactDOMServer.renderToString(
        <Accordion variant="card" size="lg">
          <Accordion.Item value="card">
            <Accordion.Header>
              <Accordion.Trigger>Card Summary</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Card Body</Accordion.Panel>
          </Accordion.Item>
        </Accordion>,
      );

      expect(cardHtml).toContain('data-variant="card"');
      expect(cardHtml).toContain('data-size="lg"');

      const flushHtml = ReactDOMServer.renderToString(
        <Accordion variant="flush" size="sm">
          <Accordion.Item value="flush">
            <Accordion.Header>
              <Accordion.Trigger>Flush Summary</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Flush Body</Accordion.Panel>
          </Accordion.Item>
        </Accordion>,
      );

      expect(flushHtml).toContain('data-variant="flush"');
      expect(flushHtml).toContain('data-size="sm"');
    });

    test("renders a multi-item Accordion with a default open item", () => {
      const html = ReactDOMServer.renderToString(
        <Accordion multiple defaultValue={["security"]} variant="card" size="sm">
          <Accordion.Item value="general">
            <Accordion.Header headingLevel={3}>
              <Accordion.Trigger>General Settings</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>General details</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="security">
            <Accordion.Header headingLevel={3}>
              <Accordion.Trigger>Security Settings</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Security details</Accordion.Panel>
          </Accordion.Item>
        </Accordion>,
      );

      expect(html).toContain("hashti-accordion");
      expect(html).toContain('data-variant="card"');
      expect(html).toContain('data-size="sm"');
      // value="security" is open
      expect(html).toContain("data-open");
      expect(html).toContain("Security details");
    });

    test("supports standalone subcomponent imports (AccordionRoot, AccordionTrigger, etc.)", () => {
      const html = ReactDOMServer.renderToString(
        <AccordionRoot defaultValue={["one"]}>
          <AccordionItem value="one">
            <AccordionHeader>
              <AccordionTrigger>
                Trigger
                <AccordionIndicator />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>Panel</AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      expect(html).toContain("hashti-accordion");
      expect(html).toContain("hashti-accordion-trigger");
      expect(html).toContain("hashti-accordion-indicator");
      expect(html).toContain("hashti-accordion-panel");
    });
  });

  describe("Tabs component suite", () => {
    test("renders Tabs with list, tabs, and panels", () => {
      const html = ReactDOMServer.renderToString(
        <Tabs defaultValue="a" aria-label="Sample tabs">
          <TabsList aria-label="Sample tabs">
            <Tab value="a">Alpha</Tab>
            <Tab value="b" disabled>
              Beta
            </Tab>
          </TabsList>
          <TabsPanel value="a">Panel A</TabsPanel>
          <TabsPanel value="b">Panel B</TabsPanel>
        </Tabs>,
      );

      expect(html).toContain("hashti-tabs");
      expect(html).toContain("hashti-tabs__list");
      expect(html).toContain("hashti-tab");
      expect(html).toContain("hashti-tab-panel");
      expect(html).toContain('data-variant="line"');
      expect(html).toContain('data-size="md"');
      expect(html).toContain('role="tablist"');
      expect(html).toContain('role="tab"');
      expect(html).toContain("data-selected");
      expect(html).toContain('aria-selected="true"');
      expect(html).toContain("data-disabled");
      expect(html).toContain("Panel A");
      // The unselected panel is unmounted by default.
      expect(html).not.toContain("Panel B");
    });

    test("renders contained variant and vertical orientation", () => {
      const html = ReactDOMServer.renderToString(
        <Tabs variant="contained" size="sm" orientation="vertical" defaultValue="x">
          <TabsList aria-label="Vertical tabs">
            <Tab value="x">X</Tab>
            <Tab value="y">Y</Tab>
          </TabsList>
          <TabsPanel value="x">X content</TabsPanel>
          <TabsPanel value="y">Y content</TabsPanel>
        </Tabs>,
      );

      expect(html).toContain('data-variant="contained"');
      expect(html).toContain('data-size="sm"');
      expect(html).toContain('data-orientation="vertical"');
    });
  });
});
