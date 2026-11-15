import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ui-sdk/core/web.css'
import '@hashti/tokens/tokens.css'
import '@hashti/react/styles.css'
import './index.css'
import App from './App.tsx'
import Compare from './Compare.tsx'
import { createAgent, registerTools } from '@hashti/agent'

declare global {
  interface Window {
    agent: ReturnType<typeof createAgent>
  }
}

const allow = (request: { action: string; label?: string; component: string }) =>
  window.confirm(`Run ${request.action} on ${request.label ?? request.component}?`)

window.agent = createAgent({ allow })

// Look for them in a browser with WebMCP: --enable-features=WebMCP
registerTools(window.agent, { allow })

const compare = new URLSearchParams(location.search).has("compare")

createRoot(document.getElementById('root')!).render(
  <StrictMode>{compare ? <Compare /> : <App />}</StrictMode>,
)