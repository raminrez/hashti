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
