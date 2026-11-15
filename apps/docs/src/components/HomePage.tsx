"use client";

import { useEffect, useState } from "react";
import {
  Button,
  CodeSnippet,
  ContentSwitcher,
  Header,
  HeaderName,
  HeaderNav,
  Layer,
  Link,
  Stack,
  StructuredList,
  StructuredListRow,
  TextField,
  Theme,
  ToggleButton,
} from "@hashti/react";

type FrameTheme = "frame-light" | "frame-dark";

const NAV = [
  { href: "/docs", label: "Documentation" },
  { href: "/docs/components/button", label: "Components" },
  { href: "/docs/foundations/brandbook", label: "Brandbook" },
  { href: "/docs/getting-started/theming", label: "Themes" },
];

// The vestibule is a sequence, so the page uses an ordered list rather than four cards.
const TRANSITION = [
  {
    name: "Darvazeh",
    persian: "دروازه",
    body: "A pointed arch marks the boundary. A command states what it will do before the system does it.",
  },
  {
    name: "Hashti",
    persian: "هشتی",
    body: "The octagonal room where light settles and attention re-forms. Overlays, focus containment, and quiet state live here.",
  },
  {
    name: "Dalan",
    persian: "دالان",
    body: "A bent corridor that refuses a straight line of sight. Depth in the system is a passage, never a drop shadow.",
  },
  {
    name: "Hayati",
    persian: "حیاطی",
    body: "The courtyard, where the work actually happens. Calm surfaces, honest contrast, and room to stay.",
  },
];

const FOUNDATIONS: Array<[string, string]> = [
  ["Behaviour", "React Aria Components: roving tab index, typeahead, screen-reader semantics."],
  ["Composition", "Trigger, value, and popover stay separate parts instead of one prop matrix."],
  ["Contrast", "Essential controls hold 4.5:1, body text 7:1, in every shipped theme."],
  ["Tokens", "Layered CSS custom properties. No style engine, no hashing, no hydration cost."],
  ["Focus", "A two-pixel ring outside the control, keyboard only, never animated."],
  ["Longevity", "Apache 2.0, one stylesheet, no runtime dependency on the theme package."],
];

const QUICKSTART = `bun add @hashti/react @hashti/tokens react-aria-components

import "@hashti/tokens/tokens.css";
import "@hashti/react/styles.css";

import { Theme, Button } from "@hashti/react";

export function Threshold() {
  return (
    <Theme theme="frame-light">
      <Button variant="primary" onPress={openPortal}>
        Enter portal
      </Button>
    </Theme>
  );
}`;

export function HomePage() {
  const [pageTheme, setPageTheme] = useState<FrameTheme>("frame-light");
  const [demoTheme, setDemoTheme] = useState<FrameTheme>("frame-light");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setPageTheme(root.classList.contains("dark") ? "frame-dark" : "frame-light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Theme theme={pageTheme} className="home">
      <Header className="home-header">
        <HeaderName href="/" className="home-brand">
          Hashti
        </HeaderName>
        <HeaderNav aria-label="Main" className="home-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </HeaderNav>
      </Header>

      <main className="home-main">
        <section className="home-threshold">
          <Stack gap={6} className="home-threshold-copy">
            <h1 className="home-title">
              A design system built as a vestibule between the street and the courtyard.
            </h1>
            <p className="home-lede">
              Hashti is named for the octagonal room where a visitor leaves the noise behind. The
              components carry that pause: clear labels, quiet surfaces, and state you can trust.
            </p>
            <div className="home-actions">
              <a className="hashti-button" data-variant="primary" href="/docs/components/button">
                Explore components
              </a>
              <Link href="/docs/getting-started/installation">Install in three steps</Link>
            </div>
          </Stack>

          <Layer level={1} className="home-live">
            <div className="home-live-head">
              <h2 className="home-live-title">Change the room, not the code</h2>
              <ContentSwitcher
                aria-label="Preview theme"
                size="sm"
                selectedKeys={[demoTheme]}
                onSelectionChange={(keys) => {
                  const next = [...keys][0];
                  if (next === "frame-light" || next === "frame-dark") setDemoTheme(next);
                }}
              >
                <ToggleButton id="frame-light">Light</ToggleButton>
                <ToggleButton id="frame-dark">Dark</ToggleButton>
              </ContentSwitcher>
            </div>

            <Theme theme={demoTheme} className="home-live-stage">
              <div className="home-live-card">
                <Stack gap={4}>
                  <TextField
                    label="Workspace name"
                    description="Used in the address bar of every preview."
                    placeholder="Octagon Studio"
                  />
                  <div className="home-live-row">
                    <Button variant="primary" size="md">
                      Create workspace
                    </Button>
                    <Button variant="ghost" size="md">
                      Cancel
                    </Button>
                  </div>
                </Stack>
              </div>
            </Theme>
          </Layer>
        </section>

        <section className="home-proof" aria-label="What is measured">
          {[
            ["44px", "minimum control height"],
            ["4.5:1", "contrast, both themes"],
            ["1", "stylesheet, no runtime"],
            ["326", "stories swept every release"],
          ].map(([value, label]) => (
            <p key={label} className="home-proof-item">
              <span className="home-proof-value">{value}</span>
              <span className="home-proof-label">{label}</span>
            </p>
          ))}
        </section>

        <section className="home-section" aria-labelledby="transition-heading">
          <Stack gap={3}>
            <h2 id="transition-heading" className="home-section-title">
              Four rooms, one crossing
            </h2>
            <p className="home-section-lede">
              Persian houses never moved a guest in a straight line. The same sequence organises
              this library: an announcement, a settling room, a corridor, and the courtyard beyond.
            </p>
          </Stack>

          <ol className="home-sequence">
            {TRANSITION.map((room, index) => (
              <li key={room.name} className="home-sequence-item">
                <span className="home-room-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="home-room-head">
                  <h3 className="home-room-name">{room.name}</h3>
                  <span className="home-room" lang="fa" dir="rtl">
                    {room.persian}
                  </span>
                </span>
                <p className="home-room-body">{room.body}</p>
              </li>
            ))}
          </ol>

          <Link href="/docs/foundations/philosophy">Read the architectural notes</Link>
        </section>

        <section className="home-section" aria-labelledby="foundations-heading">
          <div className="home-split">
            <Stack gap={3}>
              <h2 id="foundations-heading" className="home-section-title">
                What the system promises
              </h2>
              <p className="home-section-lede">
                Every promise here is measured in the rendered browser, not asserted in a README.
                The same checks gate each release.
              </p>
            </Stack>
            <StructuredList>
              {FOUNDATIONS.map(([label, value]) => (
                <StructuredListRow key={label} label={label} value={value} />
              ))}
            </StructuredList>
          </div>
        </section>

        <section className="home-section" aria-labelledby="start-heading">
          <Stack gap={3}>
            <h2 id="start-heading" className="home-section-title">
              Start at the threshold
            </h2>
            <p className="home-section-lede">
              One stylesheet import, one theme boundary, then compose. Nothing is fetched at runtime
              and no provider configures a stylesheet.
            </p>
          </Stack>
          <CodeSnippet language="tsx" label="Quickstart">
            {QUICKSTART}
          </CodeSnippet>
          <Link href="/docs/getting-started/installation">Full installation guide</Link>
        </section>
      </main>

      <footer className="home-footer">
        <p className="home-footer-name">Hashti</p>
        <div className="home-footer-links">
          <Link href="/docs">Documentation</Link>
          <Link href="/docs/components/button">Components</Link>
          <a className="hashti-link" href="https://github.com/raminrez/hashti">
            GitHub
          </a>
          <span className="home-footer-note">Apache 2.0</span>
        </div>
      </footer>

      <style>{`
        .home {
          background: var(--hashti-background);
          color: var(--hashti-text-primary);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .home-header {
          position: sticky;
          inset-block-start: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: var(--hashti-spacing-05);
          padding-inline: clamp(var(--hashti-spacing-05), 4vw, var(--hashti-spacing-08));
          min-height: 3.5rem;
          background: var(--hashti-layer);
          border-block-end: 1px solid var(--hashti-border-subtle);
        }
        .home-brand {
          font-weight: 600;
          letter-spacing: -0.02em;
          font-size: var(--hashti-body-02-font-size);
        }
        .home-nav {
          flex: 1;
          justify-content: flex-end;
          display: none;
        }
        .home-nav a {
          color: var(--hashti-text-secondary);
        }
        .home-nav a:hover,
        .home-nav a:focus-visible {
          color: var(--hashti-text-primary);
        }
        @media (min-width: 60rem) {
          .home-nav {
            display: flex;
          }
        }
        .home-main {
          width: min(68rem, 100%);
          margin-inline: auto;
          padding-inline: clamp(var(--hashti-spacing-05), 4vw, var(--hashti-spacing-08));
          flex: 1;
        }
        .home-threshold {
          display: grid;
          gap: clamp(var(--hashti-spacing-06), 5vw, var(--hashti-spacing-10, 4rem));
          align-items: start;
          padding-block: clamp(var(--hashti-spacing-08), 7vw, 5.5rem) clamp(var(--hashti-spacing-08), 6vw, 4.5rem);
        }
        @media (min-width: 60rem) {
          .home-threshold {
            grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          }
        }
        .home-title {
          font-size: var(--hashti-headline-font-size);
          font-weight: var(--hashti-headline-font-weight);
          line-height: var(--hashti-headline-line-height);
          letter-spacing: var(--hashti-headline-letter-spacing);
          max-width: 22ch;
          margin: 0;
          text-wrap: balance;
        }
        .home-lede,
        .home-section-lede,
        .home-room-body {
          font-size: var(--hashti-body-02-font-size);
          line-height: 1.55;
          color: var(--hashti-text-secondary);
          margin: 0;
          max-width: 42ch;
        }
        .home-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hashti-spacing-04);
        }
        .home-live {
          padding: var(--hashti-spacing-04);
          border-radius: var(--hashti-group-radius);
          background: var(--hashti-layer-02);
          display: flex;
          flex-direction: column;
          gap: var(--hashti-spacing-04);
        }
        .home-live-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--hashti-spacing-03);
        }
        .home-live-title {
          font-size: var(--hashti-label-01-font-size);
          font-weight: 600;
          margin: 0;
        }
        /* Two surfaces, not three: the specimen sits directly on the panel. */
        .home-live-stage {
          padding: 0;
          border-radius: var(--hashti-group-radius);
          background: transparent;
        }
        /* The specimen is a window, not a card: one hairline, no shadow, no second radius. */
        .home-live-card {
          background: var(--hashti-layer);
          border: 1px solid var(--hashti-border-subtle);
          border-radius: var(--hashti-control-radius);
          padding: var(--hashti-spacing-05);
        }
        .home-proof {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0;
          margin: 0;
          border-block-start: 1px solid var(--hashti-border-subtle);
          border-block-end: 1px solid var(--hashti-border-subtle);
        }
        @media (min-width: 48rem) {
          .home-proof {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .home-proof-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin: 0;
          padding: var(--hashti-spacing-04) var(--hashti-spacing-04) var(--hashti-spacing-04) 0;
        }
        .home-proof-item + .home-proof-item {
          border-inline-start: 1px solid var(--hashti-border-subtle);
          padding-inline-start: var(--hashti-spacing-04);
        }
        .home-proof-value {
          font-size: var(--hashti-subheading-03-font-size, 1.5rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }
        .home-proof-label {
          font-size: var(--hashti-helper-text-01-font-size);
          color: var(--hashti-text-secondary);
        }
        /* The theme swap is a state change on screen: crossfade the ink instead of snapping. */
        .home-live-stage,
        .home-live-stage * {
          transition:
            background-color 180ms ease,
            border-color 180ms ease,
            color 180ms ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .home-live-stage,
          .home-live-stage * {
            transition: none;
          }
        }
        .home-live-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hashti-spacing-02);
        }
        .home-section {
          padding-block: clamp(var(--hashti-spacing-08), 6vw, 4.5rem);
          border-block-start: 1px solid var(--hashti-border-subtle);
          display: flex;
          flex-direction: column;
          gap: var(--hashti-spacing-05);
        }
        .home-section-title {
          font-size: var(--hashti-heading-03-font-size);
          font-weight: 600;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .home-sequence {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0;
          border-block-start: 1px solid var(--hashti-border-subtle);
        }
        @media (min-width: 60rem) {
          .home-sequence {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .home-sequence-item {
          padding: clamp(var(--hashti-spacing-04), 2.2vw, var(--hashti-spacing-06));
          display: flex;
          flex-direction: column;
          gap: var(--hashti-spacing-02);
        }
        .home-sequence-item + .home-sequence-item {
          border-block-start: 1px solid var(--hashti-border-subtle);
        }
        @media (min-width: 60rem) {
          .home-sequence-item + .home-sequence-item {
            border-block-start: 0;
            border-inline-start: 1px solid var(--hashti-border-subtle);
          }
        }
        .home-room-index {
          font-size: var(--hashti-helper-text-01-font-size);
          font-variant-numeric: tabular-nums;
          color: var(--hashti-text-secondary);
          letter-spacing: 0.08em;
        }
        .home-room {
          font-size: var(--hashti-heading-03-font-size);
          line-height: var(--hashti-heading-03-line-height);
          color: var(--hashti-text-placeholder);
        }
        .home-room-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--hashti-spacing-03);
        }
        .home-room-name {
          font-size: var(--hashti-body-01-font-size);
          font-weight: 600;
          margin: 0;
        }
        .home-room-body {
          font-size: var(--hashti-body-compact-01-font-size);
          max-width: none;
        }
        .home-split {
          display: grid;
          gap: clamp(var(--hashti-spacing-05), 4vw, var(--hashti-spacing-08));
          align-items: start;
        }
        @media (min-width: 60rem) {
          .home-split {
            grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          }
        }
        .home-footer {
          border-block-start: 1px solid var(--hashti-border-subtle);
          padding-block: clamp(var(--hashti-spacing-07), 5vw, var(--hashti-spacing-09));
          padding-inline: clamp(var(--hashti-spacing-05), 4vw, var(--hashti-spacing-08));
          display: flex;
          flex-wrap: wrap;
          align-items: end;
          justify-content: space-between;
          gap: var(--hashti-spacing-04);
        }
        .home-footer-name {
          font-size: var(--hashti-headline-font-size);
          font-weight: var(--hashti-headline-font-weight);
          letter-spacing: var(--hashti-headline-letter-spacing);
          margin: 0;
        }
        .home-footer-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hashti-spacing-04);
          font-size: var(--hashti-helper-text-01-font-size);
        }
        .home-footer-note {
          color: var(--hashti-text-secondary);
        }
        /* WCAG 2.5.8: standalone text links need a 24px hit area. */
        .home-nav a,
        .home-footer-links a,
        .home-main a:not(.hashti-button) {
          display: inline-flex;
          align-items: center;
          min-height: 1.5rem;
        }
        .home ::selection {
          background: var(--hashti-highlight);
          color: var(--hashti-text-primary);
        }
      `}</style>
    </Theme>
  );
}
