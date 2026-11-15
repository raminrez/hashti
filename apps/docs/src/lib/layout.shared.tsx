import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Hashti Design System",
    },
    githubUrl: "https://github.com/raminrez/hashti",
    links: [
      { text: "Documentation", url: "/docs" },
      { text: "Components", url: "/docs/components/button" },
      { text: "Brandbook", url: "/hashti-brandbook.html" },
    ],
  };
}
