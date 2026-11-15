# Hashti Design System — Fumadocs Astro Documentation Website

## Objective

Build a complete, high-performance documentation website for **Hashti Design System** (`hashti.raminrez.dev`) using **Fumadocs**, **Astro**, and **React**.

---

## 1. Official Documentation Reference & Prerequisites

- **Framework**: Astro (latest) + React (`@astrojs/react`, `react`, `react-dom`)
- **Fumadocs Packages**:
  ```sh
  bun add fumadocs-core fumadocs-ui @fumadocs/astro @astrojs/react react react-dom @types/mdx @tailwindcss/vite tailwindcss
  ```
- **Fumadocs Astro Guide**: `https://www.fumadocs.dev/docs/astro`
- **Manual Installation Guide**: `https://www.fumadocs.dev/docs/astro/manual-installation`

---

## 2. Configuration & Setup Architecture

### `astro.config.mjs`

```js
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import fumadocs from "@fumadocs/astro";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react(), fumadocs({ components: "./src/components/mdx.tsx" })],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### `src/styles/global.css`

```css
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";

/* Import Hashti tokens & component styles */
@import "@cinder/tokens/dist/tokens.css";
@import "@cinder/react/dist/styles.css";
```

### Content Collections (`src/content.config.ts`)

```ts
import { defineCollection } from "astro:content";
import { metaLoader, pageLoader } from "@fumadocs/astro/loaders";

export const collections = {
  docs: defineCollection({ loader: pageLoader() }),
  meta: defineCollection({ loader: metaLoader() }),
};
```

### Source Loader (`src/lib/source.ts`)

```ts
import { getCollection } from "astro:content";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "@fumadocs/astro/source";

export const source = loader({
  source: toFumadocsSource(await getCollection("docs"), await getCollection("meta")),
  baseUrl: "/docs",
});
```

### MDX Wrapper & React Islands

- `src/components/mdx.tsx`:
  ```tsx
  import defaultMdxComponents from "fumadocs-ui/mdx";
  import { DocsBody } from "fumadocs-ui/layouts/docs/page";
  import type { MDXComponents } from "mdx/types";

  export function getMDXComponents(components?: MDXComponents) {
    return {
      ...defaultMdxComponents,
      ...components,
    } satisfies MDXComponents;
  }

  export default getMDXComponents({ wrapper: DocsBody });
  ```
- `src/components/provider.tsx`:
  ```tsx
  import { navigate } from "astro:transitions/client";
  import type { ReactNode } from "react";
  import { RootProvider } from "fumadocs-ui/provider/astro";
  import SearchDialog from "@/components/search";

  export function Provider({ pathname, params, children }: any) {
    return (
      <RootProvider
        pathname={pathname}
        params={params}
        navigate={navigate}
        search={{ SearchDialog }}
      >
        {children}
      </RootProvider>
    );
  }
  ```
- `src/components/search.tsx`:
  ```tsx
  import {
    SearchDialog,
    SearchDialogClose,
    SearchDialogContent,
    SearchDialogHeader,
    SearchDialogIcon,
    SearchDialogInput,
    SearchDialogList,
    SearchDialogOverlay,
  } from "fumadocs-ui/components/dialog/search";
  import { useStaticSearch } from "fumadocs-core/search/client";

  export default function DefaultSearchDialog(props: any) {
    const search = useStaticSearch();
    return (
      <SearchDialog {...search} {...props}>
        <SearchDialogOverlay />
        <SearchDialogContent>
          <SearchDialogHeader>
            <SearchDialogIcon />
            <SearchDialogInput />
            <SearchDialogClose />
          </SearchDialogHeader>
          <SearchDialogList />
        </SearchDialogContent>
      </SearchDialog>
    );
  }
  ```
- `src/components/docs.tsx`:
  ```tsx
  import { useFumadocsLoader } from "fumadocs-core/source/client";
  import { DocsLayout } from "fumadocs-ui/layouts/docs";
  import { DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
  import { Provider } from "@/components/provider";
  import { baseOptions } from "@/lib/layout.shared";

  export function Docs({ tree, title, description, toc, children, ...props }: any) {
    const data = useFumadocsLoader({ tree });
    return (
      <Provider {...props}>
        <DocsLayout {...baseOptions()} tree={data.tree}>
          <DocsPage toc={toc}>
            <DocsTitle>{title}</DocsTitle>
            <DocsDescription>{description}</DocsDescription>
            {children}
          </DocsPage>
        </DocsLayout>
      </Provider>
    );
  }
  ```
- `src/lib/layout.shared.tsx`:
  ```tsx
  import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

  export function baseOptions(): BaseLayoutProps {
    return {
      nav: {
        title: "Hashti Design System",
      },
      links: [
        { text: "Documentation", url: "/docs" },
        { text: "Components", url: "/docs/components" },
        { text: "Brandbook", url: "https://hashti.raminrez.dev/hashti-brandbook.html" },
        { text: "GitHub", url: "https://github.com/raminrez/hashti" },
      ],
    };
  }
  ```
- `src/layouts/Layout.astro`:
  ```astro
  ---
  import { ClientRouter } from 'astro:transitions';
  import '@/styles/global.css';

  const { title, description } = Astro.props;
  ---
  <html lang="en" transition:animate="none">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <ClientRouter />
    </head>
    <body class="flex flex-col min-h-screen">
      <slot />
    </body>
  </html>
  ```
- `src/pages/docs/[...slug].astro`:
  ```astro
  ---
  import Layout from '@/layouts/Layout.astro';
  import { Docs } from '@/components/docs';
  import { source } from '@/lib/source';

  export const prerender = true;

  export const getStaticPaths = (() => {
    return source.getPages().map((page) => ({
      params: { slug: decodeURI(page.slugs.join('/')) || undefined },
      props: { page },
    }));
  });

  const { page } = Astro.props;
  const { body: Content, toc } = await page.data.load();
  const pageTree = await source.serializePageTree(source.getPageTree());
  ---
  <Layout title={page.data.title} description={page.data.description}>
    <Docs
      client:load
      transition:persist="docs"
      pathname={Astro.url.pathname}
      params={Astro.params}
      tree={pageTree}
      title={page.data.title}
      description={page.data.description}
      toc={toc}
    >
      <Content />
    </Docs>
  </Layout>
  ```
- `src/pages/api/search.ts`:
  ```ts
  import type { APIRoute } from "astro";
  import { createFromSource } from "fumadocs-core/search/server";
  import { source } from "@/lib/source";

  const server = createFromSource(source, { language: "english" });
  export const GET: APIRoute = () => server.staticGET();
  ```

---

## 3. Documentation Structure to Generate (`content/docs/`)

- `content/docs/meta.json` (ordering of top-level sections)
- `content/docs/index.mdx`: Introduction, Persian architectural philosophy of Hashti, core values (Accessible, Elegant, Open Source, International)
- `content/docs/getting-started/`:
  - `installation.mdx` (Bun/NPM installation of `@cinder/react` & `@cinder/tokens`)
  - `theming.mdx` (The 8 supported themes: Carbon 4 themes, Relay themes, Frame themes, theme attributes `data-hashti-theme`)
  - `accessibility.mdx` (Keyboard navigation, ARIA landmarks, WCAG 2.1 compliance)
- `content/docs/foundations/`:
  - `colors.mdx` (Black `#000000`, White `#FFFFFF`, Turquoise `#0D9488`, Amber `#D97706`, Terracotta `#DC2626`)
  - `typography.mdx` (Satoshi, Vazirmatn for Persian/RTL, JetBrains Mono)
  - `spacing-geometry.mdx` (Density scales, 32px/40px/48px geometry)
  - `brandbook.mdx` (Embed/link to interactive brandbook at `hashti.raminrez.dev`)
- `content/docs/components/`:
  - Component pages with interactive examples, prop definitions, and usage:
    - **Buttons & Actions**: `button.mdx`, `link.mdx`
    - **Selection Controls**: `checkbox.mdx`, `radio.mdx`, `switch.mdx`
    - **Forms & Inputs**: `text-field.mdx`, `number-field.mdx`, `search-field.mdx`, `select.mdx`, `combobox.mdx`, `date-picker.mdx`, `input-otp.mdx`
    - **Overlays**: `modal.mdx`, `dialog.mdx`, `popover.mdx`, `tooltip.mdx`, `drawer.mdx`, `alert-dialog.mdx`
    - **Feedback**: `badge.mdx`, `tag.mdx`, `alert.mdx`, `inline-notification.mdx`, `toast.mdx`, `progress-bar.mdx`, `progress-circle.mdx`, `ai-label.mdx`
    - **Navigation & Collections**: `tabs.mdx`, `breadcrumbs.mdx`, `table.mdx`, `pagination.mdx`, `accordion.mdx`, `content-switcher.mdx`, `table-batch-actions.mdx`, `structured-list.mdx`
    - **Containers & Content**: `card.mdx`, `code-snippet.mdx`, `tile.mdx`, `divider.mdx`, `empty-state.mdx`, `avatar.mdx`, `kbd.mdx`
- `content/docs/roadmap/`:
  - `rac-expansion.mdx` (Integration of `docs/rac-component-expansion-plan.md` covering Phase 3, 4, 5 RAC primitives)

---

## 4. Execution Workflow

1. Initialize the Astro app in `apps/docs-astro/` (or root as desired).
2. Configure Astro, Fumadocs, Tailwind 4, and content collections.
3. Launch parallel subagents to generate all MDX documentation content across foundations and component categories.
4. Verify build with `bun run build`.
5. Commit each step to branch `feat/hashti-docs-astro-fumadocs`.
