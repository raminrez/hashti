/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  // Scope: Hashti-owned component CSS. The token source (design/tokens.css)
  // legitimately carries raw colors and is not part of the linted glob.
  ignoreFiles: [
    "**/design/**",
    "**/.astro/**",
    "**/node_modules/**",
    "**/dist/**",
  ],
  rules: {
    // stylelint-config-standard defaults to import-notation: "url", whose
    // autofix rewrote @import "x.css" to @import url("x.css") in index.css —
    // Vite's postcss-import then dropped every hashti layer import in dev
    // (empty stylesheet, all components unstyled). String notation inlines
    // correctly, so pin it here.
    "import-notation": "string",
    // "A hex in component CSS is a bug" — values come from tokens.
    "color-no-hex": true,
    // Physical left/right breaks RTL; the 069 RTL audit found the codebase
    // already logical-property clean. Use margin-inline-*/padding-inline-*.
    "property-disallowed-list": [
      ["margin-left", "margin-right", "padding-left", "padding-right"],
      {
        message:
          'Physical "margin-left"/"margin-right"/"padding-left"/"padding-right" break RTL (the codebase is logical-property clean by audit). Use "margin-inline-start"/"margin-inline-end"/"padding-inline-start"/"padding-inline-end".',
      },
    ],
    // text-align: left/right are physical too; start/end respect direction.
    "declaration-property-value-disallowed-list": [
      { "text-align": ["/^(left|right)$/"] },
      {
        message:
          'Physical "text-align: left/right" breaks RTL. Use "text-align: start"/"text-align: end".',
      },
    ],
    // Styles bind via hashti-* classes and ui-sdk data attributes only —
    // never React DOM specifics like :has(react-…).
    "selector-disallowed-list": [
      "/:has\\([^)]*react/i",
      {
        message:
          'Styles must bind via "hashti-*" classes and ui-sdk data attributes only, not React DOM selectors.',
      },
    ],
    // Class contract: hashti-<block> / hashti-<block>__<element>.
    "selector-class-pattern": "^hashti-",
    "keyframes-name-pattern": "^hashti-",
    // Base rules are followed by data-attribute/variant rules on purpose;
    // specificity ordering is the cascade design, not an accident.
    "no-descending-specificity": null,
    // No custom-property-pattern rule: ui-sdk contract variables
    // (--anchor-width, --active-tab-*, --rating-fill, …) legitimately flow
    // through component CSS alongside --hashti-* tokens.
  },
};
