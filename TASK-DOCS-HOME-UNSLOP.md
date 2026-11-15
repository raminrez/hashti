# Task: Build Hashti Docs Home Page & Apply Vercel Writing Guidelines (Unslop)

## Goal

1. Replace the plain redirect in `apps/docs/src/pages/index.astro` with a stunning, production-grade landing page for Hashti Design System (`hashti.raminrez.dev`), inspired by HeroUI and React Aria Components docs.
2. Review and unslop all documentation pages in `apps/docs/src/content/docs/` using the Vercel Writing Guidelines (`writing-guidelines`).
3. Purge all remaining references to Carbon and Cinder from the documentation.

---

## 1. Home Page for Hashti Docs (`apps/docs/src/pages/index.astro`)

Build a beautiful, responsive landing page using Astro, Tailwind CSS, and interactive React demo components:

- **Hero Section**:
  - Badge: `هشتی Hashti v1.0 • React Aria Components 1.22.1 + HeroUI v3 Architecture`
  - Headline: **The Architectural Portal Design System for Modern React Applications.**
  - Subtitle: Inspired by the transitional geometry of Iranian vestibules (_Hashti_). Uncompromising accessibility, zero-runtime tokens, and compound composition ergonomics.
  - Call to Action: "Explore Components" (links to `/docs/components/button`) + "GitHub" link + Copyable command: `bun add @hashti/react @hashti/tokens`
- **Interactive Component Stage (Hero Showcase)**:
  - An interactive preview canvas on the home page featuring live Hashti components:
    - Button variants with tactile spring presses
    - Multi-select with interactive chips & remove buttons
    - ColorPicker 2D saturation/brightness canvas
    - Quick-launcher Command Palette ⌘K preview
    - Sheet bottom drawer with gesture snap points
    - TokenField for AI prompts with live chip serialization
- **Architectural Philosophy Section (The Hashti Transition)**:
  - Explain the Iranian architectural concept:
    - _Darvazeh_ (The Portal Threshold)
    - _Hashti_ (The Octagonal Transitional Vestibule)
    - _Dalan_ (The Indirect Corridors)
    - _Hayati_ (The Inner Courtyard Sanctuary)
  - Visualizing the concentric vaulted arches and pure `#000000` / `#FFFFFF` monochrome palette with Persian turquoise, amber, and terracotta glazes.
- **Features Grid**:
  - **React Aria Components 1.22.1**: WAI-ARIA compliant, full keyboard roving tabindex, screen reader certified.
  - **Compound Ergonomics**: `<Select.Trigger>`, `<Select.Value>`, `<Select.Popover>` — composition over prop-drilling.
  - **8 Themes (WCAG AA Certified)**: Light and dark palettes strictly verified for $\ge 4.5:1$ contrast ratio.
  - **Modular Scoped Styling**: Scoped CSS per component with zero runtime overhead.
- **Getting Started Code Block**:
  - 3-step installation and basic setup snippet with copy button.

---

## 2. Apply Vercel Writing Guidelines (Unslop) Across All Docs

Follow the Vercel Writing Guidelines strictly:

- **Active Voice**: "You configure", "You import", never "The user can configure" or "One can".
- **Banned Words**: Remove "easy", "simple", "quick", "very", "just", "really". Replace with concrete descriptions ("one command", "default settings").
- **Remove AI Tells**:
  - NO summary-style transitions ("With this setup complete...", "Now that we have explored...").
  - NO robotic spec-sheet voice ("provides", "is explicitly configured").
  - Target sentences under 20 words.
  - Direct imperative steps ("Install the package", "Import the component").
- **Page Structure**:
  - TL;DR opening paragraph at the top of each page.
  - Clear section headings (Sentence case).
  - Concrete API tables:
    - Props (name, type, default, description)
    - Keyboard Interactions (Key, Action)
    - WAI-ARIA & Data Attributes (`[data-hovered]`, `[data-focused]`, `[data-pressed]`, `[data-selected]`, `[data-disabled]`)
- **Total Carbon & Cinder Purge**:
  - Remove all mentions of Carbon and Cinder. All packages are `@hashti/react` and `@hashti/tokens`.

---

## 3. Verification Gates

1. `bun run build:docs` must build all pages with 0 errors.
2. Commit with descriptive semantic commit messages (`feat(docs): build Hashti homepage and unslop documentation`).
