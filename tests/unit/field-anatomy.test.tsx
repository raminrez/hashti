import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Field, FieldHelp, fieldClassName } from "@hashti/react";

// One module owns the reading order: label, guidance, control, recovery, status.
// These assertions are the interface contract every typed field inherits.

describe("Field anatomy", () => {
  const markup = renderToStaticMarkup(
    <Field
      label="Workspace name"
      description="Use the name your team recognises."
      errorMessage="Enter a workspace name."
      status={{ type: "warning", message: "This name is already in use." }}
    >
      <input aria-label="Workspace name" />
    </Field>,
  );

  test("renders label, guidance, control, recovery, then status", () => {
    const order = [
      "Workspace name",
      "Use the name your team recognises.",
      "<input",
      "Enter a workspace name.",
      "This name is already in use.",
    ];
    const positions = order.map((needle) => markup.indexOf(needle));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  test("keeps guidance visible while recovery is shown", () => {
    expect(markup).toContain("Use the name your team recognises.");
    expect(markup).toContain("Enter a workspace name.");
  });

  test("exposes the anatomy hooks and status attributes", () => {
    expect(markup).toContain('data-slot="root"');
    expect(markup).toContain('data-hashti-status="warning"');
    expect(markup).toContain("hashti-field__label");
    expect(markup).toContain("hashti-field__error");
  });

  test("builds the root class once", () => {
    expect(fieldClassName("select")).toBe("hashti-field hashti-select");
  });
});

describe("Field parts", () => {
  test("exposes the anatomy as compound parts", () => {
    expect(Field.Label).toBeDefined();
    expect(Field.Description).toBeDefined();
    expect(Field.ErrorMessage).toBeDefined();
    expect(Field.Help).toBe(FieldHelp);
    expect(Field.Control).toBeDefined();
  });

  test("a part can be borrowed on its own", () => {
    const markup = renderToStaticMarkup(<Field.Description>Standalone guidance</Field.Description>);
    expect(markup).toContain("Standalone guidance");
    expect(markup).toContain("hashti-field__description");
  });
});
