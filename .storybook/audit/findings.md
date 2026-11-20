# Audit findings

- 2026-11-20 · sb-inventory: 65 real / 3 dead (all 3 are non-components: MDX renderer, Astro content config, OG image route); dominant design system css-vars; 535 tokens declared, 103 used, 432 orphan; 61 own components need stories. Detector patched locally to count MDX/Astro importers and scanned design/ + packages/styles/ so token counts are real.
