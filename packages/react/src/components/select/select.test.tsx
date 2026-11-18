import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Select } from "./select";

test("renders Select", () => {
  const html = renderToStaticMarkup(
    <Select label="Country" items={[{ value: "us", label: "US" }]} />,
  );
  expect(html).toContain("Country");
  expect(html).toContain("hashti-select");
  expect(html).toContain("hashti-select-trigger");
});
