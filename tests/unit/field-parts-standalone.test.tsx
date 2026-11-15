import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  FieldControl,
  FieldDescription,
  FieldErrorMessage,
  FieldHelp,
  FieldLabel,
  FieldStatusMessage,
} from "@hashti/react";

// Every anatomy part must be usable on its own, outside a field root and without a provider:
// other components (and consumers) should be able to import one part instead of the anatomy.

describe("field parts stand alone", () => {
  test("label renders with no field root and no provider", () => {
    const markup = renderToStaticMarkup(<FieldLabel>Workspace name</FieldLabel>);
    expect(markup).toContain("Workspace name");
    expect(markup).toContain("hashti-field__label");
    expect(markup).toContain('data-slot="label"');
  });

  test("label still honours the necessity marker from props", () => {
    const markup = renderToStaticMarkup(<FieldLabel isRequired>Email</FieldLabel>);
    expect(markup).toContain("hashti-field__necessity");
    expect(markup).toContain("required");
  });

  test("description renders alone", () => {
    const markup = renderToStaticMarkup(<FieldDescription>Use a team name.</FieldDescription>);
    expect(markup).toContain("Use a team name.");
    expect(markup).toContain("hashti-field__description");
    expect(markup).toContain('data-slot="description"');
  });

  test("field error renders alone", () => {
    const markup = renderToStaticMarkup(<FieldErrorMessage>Enter a value.</FieldErrorMessage>);
    expect(markup).toContain("Enter a value.");
    expect(markup).toContain("hashti-field__error");
    expect(markup).toContain('data-slot="error"');
  });

  test("help container and status message render alone", () => {
    const markup = renderToStaticMarkup(
      <FieldHelp>
        <FieldStatusMessage />
      </FieldHelp>,
    );
    expect(markup).toContain("hashti-field__help");
    expect(markup).toContain('data-slot="help"');
  });

  test("control group renders alone", () => {
    const markup = renderToStaticMarkup(
      <FieldControl>
        <span>control</span>
      </FieldControl>,
    );
    expect(markup).toContain("hashti-field__control");
    expect(markup).toContain('data-slot="control"');
  });
});
