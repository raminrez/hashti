import data from "./tokens.json";

/**
 * The pruned pipeline (TICK-000b) ships one Hashti theme in light and dark modes.
 * The generated CSS still answers to the frame-light/frame-dark aliases; both names
 * stay valid here until the Theme ticket (TICK-012) settles the vocabulary.
 */
export const themeNames = ["light", "dark", "frame-light", "frame-dark"] as const;
export type ThemeName = (typeof themeNames)[number];
export type LayerLevel = 0 | 1 | 2;
export const themes = data.themes;
export const foundations = data.global;
export const breakpoints = data.breakpoints;
export const typeStyles = data.typeStyles;
export type TypeStyleName = keyof typeof typeStyles;
export type ThemeToken = {
  [Name in keyof typeof themes]: keyof (typeof themes)[Name];
}[keyof typeof themes];
export type FoundationToken = keyof typeof foundations;
export type TokenName = ThemeToken | FoundationToken;

/** A semantic CSS reference that follows the nearest Theme and Layer. */
export function token(name: TokenName): `var(--hashti-${TokenName})` {
  return `var(--hashti-${name})`;
}

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === "string" && themeNames.some((theme) => theme === value);
}

/** Three contextual layer levels; deeper nesting saturates at the third. */
export function nextLayer(level: LayerLevel): LayerLevel {
  return level === 0 ? 1 : 2;
}
