import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Select } from "./select";

test("renders Select", () => {
  const html = renderToStaticMarkup(
    <Select label="Country" items={[{ id: "1", label: "US" }]}>
      {(item: any) => <span key={item.id}>{item.label}</span>}
    </Select>,
  );
  expect(html).toContain("Country");
});
