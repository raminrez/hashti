import { beforeEach, describe, expect, test } from "bun:test";
import { clearSurfaces, createAgent, registerSurface } from "./registry";
import { agentTools, registerTools } from "./tools";

type Registered = {
  name: string;
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown) => unknown;
};

let registered: Registered[] = [];
let signals: AbortSignal[] = [];

beforeEach(() => {
  clearSurfaces();
  registered = [];
  signals = [];

  (globalThis as { document?: unknown }).document = {
    modelContext: {
      registerTool: (tool: Registered, options: { signal: AbortSignal }) => {
        registered.push(tool);
        signals.push(options.signal);
        return Promise.resolve();
      },
    },
  };
});

describe("registerTools", () => {
  test("offers the three tools with their annotations", () => {
    registerTools(createAgent(), { allow: () => true });

    expect(registered.map((tool) => tool.name)).toEqual(["snapshot", "query", "act"]);
    expect(registered.map((tool) => tool.annotations.readOnlyHint)).toEqual([
      true,
      true,
      false,
    ]);
    expect(agentTools).toHaveLength(3);
  });

  test("gates act through allow and leaves reads alone", async () => {
    registerSurface({
      component: "button",
      label: "Save project",
      actions: { press: () => "saved" },
      mark: { confirm: "Saves the project" },
    });

    registerTools(createAgent(), { allow: () => false });

    const act = registered.find((tool) => tool.name === "act")!;
    const snapshot = registered.find((tool) => tool.name === "snapshot")!;

    expect(await act.execute({ steps: [{ ref: "Save project", action: "press" }] })).toMatchObject({
      ok: false,
      error: 'The person said no to "Saves the project".',
    });
    expect(await snapshot.execute({})).toHaveLength(1);
  });

  test("aborting removes the tools", () => {
    const unregister = registerTools(createAgent(), { allow: () => true });
    unregister();

    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });

  test("does nothing in a browser without WebMCP", () => {
    (globalThis as { document?: unknown }).document = {};
    expect(() => registerTools(createAgent(), { allow: () => true })()).not.toThrow();
  });
});