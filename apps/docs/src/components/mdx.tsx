import defaultMdxComponents from "fumadocs-ui/mdx";
import { DocsBody } from "fumadocs-ui/layouts/docs/page";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "./preview";
import { BrandbookAssets } from "./brandbook/BrandbookAssets";
import * as Demos from "./demos";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ComponentPreview,
    BrandbookAssets,
    ...Demos,
    pre: (props: any) => {
      // In Astro MDX compilation, code blocks are passed as an outer <pre> wrapping
      // an inner <pre className="language-...">. If we wrap both, Fumadocs produces
      // a duplicate nested <figure> with two copy buttons. Unwrap the outer one:
      if (!props.className && props.children?.type) {
        return props.children;
      }
      return defaultMdxComponents.pre ? defaultMdxComponents.pre(props) : <pre {...props} />;
    },
    ...components,
  } satisfies MDXComponents;
}

export default getMDXComponents({ wrapper: DocsBody });
