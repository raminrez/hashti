"use client";

// ui-sdk renders a `display: contents` wrapper with the preference attributes
// on it, so this cycle adds no class and no stylesheet.
export { Preferences, usePreference } from "@ui-sdk/react/preferences";
// The creators live in @ui-sdk/core; Hashti re-exports them so consumers need
// only one import.
export {
  createCookieStorage,
  createLocalStorage,
  createPreference,
  createSessionStorage,
} from "@ui-sdk/core";
