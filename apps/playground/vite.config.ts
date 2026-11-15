import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Workspace packages are symlinked twice (app and library). One copy of the
  // registry, or the bridge sees an empty page.
  resolve: { dedupe: ['@hashti/agent'] },
})