import { describe, expect, test } from "bun:test";
import ReactDOMServer from "react-dom/server";
import {
  TokenInput,
  createTokenInputController,
  type TokenInputValue,
  Command,
  CommandContext,
  useCommandContext,
  ComboBox,
  Icon,
  Kbd,
} from "../../packages/react/src";

describe("TokenInput & Command unit tests", () => {
  describe("TokenInput suite", () => {
    test("exports TokenInput and all compound subcomponents", () => {
      expect(typeof TokenInput).toBe("function");
      expect(typeof TokenInput.Root).toBe("function");
      expect(typeof TokenInput.Editor).toBe("function");
      expect(typeof TokenInput.Token).toBe("function");
      expect(typeof TokenInput.Label).toBe("function");
      expect(typeof TokenInput.Description).toBe("function");
      expect(typeof TokenInput.ErrorMessage).toBe("function");
      expect(typeof createTokenInputController).toBe("function");
    });

    test("renders convenient TokenInput with label, description, and tokens", () => {
      const value: TokenInputValue = [
        "Explain ",
        { type: "mention", value: "hashti", label: "@HashtiDesignSystem" },
        " architecture.",
      ];
      const html = ReactDOMServer.renderToString(
        <TokenInput
          label="AI Model Directives"
          description="Type prompts and mention context tokens with @"
          placeholder="Ask a question..."
          defaultValue={value}
        />,
      );

      expect(html).toContain("AI Model Directives");
      expect(html).toContain("Type prompts and mention context tokens with @");
      expect(html).toContain("hashti-token-input");
      expect(html).toContain("@HashtiDesignSystem");
      expect(html).toContain("hashti-token");
    });

    test("renders compound TokenInput anatomy with custom tokens", () => {
      const value: TokenInputValue = [
        { type: "model", value: "gpt-4o", label: "gpt-4o" },
        " prompt details",
      ];

      const html = ReactDOMServer.renderToString(
        <TokenInput.Root defaultValue={value} size="lg">
          <TokenInput.Label>Context Selector</TokenInput.Label>
          <TokenInput.Editor />
          <TokenInput.Description>Active workspace agents</TokenInput.Description>
        </TokenInput.Root>,
      );

      expect(html).toContain("Context Selector");
      expect(html).toContain('data-size="lg"');
      expect(html).toContain("gpt-4o");
      expect(html).toContain("Active workspace agents");
    });

    test("renders tokens with their type and label", () => {
      // On the server the editor renders each token's host with the label; the
      // custom renderToken markup mounts with the editor on the client.
      const html = ReactDOMServer.renderToString(
        <TokenInput.Root
          defaultValue={[{ type: "model", value: "gpt-4o", label: "gpt-4o" }]}
          renderToken={(token) => (
            <TokenInput.Token icon={<Icon name="sparkle" />}>{token.label}</TokenInput.Token>
          )}
        >
          <TokenInput.Editor />
        </TokenInput.Root>,
      );

      expect(html).toContain('data-slot="token-input-host"');
      expect(html).toContain('data-token-type="model"');
      expect(html).toContain("gpt-4o");
    });

    test("supports multiline", () => {
      const html = ReactDOMServer.renderToString(
        <TokenInput
          label="System Prompt"
          multiline
          placeholder="Type multiline instructions..."
          defaultValue={["Line 1\nLine 2"]}
        />,
      );

      expect(html).toContain('data-multiline="true"');
    });

    test("supports disabled and readOnly states", () => {
      const disabledHtml = ReactDOMServer.renderToString(
        <TokenInput label="Disabled Field" disabled defaultValue={["locked"]} />,
      );
      expect(disabledHtml).toContain("data-disabled");

      const readOnlyHtml = ReactDOMServer.renderToString(
        <TokenInput label="ReadOnly Field" readOnly defaultValue={["locked"]} />,
      );
      expect(readOnlyHtml).toContain("data-readonly");
    });
  });

  describe("Command suite", () => {
    test("exports Command, context, and all compound subcomponents", () => {
      expect(typeof Command).toBe("function");
      expect(typeof Command.Root).toBe("function");
      expect(typeof Command.Dialog).toBe("function");
      expect(typeof Command.Input).toBe("function");
      expect(typeof Command.List).toBe("function");
      expect(typeof Command.Group).toBe("function");
      expect(typeof Command.Item).toBe("function");
      expect(typeof Command.Empty).toBe("function");
      expect(typeof Command.Footer).toBe("function");
      expect(Command.Kbd).toBe(Kbd);
      expect(CommandContext).toBeDefined();
      expect(typeof useCommandContext).toBe("function");
    });

    test("renders Command subcomponents within the dialog", () => {
      const html = ReactDOMServer.renderToString(
        <Command.Root open enableShortcut={false}>
          <Command.Dialog aria-label="Quick Commands">
            <Command.Input placeholder="Search actions or commands..." />
            <Command.Empty>No results found.</Command.Empty>
            <Command.List>
              <Command.Group heading="Productivity Actions">
                <Command.Item
                  value="new-file"
                  icon={<Icon name="file" />}
                  shortcutKeys={["mod", "n"]}
                  description="Create a new workspace document"
                >
                  Create Document
                </Command.Item>
                <Command.Item value="settings" icon={<Icon name="settings" />} shortcutKeys={["mod", ","]}>
                  Preferences
                </Command.Item>
              </Command.Group>
            </Command.List>
            <Command.Footer />
          </Command.Dialog>
        </Command.Root>,
      );

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

    test("renders Command.Empty content", () => {
      const html = ReactDOMServer.renderToString(
        <Command.Root open enableShortcut={false}>
          <Command.Dialog aria-label="Commands" defaultQuery="nonexistent-command">
            <Command.Input />
            <Command.Empty
              title="No commands matching your query"
              description="Try searching for files, settings, or AI actions."
            />
            <Command.List>
              <Command.Item value="a">Alpha</Command.Item>
            </Command.List>
          </Command.Dialog>
        </Command.Root>,
      );

      // The empty part mounts with the class hook; its content shows once the
      // client confirms nothing matches the query.
      expect(html).toContain("hashti-command-palette__empty");
      expect(html).toContain('data-slot="command-empty"');
    });

    test("renders custom footer content", () => {
      const html = ReactDOMServer.renderToString(
        <Command.Root open enableShortcut={false}>
          <Command.Dialog aria-label="Commands">
            <Command.Footer>
              <div className="custom-footer-hint">
                <Kbd keys={["tab"]} />
                <span>Next section</span>
              </div>
            </Command.Footer>
          </Command.Dialog>
        </Command.Root>,
      );

      expect(html).toContain("hashti-command-palette__footer");
      expect(html).toContain("custom-footer-hint");
      expect(html).toContain("Next section");
    });
  });

  describe("ComboBox renderValue ergonomics", () => {
    test("ComboBox accepts a custom renderValue function", () => {
      const html = ReactDOMServer.renderToString(
        <ComboBox
          label="Frameworks"
          multiple
          defaultValue={["react", "solid"]}
          items={[
            { value: "react", label: "React" },
            { value: "solid", label: "Solid" },
          ]}
          renderValue={(state) => (
            <div className="custom-combobox-selection-pills">
              {state.labels.map((label) => (
                <span key={label} className="custom-pill">
                  {label}
                </span>
              ))}
            </div>
          )}
        />,
      );

      expect(html).toContain("hashti-combobox");
      expect(html).toContain("hashti-combobox-values");
      expect(html).toContain("custom-combobox-selection-pills");
      expect(html).toContain("React");
      expect(html).toContain("Solid");
    });
  });
});
