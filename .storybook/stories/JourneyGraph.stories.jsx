import { expect } from "storybook/test";

import flows from "../flows.json";
import { JourneyGraph } from "../wrappers/JourneyGraph";

// The docs-site journey, built from the real sb-flows output: each step names a
// route from flows.json#routes and, for a transition, the edge that proves it.
const routes = flows.routes[flows.dominantRouter];
const route = (path) => routes.find((r) => r.path === path);
const edge = (from, to) =>
  flows.edges.find((e) => e.from === from && e.to === to);

const screen = (path, detail) => ({
  kind: "screen",
  label: route(path)?.title ?? path,
  detail: `${path} — ${detail}`,
});
const action = (from, to) => {
  const e = edge(from, to);
  return {
    kind: "action",
    label: e?.label ?? `Go to ${to}`,
    detail: `${from} → ${to} · ${e?.kind} (${e?.file}:${e?.line})`,
  };
};

const journey = {
  title: "Read the Button docs",
  role: "public",
  entry: "/",
  steps: [
    screen("/", "landing page"),
    action("/", "/docs"),
    screen("/docs", "docs index"),
    action("/docs", "/docs/button"),
    screen("/docs/button", "component reference"),
    {
      kind: "end",
      label: "Try it in Storybook",
      detail: "open the component states",
      storyId: "components-button--default",
    },
  ],
};

export default {
  title: "Flows/Docs journey",
  parameters: { layout: "padded" },
  tags: ["!autodocs"],
};

export const ReadTheButtonDocs = {
  render: () => <JourneyGraph journey={journey} />,
  play: async ({ canvasElement }) => {
    // Catches a renamed/removed route in flows.json (undefined title or edge).
    await expect(canvasElement.textContent).toContain(journey.title);
    await expect(canvasElement.textContent).toContain("component reference");
    await expect(canvasElement.textContent).not.toContain("undefined");
    for (const step of journey.steps) {
      await expect(canvasElement.textContent).toContain(step.label);
    }
  },
};
