import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { FieldLabel, FieldDescription, FieldHelp, FieldInput, fieldParts } from "./";

test("renders FieldLabel and FieldDescription with correct classes", () => {
  const html = renderToStaticMarkup(
    <div>
      <FieldLabel isRequired>Username</FieldLabel>
      <FieldDescription>Choose a unique handle</FieldDescription>
      <FieldInput placeholder="username" />
      <FieldHelp>Need help?</FieldHelp>
    </div>,
  );
  expect(html).toContain("hashti-field__label");
  expect(html).toContain("Username");
  expect(html).toContain("hashti-field__description");
  expect(html).toContain("Choose a unique handle");
  expect(html).toContain("hashti-field__help");
});

test("exports all expected fieldParts", () => {
  expect(fieldParts.Label).toBeDefined();
  expect(fieldParts.Description).toBeDefined();
  expect(fieldParts.Help).toBeDefined();
  expect(fieldParts.ErrorMessage).toBeDefined();
  expect(fieldParts.Status).toBeDefined();
  expect(fieldParts.StatusIcon).toBeDefined();
});
