import { describe, expect, test } from "bun:test";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  TokenField,
  TokenFieldContext,
  useTokenFieldContext,
  TokenFieldValue,
  CommandPalette,
  CommandPaletteContext,
  useCommandPaletteContext,
  ComboBox,
  ListBox,
  Icon,
  Kbd,
} from "../../packages/react/src";

describe("TokenField & CommandPalette Unit Tests", () => {
  describe("TokenField suite", () => {
    test("exports TokenField, TokenFieldValue, context, and all compound subcomponents", () => {
      expect(typeof TokenField).toBe("function");
      expect(typeof TokenField.Root).toBe("function");
      expect(typeof TokenField.Input).toBe("function");
      expect(typeof TokenField.Token).toBe("function");
      expect(typeof TokenField.Label).toBe("function");
      expect(typeof TokenField.Description).toBe("function");
      expect(typeof TokenField.ErrorMessage).toBe("function");
      expect(typeof TokenFieldValue).toBe("function");
      expect(TokenFieldContext).toBeDefined();
      expect(typeof useTokenFieldContext).toBe("function");
    });

    test("instantiates TokenFieldValue with segments correctly", () => {
      const value = new TokenFieldValue([
        { type: "text", text: "Explain " },
        { type: "token", text: "@HashtiDesignSystem", value: { id: "hashti" } },
        { type: "text", text: " architecture." },
      ]);
      expect(value.toString()).toBe("Explain @HashtiDesignSystem architecture.");
      expect(value.segments.length).toBe(3);
      expect(value.segments[0]!.type).toBe("text");
      expect(value.segments[1]!.type).toBe("token");
      expect(value.segments[1]!.text).toBe("@HashtiDesignSystem");
    });

    test("renders convenient TokenField with label, description, and placeholder", () => {
      const value = new TokenFieldValue([
        { type: "token", text: "tag1" },
        { type: "text", text: " " },
      ]);
      const html = ReactDOMServer.renderToString(
        <TokenField
          label="AI Model Directives"
          description="Type prompts and mention context tokens with @"
          placeholder="Ask a question..."
          value={value}
        />,
      );

      expect(html).toContain("AI Model Directives");
      expect(html).toContain("Type prompts and mention context tokens with @");
      expect(html).toContain("hashti-token-field");
      expect(html).toContain("hashti-token-input");
      expect(html).toContain('data-placeholder="Ask a question..."');
      expect(html).toContain("tag1");
      expect(html).toContain("hashti-token");
    });

    test("renders compound TokenField anatomy with custom tokens, icons, and remove button", () => {
      const value = new TokenFieldValue([
        { type: "token", text: "gpt-4o", value: { model: "gpt" } },
        { type: "text", text: " prompt details" },
      ]);

      const html = ReactDOMServer.renderToString(
        <TokenField.Root value={value} size="lg">
          <TokenField.Label>Context Selector</TokenField.Label>
          <TokenField.Input>
            {(segment) => (
              <TokenField.Token
                key={segment.text}
                icon={<Icon name="sparkle" />}
                onRemove={() => {}}
              >
                {segment.text}
              </TokenField.Token>
            )}
          </TokenField.Input>
          <TokenField.Description>Active workspace agents</TokenField.Description>
          <TokenField.ErrorMessage>Invalid token format</TokenField.ErrorMessage>
        </TokenField.Root>,
      );

      expect(html).toContain("Context Selector");
      expect(html).toContain('data-size="lg"');
      expect(html).toContain("hashti-token-input");
      expect(html).toContain("gpt-4o");
      expect(html).toContain("hashti-token__icon");
      expect(html).toContain("hashti-token__remove");
      expect(html).toContain('aria-label="Remove token"');
      expect(html).toContain("Active workspace agents");
    });

    test("supports multiline=true for multi-line AI prompt boxes", () => {
      const value = new TokenFieldValue([{ type: "text", text: "Line 1\nLine 2" }]);

      const html = ReactDOMServer.renderToString(
        <TokenField
          label="System Prompt"
          multiline
          placeholder="Type multiline instructions..."
          value={value}
        />,
      );

      expect(html).toContain('data-multiline="true"');
      expect(html).toContain("hashti-token-field--multiline");
      expect(html).toContain("hashti-token-input--multiline");
    });

    test("supports isDisabled and isReadOnly states", () => {
      const value = new TokenFieldValue([{ type: "token", text: "locked-token" }]);

      const disabledHtml = ReactDOMServer.renderToString(
        <TokenField label="Disabled Field" isDisabled value={value} />,
      );
      expect(disabledHtml).toContain('data-disabled="true"');

      const readOnlyHtml = ReactDOMServer.renderToString(
        <TokenField label="ReadOnly Field" isReadOnly value={value} />,
      );
      expect(readOnlyHtml).toContain('data-readonly="true"');
    });
  });

  describe("CommandPalette suite", () => {
    test("exports CommandPalette, context, and all compound subcomponents", () => {
      expect(typeof CommandPalette).toBe("function");
      expect(typeof CommandPalette.Root).toBe("function");
      expect(typeof CommandPalette.Dialog).toBe("function");
      expect(typeof CommandPalette.Input).toBe("function");
      expect(typeof CommandPalette.List).toBe("function");
      expect(typeof CommandPalette.Group).toBe("function");
      expect(typeof CommandPalette.Item).toBe("function");
      expect(typeof CommandPalette.Empty).toBe("function");
      expect(typeof CommandPalette.Footer).toBe("function");
      expect(CommandPalette.Kbd).toBe(Kbd);
      expect(CommandPaletteContext).toBeDefined();
      expect(typeof useCommandPaletteContext).toBe("function");
    });

    test("renders CommandPalette subcomponents within Root with input, groups, items, and footer", () => {
      const html = ReactDOMServer.renderToString(
        <CommandPalette.Root isOpen={true} enableShortcut={true}>
          <CommandPalette.Input placeholder="Search actions or commands..." />
          <CommandPalette.List>
            <CommandPalette.Group heading="Productivity Actions">
              <CommandPalette.Item
                id="new-file"
                icon={<Icon name="file" />}
                shortcut={["mod", "n"]}
                description="Create a new workspace document"
              >
                Create Document
              </CommandPalette.Item>
              <CommandPalette.Item
                id="settings"
                icon={<Icon name="settings" />}
                shortcut={["mod", ","]}
              >
                Preferences
              </CommandPalette.Item>
            </CommandPalette.Group>
          </CommandPalette.List>
          <CommandPalette.Footer />
        </CommandPalette.Root>,
      );

      expect(html).toContain("hashti-command-palette__input-wrapper");
      expect(html).toContain("hashti-command-palette__input");
      expect(html).toContain('placeholder="Search actions or commands..."');
      expect(html).toContain("Productivity Actions");
      expect(html).toContain("Create Document");
      expect(html).toContain("Create a new workspace document");
      expect(html).toContain("Preferences");
      expect(html).toContain("hashti-command-palette__footer");
      expect(html).toContain("Navigate");
      expect(html).toContain("Select");
      expect(html).toContain("Dismiss");
    });

    test("renders CommandPalette.Empty state when no items match query", () => {
      const html = ReactDOMServer.renderToString(
        <CommandPalette.Root isOpen={true}>
          <CommandPalette.Input value="nonexistent-command" />
          <CommandPalette.List>
            <CommandPalette.Empty
              title="No commands matching your query"
              description="Try searching for files, settings, or AI actions."
            />
          </CommandPalette.List>
        </CommandPalette.Root>,
      );

      expect(html).toContain("hashti-command-palette__empty");
      expect(html).toContain("No commands matching your query");
      expect(html).toContain("Try searching for files, settings, or AI actions.");
    });

    test("renders custom footer toolbar with custom shortcuts and badges", () => {
      const html = ReactDOMServer.renderToString(
        <CommandPalette.Root isOpen={true}>
          <CommandPalette.Footer>
            <div className="custom-footer-hint">
              <Kbd keys={["tab"]} />
              <span>Next section</span>
            </div>
          </CommandPalette.Footer>
        </CommandPalette.Root>,
      );

      expect(html).toContain("hashti-command-palette__footer");
      expect(html).toContain("custom-footer-hint");
      expect(html).toContain("Next section");
    });
  });

  describe("ComboBox Selection renderValue Ergonomics", () => {
    test("ComboBox accepts and renders custom renderValue function", () => {
      interface Framework {
        id: string;
        name: string;
        tag: string;
      }
      const items: Framework[] = [
        { id: "react", name: "React", tag: "UI Library" },
        { id: "solid", name: "Solid", tag: "Reactive" },
      ];

      const html = ReactDOMServer.renderToString(
        <ComboBox<Framework, "multiple">
          label="Frameworks"
          selectionMode="multiple"
          items={items}
          renderValue={(selectedItems) => (
            <div className="custom-combobox-selection-pills">
              {selectedItems.map((item) => (
                <span key={item?.id ?? "unknown"} className="custom-pill">
                  {item?.name} [{item?.tag}]
                </span>
              ))}
            </div>
          )}
        >
          {(item) => (
            <ListBox.Item id={item.id} textValue={item.name}>
              {item.name}
            </ListBox.Item>
          )}
        </ComboBox>,
      );

      expect(html).toContain("hashti-combobox");
      expect(html).toContain("hashti-combobox-values");
    });
  });
});
