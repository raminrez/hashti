import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ComboBox } from "./combobox";

test("renders ComboBox", () => {
  const html = renderToStaticMarkup(
    <ComboBox label="Fruit" items={[{ id: "1", label: "Apple" }]}>
      {(item: any) => <span key={item.id}>{item.label}</span>}
    </ComboBox>,
  );
  expect(html).toContain("Fruit");
});
