import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import {
  foundations,
  isThemeName,
  nextLayer,
  themeNames,
  themes,
  token,
  typeStyles,
  type ThemeToken,
} from "@hashti/tokens";

const root = resolve(import.meta.dir, "../..");

// Resolve the pinned upstreams from the workspace that owns them. This also works
// with Bun's isolated linker; the test does not rely on accidentally hoisted deps.
const upstream = createRequire(new URL("../../packages/tokens/package.json", import.meta.url));
const carbon = upstream("@carbon/themes");
const layout = upstream("@carbon/layout");
const typography = upstream("@carbon/type");
const motion = upstream("@carbon/motion");

describe("Carbon token parity", () => {
  const semantic = {
    background: "background",
    "layer-01": "layer01",
    "layer-02": "layer02",
    "layer-03": "layer03",
    "field-01": "field01",
    "field-02": "field02",
    "field-03": "field03",
    "text-primary": "textPrimary",
    "text-secondary": "textSecondary",
    "text-error": "textError",
    "border-strong-01": "borderStrong01",
    focus: "focus",
    "focus-inset": "focusInset",
    interactive: "interactive",
    "support-success": "supportSuccess",
    "support-error": "supportError",
  } as const;

  for (const theme of ["white", "g10", "g90", "g100"] as const) {
    test(`${theme} preserves semantic and component colors from the official packages`, () => {
      for (const [name, original] of Object.entries(semantic)) {
        expect(themes[theme][name as keyof typeof semantic]).toBe(carbon.themes[theme][original]);
      }
      const upstreamTheme = theme === "white" ? "whiteTheme" : theme;
      expect(themes[theme]["button-primary"]).toBe(
        carbon.buttonTokens.buttonPrimary[upstreamTheme],
      );
      expect(themes[theme]["tag-background-green"]).toBe(
        carbon.tagTokens.tagBackgroundGreen[upstreamTheme],
      );
      expect(themes[theme]["notification-background-error"]).toBe(
        carbon.notificationTokens.notificationBackgroundError[upstreamTheme],
      );
      expect(Object.keys(themes[theme])).toEqual(Object.keys(themes.white));
      if (theme === "g90" || theme === "g100") {
        expect(themes[theme]["status-orange-outline"]).toBe(
          carbon.statusTokens.statusOrange[theme],
        );
        expect(themes[theme]["status-yellow-outline"]).toBe(
          carbon.statusTokens.statusYellow[theme],
        );
        expect(themes[theme]["notification-action-hover"]).toBe("var(--hashti-layer-hover)");
      }
    });
  }

  test("spacing, type, control geometry, and motion retain their upstream values", () => {
    expect(foundations["spacing-01"]).toBe(layout.spacing01);
    expect(foundations["spacing-05"]).toBe(layout.spacing05);
    expect(foundations["spacing-13"]).toBe(layout.spacing13);
    expect(foundations["size-sm"]).toBe(layout.sizeSm);
    expect(foundations["size-md"]).toBe(layout.sizeMd);
    expect(foundations["size-lg"]).toBe(layout.sizeLg);
    expect(foundations["body-01-font-size"]).toBe(typography.body01.fontSize);
    expect(foundations["label-01-line-height"]).toBe(typography.label01.lineHeight);
    expect(foundations["ease-entrance-productive"]).toBe(motion.easings.entrance.productive);
  });

  // Frame times motion on the Astryx ladder, not Carbon's 70ms first step.
  test("the duration ladder is 130/175/230/310/410/730", () => {
    expect([
      foundations["duration-fast-01"],
      foundations["duration-fast-02"],
      foundations["duration-moderate-01"],
      foundations["duration-moderate-02"],
      foundations["duration-slow-01"],
      foundations["duration-slow-02"],
    ]).toEqual(["130ms", "175ms", "230ms", "310ms", "410ms", "730ms"]);
  });

  test("every literal Cinder CSS variable reference has a definition", async () => {
    const paths = ["packages/tokens/src", "packages/react/src", "apps/docs/src"].flatMap(
      (directory) =>
        [...new Bun.Glob("**/*.css").scanSync(resolve(root, directory))].map((path) =>
          resolve(root, directory, path),
        ),
    );
    const css = (await Promise.all(paths.map((path) => Bun.file(resolve(root, path)).text()))).join(
      "\n",
    );
    const defined = new Set([...css.matchAll(/(--hashti-[\w-]+)\s*:/g)].map((match) => match[1]));
    const referenced = new Set(
      [...css.matchAll(/var\((--hashti-[\w-]+)/g)].map((match) => match[1]),
    );
    expect([...referenced].filter((name) => !defined.has(name))).toEqual([]);
  });

  test("compact type and expressive breakpoint definitions survive token serialization", () => {
    expect(typeStyles["heading-compact-01"]).toEqual(typography.headingCompact01);
    expect(typeStyles["heading-compact-02"]).toEqual(typography.headingCompact02);
    expect(typeStyles["fluid-heading-05"]).toEqual(typography.fluidHeading05);
    expect(typeStyles["fluid-display-04"]).toEqual(typography.fluidDisplay04);
    expect(typeStyles["display-04"]).toEqual(typography.display04);
    expect(foundations["heading-compact-01-line-height"]).toBe(
      typography.headingCompact01.lineHeight,
    );
    expect(foundations["label-01-letter-spacing"]).toBe("0.32px");
    expect(foundations["helper-text-01-letter-spacing"]).toBe("0.32px");
  });
});

test("theme names are validated and nested layers saturate at Carbon's third level", () => {
  expect(themeNames.filter(isThemeName)).toEqual([
    "white",
    "g10",
    "g90",
    "g100",
    "relay-light",
    "relay-dark",
    "frame-light",
    "frame-dark",
  ]);
  expect(Object.keys(themes)).toEqual([...themeNames]);
  for (const value of [
    null,
    undefined,
    {},
    "dark",
    "White",
    "frame",
    "Frame-light",
    "frame-dark ",
    10,
  ])
    expect(isThemeName(value)).toBe(false);
  expect([nextLayer(0), nextLayer(1), nextLayer(2)]).toEqual([1, 2, 2]);
  expect(token("background")).toBe("var(--hashti-background)");
  expect(token("control-radius")).toBe("var(--hashti-control-radius)");
  // This is a theme key only in Frame; Relay-only or intersection inference loses it.
  const frameFoundation: ThemeToken = "font-sans";
  expect(token(frameFoundation)).toBe("var(--hashti-font-sans)");
});

function luminance(hex: string) {
  const rgb = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = rgb.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}

function contrast(foreground: string, background: string) {
  const pair = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (pair[0]! + 0.05) / (pair[1]! + 0.05);
}

for (const name of ["relay-light", "relay-dark"] as const) {
  test(`${name} defines the complete semantic contract and readable control colors`, () => {
    const values = themes[name];
    for (const key of Object.keys(themes.white)) expect(values).toHaveProperty(key);
    expect(Object.keys(values)).toEqual(Object.keys(themes["relay-light"]));
    for (const [foreground, background] of [
      ["text-primary", "background"],
      ["text-secondary", "background"],
      ["text-placeholder", "field-01"],
      ["text-helper", "field-01"],
      ["text-error", "background"],
      ["text-primary", "button-secondary"],
      ["text-primary", "button-secondary-hover"],
      ["text-primary", "button-secondary-active"],
      ["text-on-color", "button-primary"],
      ["text-on-color", "button-primary-hover"],
      ["text-on-color", "button-primary-active"],
      ["text-on-color", "button-danger-primary"],
      ["text-on-color", "button-danger-hover"],
      ["text-on-color", "button-danger-active"],
    ] as const) {
      const pair = [luminance(values[foreground]), luminance(values[background])].sort(
        (a, b) => b - a,
      );
      expect(
        (pair[0]! + 0.05) / (pair[1]! + 0.05),
        `${name}: ${foreground} on ${background}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
    for (const background of ["background", "field-01", "layer-03"] as const) {
      const pair = [luminance(values.focus), luminance(values[background])].sort((a, b) => b - a);
      expect(
        (pair[0]! + 0.05) / (pair[1]! + 0.05),
        `${name}: focus on ${background}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });
}

// Captured before Frame on 2026-11-06. Keep these in the test: .research is ignored.
const legacyThemeHashes = {
  white: "2da0a89bcf5e61c22138b799fb251f168cbcce827092fcc9d11076a440068ce4",
  g10: "caaedda053a013a035279504d19b2d2ded882a6dd227dcc377f13b9fff7358ca",
  g90: "8687b59352b591e2724004924140993ec1e47b7ab26d5f46b932223a57ceb80b",
  g100: "469dd5f7b97371adccb2d537abad52a6fbc1b3a35e4134933e9f2eb78ded0f98",
  "relay-light": "675b3d964c278b9634c6fce656ec4fe547aa026b832516ef857aabc2afc9b0ef",
  "relay-dark": "46d63a66c60b7f7822ec05c439d6e1861a8a2209eb234fd81a95f9939167dd15",
};

function sorted(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sorted);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([name, child]) => [name, sorted(child)]),
    );
  }
  return value;
}

function hash(value: unknown) {
  return createHash("sha256")
    .update(JSON.stringify(sorted(value)))
    .digest("hex");
}

test("all legacy theme values, foundations, and structured type definitions remain unchanged", () => {
  expect(
    Object.fromEntries(
      Object.entries(themes)
        .filter(([name]) => Object.hasOwn(legacyThemeHashes, name))
        .map(([name, values]) => [name, hash(values)]),
    ),
  ).toEqual(legacyThemeHashes);
  expect(hash(foundations)).toBe(
    "14eb58e4ce4b0a38a93818c2be442cced510c96daa2d28d566a7a8236f4c64e5",
  );
  expect(hash(typeStyles)).toBe("c53c5406bad7a0d70e0f434b805d6fb4d771dfe04d1395c9dea558565e2c734c");
});

const frameCases = [
  [
    "frame-light",
    {
      "color-scheme": "light",
      background: "#f5f6f8",
      "layer-01": "#ffffff",
      "layer-02": "#eef1f6",
      "text-primary": "#25272c",
      "text-secondary": "#606674",
      "border-subtle-00": "#dde1e8",
      "border-strong-01": "#7f8795",
      "button-primary": "#272a32",
      "button-primary-hover": "#434754",
      "button-primary-active": "#555b6b",
      "button-secondary": "#eef1f6",
      "button-secondary-hover": "#dde1e8",
      "button-secondary-active": "#cbd2dc",
      "button-tertiary": "#7f8795",
      "button-tertiary-hover": "#eef1f6",
      "button-tertiary-active": "#dde1e8",
      "text-on-color": "#ffffff",
      focus: "#365ccb",
      "layer-selected-01": "#e7edff",
      "support-info": "#365ccb",
      "notification-background-info": "#edf2ff",
      "support-error": "#aa2735",
      "notification-background-error": "#ffe8eb",
      "support-warning": "#75500d",
      "notification-background-warning": "#fff0ce",
      "support-success": "#246343",
      "notification-background-success": "#e1f2e8",
      "button-danger-hover": "#91212d",
      "button-danger-active": "#771b25",
    },
  ],
  [
    "frame-dark",
    {
      "color-scheme": "dark",
      background: "#18191d",
      "layer-01": "#22242a",
      "layer-02": "#2c2f38",
      "text-primary": "#f1f2f6",
      "text-secondary": "#b1b6c3",
      "border-subtle-00": "#3e424d",
      "border-strong-01": "#7d8493",
      "button-primary": "#f1f2f6",
      "button-primary-hover": "#d2d7e4",
      "button-primary-active": "#b6bfd2",
      "button-secondary": "#2c2f38",
      "button-secondary-hover": "#3e424d",
      "button-secondary-active": "#515765",
      "button-tertiary": "#7d8493",
      "button-tertiary-hover": "#2c2f38",
      "button-tertiary-active": "#3e424d",
      "text-on-color": "#22242a",
      focus: "#a9bdff",
      "layer-selected-01": "#333f62",
      "support-info": "#a9bdff",
      "notification-background-info": "#2c354e",
      "support-error": "#ffacb3",
      "notification-background-error": "#452830",
      "support-warning": "#e7c383",
      "notification-background-warning": "#3e3321",
      "support-success": "#a4d9b8",
      "notification-background-success": "#203a2b",
      "button-danger-hover": "#ffb8be",
      "button-danger-active": "#ffc5ca",
    },
  ],
] as const;

for (const [name, expected] of frameCases) {
  test(`${name} covers every legacy semantic role and maps the measured Frame palette`, () => {
    const values = themes[name];
    for (const key of Object.keys(themes.white)) expect(values).toHaveProperty(key);
    expect(Object.keys(values)).toEqual(Object.keys(themes["frame-light"]));
    expect(Object.keys(values)).toHaveLength(351);
    expect(values).toMatchObject(expected);
    expect(values["button-tertiary"]).toBe(values["border-strong-01"]);
    expect(values["button-tertiary-hover"]).toBe(values["layer-02"]);
    expect(values["button-tertiary-active"]).toBe(values["border-subtle-00"]);
    expect(values["background-active"]).toBe(values["border-subtle-00"]);
    for (const role of ["button-primary", "button-secondary", "button-tertiary", "background"]) {
      expect(values[`${role}-active` as keyof typeof values]).not.toBe(
        values[`${role}-hover` as keyof typeof values],
      );
    }
    expect(values["button-danger-primary"]).toBe(values["support-error"]);
    expect(values["button-danger-secondary"]).toBe(values["support-error"]);
    expect(values["text-error"]).toBe(values["support-error"]);
    expect(values.interactive).toBe(values.focus);
    expect(values["border-interactive"]).toBe(values.focus);
    expect(values["link-primary"]).toBe(values.focus);
    expect(values["text-helper"]).toBe(values["text-secondary"]);
    expect(values["text-placeholder"]).toBe(values["text-secondary"]);
    expect(values["text-disabled"]).toBe(values["border-strong-01"]);
    expect(values["button-disabled"]).toBe(values["layer-02"]);
    expect(values["border-disabled"]).toBe(values["border-subtle-00"]);
    expect(values["layer-background-01"]).toBe(values.background);
    expect(values["layer-background-02"]).toBe(values["layer-01"]);
    expect(values["layer-background-03"]).toBe(values["layer-02"]);
    expect(values["layer-03"]).toBe(values["layer-02"]);
    for (const level of [1, 2, 3] as const) {
      expect(values[`field-0${level}`]).toBe(values["layer-01"]);
      expect(values[`field-hover-0${level}`]).toBe(values["layer-02"]);
      expect(values[`layer-selected-0${level}`]).toBe(values["layer-selected-01"]);
      expect(values[`border-strong-0${level}`]).toBe(values["border-strong-01"]);
      expect(values[`border-subtle-selected-0${level}`]).toBe(values.focus);
    }
    expect(values.overlay).toBe("rgb(18 22 32 / 50%)");
    expect(values.shadow).toBe("rgb(0 0 0 / 14%)");
  });

  test(`${name} keeps text, status pairs, danger feedback, focus, and boundaries distinguishable`, () => {
    const values = themes[name];
    for (const [foreground, background] of [
      ["text-primary", "background"],
      ["text-primary", "layer-01"],
      ["text-primary", "layer-03"],
      ["text-secondary", "background"],
      ["text-secondary", "layer-03"],
      ["text-placeholder", "field-01"],
      ["text-helper", "field-01"],
      ["text-error", "background"],
      ["text-error", "notification-background-error"],
      ["text-primary", "button-secondary"],
      ["text-primary", "button-secondary-hover"],
      ["text-primary", "button-secondary-active"],
      ["text-primary", "button-tertiary-hover"],
      ["text-primary", "button-tertiary-active"],
      ["text-primary", "background-hover"],
      ["text-primary", "background-active"],
      ["text-primary", "layer-selected-01"],
      ["text-secondary", "layer-selected-01"],
      ["link-primary", "background"],
      ["link-primary", "layer-selected-01"],
      ["text-on-color", "button-primary"],
      ["text-on-color", "button-primary-hover"],
      ["text-on-color", "button-primary-active"],
      ["text-on-color", "button-danger-primary"],
      ["text-on-color", "button-danger-hover"],
      ["text-on-color", "button-danger-active"],
      ["text-on-color", "interactive"],
      ["support-error", "notification-background-error"],
      ["support-warning", "notification-background-warning"],
      ["support-success", "notification-background-success"],
      ["support-info", "notification-background-info"],
      ["text-inverse", "background-inverse"],
      ["link-inverse", "background-inverse"],
    ] as const) {
      expect(
        contrast(values[foreground], values[background]),
        `${name}: ${foreground} on ${background}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
    for (const background of [
      "background",
      "field-01",
      "layer-03",
      "layer-selected-01",
      "notification-background-error",
    ] as const) {
      expect(
        contrast(values.focus, values[background]),
        `${name}: focus on ${background}`,
      ).toBeGreaterThanOrEqual(3);
    }
    expect(contrast(values["border-strong-01"], values["field-01"])).toBeGreaterThanOrEqual(3);
  });
}

test("Frame's scalable working type and geometry use the approved existing roles", () => {
  for (const [name] of frameCases) {
    const values = themes[name];
    expect(values["font-sans"]).toBe(
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    );
    for (const [role, size, height, weight] of [
      ["body-01", 14, 21, 400],
      ["body-02", 16, 24, 400],
      ["body-compact-01", 14, 20, 500],
      ["label-01", 14, 20, 600],
      ["heading-03", 18, 25.2, 600],
    ] as const) {
      const fontSize = Number.parseFloat(values[`${role}-font-size`]) * 16;
      expect(fontSize).toBe(size);
      expect(fontSize * values[`${role}-line-height`]).toBeCloseTo(height, 5);
      expect(values[`${role}-font-weight`]).toBe(weight);
      expect(values[`${role}-letter-spacing`]).toBe(0);
    }
    expect(Number.parseFloat(values["helper-text-01-font-size"]) * 16).toBe(13);
    // Unlike a unitless ratio, this can also be used as min-block-size.
    expect(values["helper-text-01-line-height"]).toBe("1.25rem");
    expect(values["helper-text-01-letter-spacing"]).toBe(0);
    for (const [role, pixels] of [
      ["control-radius", 10],
      ["popover-radius", 18],
      ["overlay-radius", 18],
      ["size-md", 44],
    ] as const) {
      expect(values[role]).toEndWith("rem");
      expect(Number.parseFloat(values[role]) * 16).toBe(pixels);
    }
    expect(values["focus-width"]).toBe("2px");
    expect(values["focus-offset"]).toBe("2px");
  }
});

test("generated CSS layers every token and restores only Frame-owned foundations at legacy boundaries", async () => {
  const css = await Bun.file(resolve(root, "packages/tokens/src/tokens.css")).text();
  const layered = /^@layer hashti\.tokens \{([\s\S]*)\}$/.exec(
    css.replace(/\/\*[\s\S]*?\*\//g, "").trim(),
  );
  expect(layered).not.toBeNull();
  const content = layered![1]!;
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  const rules = [...content.matchAll(rulePattern)].map((match) => ({
    selector: match[1]!.trim(),
    values: Object.fromEntries(
      [...match[2]!.matchAll(/(--hashti-[\w-]+):\s*([^;]+);/g)].map((entry) => [
        entry[1]!,
        entry[2]!,
      ]),
    ),
  }));
  expect(content.replace(rulePattern, "").trim()).toBe("");
  const frame = ':where([data-hashti-theme="frame-light"], [data-hashti-theme="frame-dark"])';
  const legacy = `:where(${Object.keys(legacyThemeHashes)
    .map((name) => `[data-hashti-theme="${name}"]`)
    .join(", ")})`;
  const boundary = `${frame} ${legacy}`;
  const capture = `:root:not(${frame}),\n:root:not(${frame}) > body:not(${frame})`;
  const captured = rules.find(({ selector }) => selector === capture);
  const restored = rules.find(({ selector }) => selector === boundary);
  expect(captured).toBeDefined();
  expect(restored).toBeDefined();
  const frameFoundations = Object.keys(themes["frame-light"])
    .filter((name) => Object.hasOwn(foundations, name))
    .sort();
  expect(frameFoundations).toHaveLength(26);
  expect(Object.keys(restored!.values)).toEqual(frameFoundations.map((name) => `--hashti-${name}`));
  expect(Object.keys(captured!.values)).toEqual(
    frameFoundations.map((name) => `--hashti-internal-legacy-${name}`),
  );
  for (const [name, value] of Object.entries(foundations)) {
    const property = `--hashti-${name}`;
    const owners = rules.filter(({ values }) => Object.hasOwn(values, property));
    if (frameFoundations.includes(name)) {
      expect(owners.map(({ selector }) => selector)).toEqual([
        ":root",
        '[data-hashti-theme="frame-light"]',
        '[data-hashti-theme="frame-dark"]',
        boundary,
      ]);
      expect(captured!.values[`--hashti-internal-legacy-${name}`]).toBe(`var(${property})`);
      expect(restored!.values[property]).toBe(`var(--hashti-internal-legacy-${name}, ${value})`);
    } else {
      expect(owners.map(({ selector }) => selector)).toEqual([":root"]);
    }
  }
  for (const [selector, level] of [
    [':root, [data-hashti-theme], [data-hashti-layer="0"]', 0],
    ['[data-hashti-layer="1"]', 1],
    ['[data-hashti-layer="2"], [data-hashti-layer="3"]', 2],
  ] as const) {
    const aliases = rules.find((rule) => rule.selector === selector)!.values;
    expect(Object.keys(aliases)).toHaveLength(15);
    for (const [property, value] of Object.entries(aliases)) {
      expect(value).toBe(
        `var(${property}-0${level + (property === "--hashti-border-subtle" ? 0 : 1)})`,
      );
    }
  }
});

test("regeneration is byte-deterministic and agrees with the checked-in CSS and JSON", async () => {
  const paths = ["tokens.css", "tokens.json"].map((name) =>
    resolve(root, "packages/tokens/src", name),
  );
  const before = await Promise.all(paths.map((path) => Bun.file(path).text()));
  for (let run = 0; run < 2; run++) {
    const result = Bun.spawnSync([process.execPath, "packages/tokens/scripts/generate.ts"], {
      cwd: root,
    });
    expect(result.exitCode, result.stderr.toString()).toBe(0);
    expect(await Promise.all(paths.map((path) => Bun.file(path).text()))).toEqual(before);
  }
  expect(JSON.parse(before[1]!).themes).toEqual(themes);
});
