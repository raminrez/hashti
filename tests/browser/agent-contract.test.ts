import { afterAll, expect, test } from "bun:test";
import { audit, stopStorybook, withStory } from "../harness";

// Drives the bridge the way an agent does and then reads the DOM, so a write that only reaches
// the snapshot fails here.

afterAll(async () => {
  await stopStorybook();
});

test("an agent write repaints an uncontrolled field and select", async () => {
  await withStory("agent-contract--uncontrolled", async (page) => {
    const field = page.locator("input").first();
    const trigger = page.locator(".hashti-select-trigger").first();

    expect(await field.inputValue()).toBe("Draft");
    expect((await trigger.textContent())?.trim()).toBe("Free");

    const result = await page.evaluate(async () => {
      const agent = (window as unknown as { agent: { act: (input: unknown) => Promise<any> } })
        .agent;
      return agent.act({
        steps: [
          { ref: "Notes", action: "setValue", args: ["Atlas"] },
          { ref: "Tier", action: "setValue", args: ["pro"] },
        ],
      });
    });

    expect(result.ok).toBe(true);
    // The screen followed the write, not only the snapshot.
    expect(await field.inputValue()).toBe("Atlas");
    expect((await trigger.textContent())?.trim()).toBe("Pro");
    // An unnamed control stays out of the snapshot: the whitespace inside a trigger is not a name.
    expect(result.values.map((surface: { label?: string }) => surface.label)).not.toContain("");
    expect(await audit(page)).toEqual([]);
  });
});
