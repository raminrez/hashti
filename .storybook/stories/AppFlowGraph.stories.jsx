import { expect } from "storybook/test";

import appGraph from "../app-graph.json";
import { AppFlowGraph } from "../wrappers/AppFlowGraph";

// Real route map: .storybook/app-graph.json is the sb-flows output for this repo
// (63 Astro routes, 123 edges). The wrapper takes the graph as a prop; the JSON
// already carries nodes / edges / lanes, so it is passed through unchanged.
export default {
  title: "Flows/App map",
  parameters: { layout: "fullscreen" },
  tags: ["!autodocs"],
};

export const RouteMap = {
  render: () => (
    <AppFlowGraph graph={appGraph} generatedAt={appGraph.generatedAt} />
  ),
  play: async ({ canvasElement }) => {
    // Every route is a clickable node; a failed import renders an empty map.
    const nodes = canvasElement.querySelectorAll("[data-node]");
    await expect(nodes.length).toBe(appGraph.nodes.length);
  },
};
