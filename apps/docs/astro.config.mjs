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
