# @hashti/styles

Universal, framework-agnostic CSS styles for Hashti.

Provides component stylesheets, theme contracts (`frame`, `relay`), and CSS cascade layers that work identically across React, Vue, Svelte, Solid, and Web Components.

## Usage

```css
@import "@hashti/styles";
```

Or import specific layers:

```css
@import "@hashti/styles/layers.css";
@import "@hashti/styles/frame.css";
```

When using with Tailwind CSS:

```css
@layer ui-sdk, hashti;
@import "tailwindcss";
@import "@hashti/styles" layer(components);
```
