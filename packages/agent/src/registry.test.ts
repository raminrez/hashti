import { beforeEach, describe, expect, test } from "bun:test";
import {
  act,
  clearSurfaces,
  query,
  registerSurface,
  snapshot,
} from "./registry";

let name = "Apollo";

beforeEach(() => {
  clearSurfaces();
  name = "Apollo";
});

function projectForm() {
  registerSurface({
    component: "text-field",
    label: "Project name",
    value: name,
    actions: {
      setValue: ([value]) => {
        name = String(value);
      },
    },
  });

  registerSurface({
    component: "select",
    label: "Region",
    value: "europe",
    items: [
      { value: "europe", label: "Europe" },
      { value: "asia-pacific", label: "Asia Pacific" },
    ],
    actions: { setValue: () => undefined },
  });

  registerSurface({
    component: "button",
    label: "Save project",
    actions: { press: () => "saved" },
    mark: { confirm: "Saves the project" },
  });
}

describe("snapshot", () => {
  test("lists components with their actions", () => {
    projectForm();
    const page = snapshot();

    expect(page).toHaveLength(3);
    expect(page[0]).toMatchObject({
      component: "text-field",
      label: "Project name",
      value: "Apollo",
      actions: ["setValue"],
    });
    expect(page[2]!).toMatchObject({ confirm: "Saves the project" });
  });

  test("leaves out hidden components and redacts secret values", () => {
    registerSurface({ component: "input", mark: { hidden: true } });
    registerSurface({ component: "input", value: "1234", mark: { secret: true } });

    const page = snapshot();
    expect(page).toHaveLength(1);
    expect(page[0]?.value).toBe("[redacted]");
  });
});

describe("act", () => {
  test("runs an action by label", async () => {
    projectForm();
    const result = await act({ steps: [{ ref: "project name", action: "setValue", args: ["Atlas"] }] });

    expect(result.ok).toBe(true);
    expect(name).toBe("Atlas");
  });

  test("resolves an item label to its value", async () => {
    let chosen = "";
    registerSurface({
      component: "select",
      label: "Region",
      items: [{ value: "asia-pacific", label: "Asia Pacific" }],
      actions: { setValue: ([value]) => { chosen = String(value); } },
    });

    await act({ steps: [{ ref: "Region", action: "setValue", args: ["Asia Pacific"] }] });
    expect(chosen).toBe("asia-pacific");
  });

  test("refuses without an allow when the target needs a person", async () => {
    projectForm();
    const result = await act({ steps: [{ ref: "Save project", action: "press" }] });

    expect(result.ok).toBe(false);
    expect(result.error).toBe('Needs a person: "Saves the project".');
  });

  test("refuses when allow answers no", async () => {
    projectForm();
    const result = await act({
      steps: [{ ref: "Save project", action: "press" }],
      allow: () => false,
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe('The person said no to "Saves the project".');
  });

  test("names the actions a component does take", async () => {
    projectForm();
    const result = await act({ steps: [{ ref: "Project name", action: "submit" }] });

    expect(result.ok).toBe(false);
    expect(result.error).toBe("text-field c1 takes no submit. It takes: setValue.");
  });
});

describe("query", () => {
  test("filters the choices of a closed list", () => {
    projectForm();
    const result = query({ within: "Region", text: "asia" });

    expect(result).toEqual({
      ref: "c2",
      items: [{ value: "asia-pacific", label: "Asia Pacific" }],
      more: 0,
    });
  });
});

describe("targets", () => {
  test("matches a label by whole words, not by substring", async () => {
    registerSurface({ component: "text-field", label: "Region", actions: { setValue: () => "region" } });
    registerSurface({
      component: "text-field",
      label: "Region code",
      actions: { setValue: () => "code" },
    });

    const result = await act({ steps: [{ ref: "Region", action: "setValue" }] });
    expect(result.ok).toBe(true);
    expect(result.steps[0]?.value).toBe("region");

    const partial = await act({ steps: [{ ref: "Regio", action: "setValue" }] });
    expect(partial.ok).toBe(false);
  });

  test("hides a hidden surface from labels but keeps it reachable by ref", async () => {
    const hidden = registerSurface({
      component: "select",
      label: "Region",
      actions: { setValue: () => "changed" },
      mark: { hidden: true },
    });

    const byLabel = await act({ steps: [{ ref: "Region", action: "setValue" }] });
    expect(byLabel.ok).toBe(false);

    const byRef = await act({ steps: [{ ref: hidden.ref, action: "setValue" }] });
    expect(byRef.ok).toBe(true);
  });

  test("reports an action that throws instead of rejecting", async () => {
    registerSurface({
      component: "button",
      label: "Save project",
      actions: {
        press: () => {
          throw new Error("the network is down");
        },
      },
    });

    const result = await act({ steps: [{ ref: "Save project", action: "press" }] });
    expect(result.ok).toBe(false);
    expect(result.error).toBe("press failed: the network is down.");
  });

  test("drops a field the surface no longer provides", () => {
    const select = registerSurface({
      component: "select",
      label: "Region",
      items: [{ value: "europe", label: "Europe" }],
      actions: {},
    });

    select.update({ items: undefined });
    expect(query({ within: "Region" })).toEqual({ ref: select.ref, items: [], more: 0 });
  });
});