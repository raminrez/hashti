"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
  CommandSeparator,
  createCommandController,
  useAsyncOptions,
} from "@hashti/react";

export function CommandDemo() {
  return (
    <Command onAction={(v) => console.log(v)} style={{ maxWidth: 448 }}>
      <CommandInput
        placeholder="Type a command or search…"
        aria-label="Command palette"
      />
      <CommandList>
        <CommandGroup>
          <CommandGroupLabel>File</CommandGroupLabel>
          <CommandItem value="new-file">New file</CommandItem>
          <CommandItem value="open">Open recent</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          <CommandGroupLabel>Edit</CommandGroupLabel>
          <CommandItem value="undo">Undo</CommandItem>
          <CommandItem value="disabled-one" disabled>
            Redo
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <CommandEmpty>No commands found.</CommandEmpty>
    </Command>
  );
}

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const teams = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
];

export function CommandPagesDemo() {
  const command = React.useState(() => createCommandController())[0];
  const [pages, setPages] = React.useState<string[]>([]);
  return (
    <Command
      controller={command}
      pages={pages}
      onPagesChange={setPages}
      onAction={(value) => {
        if (value === "back") {
          command.pop();
        }
      }}
      style={{ maxWidth: 448 }}
    >
      <CommandInput
        aria-label="Search commands"
        placeholder={
          pages.length ? "Search… (Backspace to go back)" : "What do you need?"
        }
      />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        <CommandPage>
          <CommandGroup>
            <CommandGroupLabel>Workspace</CommandGroupLabel>
            <CommandItem value="theme" page="theme">
              Change theme…
            </CommandItem>
            <CommandItem value="teams" page="teams">
              Switch team…
            </CommandItem>
          </CommandGroup>
        </CommandPage>
        <CommandPage value="theme">
          {themes.map((theme) => (
            <CommandItem key={theme.value} value={theme.value}>
              {theme.label}
            </CommandItem>
          ))}
        </CommandPage>
        <CommandPage value="teams">
          {teams.map((team) => (
            <CommandItem key={team.value} value={team.value}>
              {team.label}
            </CommandItem>
          ))}
        </CommandPage>
        {pages.length > 0 && <CommandItem value="back">Go back</CommandItem>}
      </CommandList>
    </Command>
  );
}

const issues = [
  "Fix login redirect",
  "Dark mode flicker",
  "Add billing page",
  "Search is slow",
  "Update dependencies",
  "Crash on upload",
  "Export to CSV",
  "Keyboard shortcuts help",
];

function searchIssues(query: string, { signal }: { signal: AbortSignal }) {
  return new Promise<{ value: string; label: string }[]>((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = query.trim().toLowerCase();
      resolve(
        issues
          .filter((issue) => issue.toLowerCase().includes(needle))
          .map((issue) => ({
            value: issue.toLowerCase().replaceAll(" ", "-"),
            label: issue,
          })),
      );
    }, 400);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export function CommandAsyncDemo() {
  const results = useAsyncOptions(searchIssues, {
    debounce: 250,
    immediate: true,
  });
  return (
    <Command
      filter={false}
      status={results.status}
      onQueryChange={(query) => results.setQuery(query)}
      style={{ maxWidth: 448 }}
    >
      <CommandInput aria-label="Search issues" placeholder="Search issues…" />
      <CommandEmpty>
        {(state) =>
          state.empty && !state.loading
            ? `No issues match “${state.query}”.`
            : null
        }
      </CommandEmpty>
      <CommandList>
        {results.status === "loading" &&
          [0, 1, 2].map((row) => (
            <div key={row} className="hashti-command__skeleton-row" />
          ))}
        {results.items.map((issue) => (
          <CommandItem
            key={issue.value}
            value={issue.value}
            label={issue.label}
          >
            {issue.label}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
