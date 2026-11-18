import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Checkbox, CheckboxGroup, Radio, RadioGroup, Switch } from "@hashti/react";

test("checkbox renders role=checkbox with Hashti hook and tri-state attributes", () => {
  const html = renderToStaticMarkup(
    <>
      <Checkbox aria-label="plain">Plain</Checkbox>
      <Checkbox aria-label="on" defaultChecked>
        On
      </Checkbox>
      <Checkbox aria-label="mixed" checked="indeterminate" onCheckedChange={() => {}} />
    </>,
  );
  expect(html).toContain("hashti-checkbox");
  expect(html).toContain("hashti-checkbox-control");
  expect(html).toContain('role="checkbox"');
  expect(html).toContain('aria-checked="mixed"');
  expect(html).toContain("data-indeterminate");
  expect(html).toContain("data-checked");
  expect(html).toContain("data-unchecked");
  expect(html).toContain('data-slot="checkbox-indicator"');
});

test("checkbox group wires label, status, and hidden form inputs", () => {
  const html = renderToStaticMarkup(
    <CheckboxGroup
      label="Channels"
      description="Pick some."
      name="channels"
      defaultValue={["email"]}
      required
      status={{ type: "warning", message: "Digest is delayed." }}
    >
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
    </CheckboxGroup>,
  );
  expect(html).toContain("hashti-field");
  expect(html).toContain("hashti-checkbox-group");
  expect(html).toContain('role="group"');
  expect(html).toContain("aria-labelledby");
  expect(html).toContain("aria-describedby");
  expect(html).toContain("hashti-field__label");
  expect(html).toContain("hashti-field__description");
  expect(html).toContain("hashti-field__status--detached");
  expect(html).toContain('data-hashti-status="warning"');
  expect(html).toContain('name="channels"');
  expect(html).toContain('value="email"');
  expect(html).toContain('type="checkbox"');
});

test("radio group renders radiogroup role with roving options and field anatomy", () => {
  const html = renderToStaticMarkup(
    <RadioGroup label="Speed" name="speed" defaultValue="fast">
      <Radio value="fast">Fast</Radio>
      <Radio value="slow" disabled>
        Slow
      </Radio>
    </RadioGroup>,
  );
  expect(html).toContain("hashti-radio-group");
  expect(html).toContain('role="radiogroup"');
  expect(html).toContain('role="radio"');
  expect(html).toContain("hashti-radio-control");
  expect(html).toContain("hashti-radio-options");
  expect(html).toContain("data-checked");
  expect(html).toContain("data-unchecked");
  expect(html).toContain('name="speed"');
  expect(html).toContain('type="radio"');
  expect(html).toContain("data-disabled");
});

test("switch renders role=switch with size and color hooks", () => {
  const html = renderToStaticMarkup(
    <Switch name="live" defaultChecked size="sm" color="success">
      Live
    </Switch>,
  );
  expect(html).toContain("hashti-switch");
  expect(html).toContain('role="switch"');
  expect(html).toContain('aria-checked="true"');
  expect(html).toContain("hashti-switch-track");
  expect(html).toContain("hashti-switch-thumb");
  expect(html).toContain('data-size="sm"');
  expect(html).toContain('data-color="success"');
  expect(html).toContain("data-checked");
  expect(html).toContain('name="live"');
});

test("composable roots expose field parts without the default layout", () => {
  const html = renderToStaticMarkup(
    <CheckboxGroup.Root name="own" defaultValue={["a"]} aria-label="Own group">
      <CheckboxGroup.Checkbox value="a">A</CheckboxGroup.Checkbox>
    </CheckboxGroup.Root>,
  );
  expect(html).toContain("hashti-checkbox-group");
  expect(html).toContain('role="group"');
  expect(html).toContain('name="own"');
  expect(html).not.toContain("hashti-field__label");
});
