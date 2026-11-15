# @hashti/agent

The agent surface for Hashti components: `snapshot`, `act` and `query` over a page, plus WebMCP
registration.

```ts
import { createAgent, registerTools } from "@hashti/agent";

const agent = createAgent({ allow: (request) => request.action !== "press" });
registerTools(agent, { allow: () => window.confirm("Run this step?") });
```

Components from `@hashti/react` register themselves while they are mounted; creating the bridge is
the whole setup. Decisions behind the contract are in
[docs/adr/0001](../../docs/adr/0001-ui-sdk-and-hashti-agent-bridge.md).

Agent writes reach the component's `onChange`. A component whose value the consumer does not pass
owns it, so an agent write repaints the control; a controlled component stays in the consumer's
hands and follows its state.

## Checking WebMCP registration

Chrome does not expose `document.modelContext` by default. Launch it with the feature on and the
tools appear:

```sh
open -a "Google Chrome" --args --enable-features=WebMCP
```

Then, in the page console:

```js
await document.modelContext.getTools(); // snapshot, query, act
await document.modelContext.executeTool(tool, {}); // takes the tool object, not its name
```

Verified on Chrome 157 with `@hashti/react` controls on the page: three tools registered, `snapshot`
executed through the browser's own dispatcher, and `act` routed through `allow`. Without the flag
the registration is skipped and the contract stays usable from code.