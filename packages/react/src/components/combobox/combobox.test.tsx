import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ComboBox } from "./combobox";

test("renders ComboBox", () => {
  const html = renderToStaticMarkup(
    <ComboBox label="Fruit" items={[{ value: "apple", label: "Apple" }]} />,
  );
  expect(html).toContain("Fruit");
  expect(html).toContain("hashti-combobox");
  expect(html).toContain('role="combobox"');
});

test("renders multiple ComboBox with chips value", () => {
  const html = renderToStaticMarkup(
    <ComboBox
      label="Tags"
      multiple
      defaultValue={["react"]}
      items={[
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
      ]}
    />,
  );
  expect(html).toContain("hashti-combobox-values");
  expect(html).toContain("hashti-combobox-chip");
  expect(html).toContain("React");
});
