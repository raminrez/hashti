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
    // "A hex in component CSS is a bug" — values come from tokens.
    "color-no-hex": true,
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
