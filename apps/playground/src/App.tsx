import { useState } from "react";
import {
  Button,
  Checkbox,
  EmptyState,
  ListBoxItem,
  Select,
  TextField,
  Theme,
} from "@hashti/react";
import type { Key } from "react-aria-components";
import { act, snapshot } from "@hashti/agent";

const REGIONS = [
  { value: "europe", label: "Europe" },
  { value: "north-america", label: "North America" },
  { value: "asia-pacific", label: "Asia Pacific" },
];

export default function App() {
  const [name, setName] = useState("Apollo");
  const [region, setRegion] = useState<Key>("europe");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [failSave, setFailSave] = useState(false);
  const [tags, setTags] = useState<string[]>(["alpha", "beta"]);
  const [page, setPage] = useState<string>("");
  const [refuseAgents, setRefuseAgents] = useState(false);
  const [token, setToken] = useState("sk-live-1234");

  const refuses = (details: { source: string; cancel: () => void }) => {
    if (refuseAgents && details.source === "agent") {
      details.cancel();
      return true;
    }
    return false;
  };

  // A deliberate delay: the pending save is how the demo shows a loading state, and a pending
  // Button registers no `press`, so an agent cannot stack a second save on a running one.
  const save = async () => {
    setSaveState("saving");
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaveState(failSave ? "error" : "saved");
  };

  return (
    <Theme className="playground">
      <h1>Agent contract</h1>

      <TextField
        label="Project name"
        value={name}
        onChange={(value, details) => {
          if (refuses(details)) return;
          setName(value);
        }}
      />

      <TextField
        label="API token"
        agentSecret
        value={token}
        onChange={setToken}
      />

      <Select
        label="Region"
        selectedKey={region}
        onSelectionChange={(key, details) => {
          if (refuses(details)) return;
          setRegion(key ?? "europe");
        }}
      >
        {REGIONS.map((item) => (
          <ListBoxItem key={item.value} id={item.value}>
            {item.label}
          </ListBoxItem>
        ))}
      </Select>

      <Checkbox isSelected={refuseAgents} onChange={setRefuseAgents}>
        Refuse agent edits
      </Checkbox>

      <Checkbox isSelected={failSave} onChange={setFailSave}>
        Fail the next save
      </Checkbox>

      <Button
        agentConfirm="Saves the project"
        isPending={saveState === "saving"}
        pendingLabel="Saving"
        onPress={save}
      >
        Save project
      </Button>

      <Button variant="secondary" isDisabled>
        <span>Archive project</span>
      </Button>

      {saveState === "saving" ? <p role="status">Saving {name}…</p> : null}
      {saveState === "saved" ? <p role="status">Saved {name} · {region}</p> : null}
      {saveState === "error" ? (
        <p role="alert">Could not save {name}. Check the connection and try again.</p>
      ) : null}

      <section className="playground__tags">
        <h2>Tags</h2>
        {tags.length === 0 ? (
          <EmptyState
            title="No tags yet"
            description="Tags group the project in search results."
            action={
              <Button variant="secondary" onPress={() => setTags(["alpha", "beta"])}>
                Add tags
              </Button>
            }
          />
        ) : (
          <>
            <ul>
              {tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <Button variant="secondary" onPress={() => setTags([])}>
              Clear tags
            </Button>
          </>
        )}
      </section>

      <Button variant="secondary" onPress={() => setPage(JSON.stringify(snapshot(), null, 2))}>
        Read the page
      </Button>

      <Button
        variant="secondary"
        onPress={async () =>
          setPage(
            JSON.stringify(
              await act({
                steps: [{ ref: "Project name", action: "setValue", args: ["Atlas"] }],
              }),
              null,
              2,
            ),
          )
        }
      >
        Agent: set name to Atlas
      </Button>

      <Button
        variant="secondary"
        onPress={async () =>
          setPage(
            JSON.stringify(
              await act({
                steps: [{ ref: "Region", action: "setValue", args: ["asia-pacific"] }],
              }),
              null,
              2,
            ),
          )
        }
      >
        Agent: choose Asia Pacific
      </Button>

      <Button
        variant="secondary"
        onPress={async () =>
          setPage(
            JSON.stringify(
              await act({ steps: [{ ref: "Save project", action: "press" }] }),
              null,
              2,
            ),
          )
        }
      >
        Agent: press Save
      </Button>

      {page ? <pre className="playground__page">{page}</pre> : null}
    </Theme>
  );
}