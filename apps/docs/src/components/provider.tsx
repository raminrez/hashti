import { navigate } from "astro:transitions/client";
import { RootProvider } from "fumadocs-ui/provider/astro";
import SearchDialog from "@/components/search";

export function Provider({ pathname, params, children }: any) {
  return (
    <RootProvider pathname={pathname} params={params} navigate={navigate} search={{ SearchDialog }}>
      {children}
    </RootProvider>
  );
}
