import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { snapshot } from "@hashti/agent";
import { clearSurfaces } from "../../agent/src/registry";
import { Button, TextField } from "./index";

test("renders on the server without registering a surface", () => {
  clearSurfaces();

  const html = renderToStaticMarkup(
    <>
      <TextField label="Project name" defaultValue="Apollo" />
      <Button agentConfirm="Saves the project">Save project</Button>
    </>,
  );

  expect(html).toContain("Project name");
  expect(snapshot()).toEqual([]);
});