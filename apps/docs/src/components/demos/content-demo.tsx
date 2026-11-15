import { useState } from "react";
import {
  Card,
  Tile,
  ClickableTile,
  Avatar,
  Breadcrumbs,
  Breadcrumb,
  CodeSnippet,
  Divider,
  EmptyState,
  Kbd,
  Link,
  Toolbar,
  Button,
} from "@hashti/react";

export function CardLiveDemo() {
  return (
    <Card className="max-w-sm p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar name="Hashti" size="md" />
        <div>
          <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
            Isfahan Grand Pavilion
          </h4>
          <span className="text-xs text-neutral-500">Safavid Architecture</span>
        </div>
      </div>
      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Featuring an octagonal transitional vestibule and a central reflecting pool with mineral
        turquoise tiles.
      </p>
      <div className="pt-2 flex justify-end">
        <Button size="sm" variant="secondary">
          View Details
        </Button>
      </div>
    </Card>
  );
}

export function TileLiveDemo() {
  return (
    <div className="flex flex-col gap-3 max-w-sm w-full">
      <Tile className="p-4">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
          Static Tile
        </span>
        <span className="text-sm font-medium text-neutral-900 dark:text-white">
          Structural Boundary Layer
        </span>
      </Tile>
      <ClickableTile href="#portal" className="p-4">
        <span className="text-xs font-semibold text-[var(--hashti-focus)] uppercase tracking-wider block mb-1">
          Clickable Tile
        </span>
        <span className="text-sm font-medium text-neutral-900 dark:text-white">
          Navigate to Portal Entrance &rarr;
        </span>
      </ClickableTile>
    </div>
  );
}

export function AvatarLiveDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar name="Farhad Shirazi" size="sm" />
      <Avatar name="Negin Kermani" size="md" />
      <Avatar name="Kaveh Isfahani" size="lg" />
    </div>
  );
}

export function BreadcrumbsLiveDemo() {
  return (
    <Breadcrumbs>
      <Breadcrumb href="/docs">Docs</Breadcrumb>
      <Breadcrumb href="/docs/foundations">Foundations</Breadcrumb>
      <Breadcrumb href="/docs/foundations/philosophy">Spatial Transition</Breadcrumb>
    </Breadcrumbs>
  );
}

export function CodeSnippetLiveDemo() {
  return (
    <div className="w-full max-w-md">
      <CodeSnippet type="inline" code="bun add @hashti/react @hashti/tokens" />
    </div>
  );
}

export function DividerLiveDemo() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <span className="text-xs text-neutral-500">Section Alpha: Public Exterior</span>
      <Divider />
      <span className="text-xs text-neutral-500">Section Beta: Octagonal Vestibule</span>
    </div>
  );
}

export function EmptyStateLiveDemo() {
  return (
    <div className="w-full max-w-md">
      <EmptyState
        title="No Spatial Telemetry Recorded"
        description="Connect sensors at the Darvazeh portal to start collecting ambient vestibule readings."
        action={<Button size="sm">Connect Sensors</Button>}
      />
    </div>
  );
}

export function KbdLiveDemo() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-600 dark:text-neutral-400">Launch command menu:</span>
      <div className="flex items-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </div>
    </div>
  );
}

export function LinkLiveDemo() {
  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/docs/getting-started/installation">Installation Guide</Link>
      <Link href="https://github.com/raminrez/hashti" target="_blank">
        GitHub Source &rarr;
      </Link>
    </div>
  );
}

export function ToolbarLiveDemo() {
  return (
    <Toolbar
      aria-label="Editor Actions"
      className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
    >
      <Button size="sm" variant="ghost">
        Bold
      </Button>
      <Button size="sm" variant="ghost">
        Italic
      </Button>
      <Button size="sm" variant="ghost">
        Underline
      </Button>
      <Divider orientation="vertical" className="h-5 my-auto mx-1" />
      <Button size="sm" variant="secondary">
        Publish
      </Button>
    </Toolbar>
  );
}

export function ContentSwitcherLiveDemo() {
  const [selected, setSelected] = useState("preview");
  return (
    <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
      <button
        type="button"
        onClick={() => setSelected("preview")}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
          selected === "preview"
            ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
        }`}
      >
        Live Preview
      </button>
      <button
        type="button"
        onClick={() => setSelected("code")}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
          selected === "code"
            ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
        }`}
      >
        Source Code
      </button>
    </div>
  );
}
