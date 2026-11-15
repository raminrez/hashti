import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CodeSnippet, Theme, useTheme } from "@hashti/react";
import "./content.css";

const meta = {
  title: "Content/CodeSnippet",
  component: CodeSnippet,
  args: {
    children: "npm install @hashti/react",
  },
  parameters: {
    docs: {
      description: {
        component:
          "CodeSnippet displays syntax-styled code examples, terminal commands, or structured configurations with accessible copy-to-clipboard functionality and keyboard navigation.",
      },
    },
  },
} satisfies Meta<typeof CodeSnippet>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTypeScript = `import { Button, TextField } from "@hashti/react";

export function LoginForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField label="Work Email" type="email" isRequired />
      <Button type="submit" variant="primary">Continue</Button>
    </form>
  );
}`;

function PlaygroundExample() {
  return (
    <div className="content-story-stack">
      <div className="content-card">
        <div>
          <h3 className="content-card-title">Production React Component</h3>
          <p className="content-card-description">
            Inspect and copy the foundational form integration snippet.
          </p>
        </div>
        <CodeSnippet label="React login snippet" language="tsx" type="multi" copyable>
          {sampleTypeScript}
        </CodeSnippet>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pre = canvas.getByRole("generic", { name: "React login snippet" });
    expect(pre).toBeInTheDocument();
    expect(pre).toHaveTextContent('import { Button, TextField } from "@hashti/react";');

    const copyBtn = canvas.getByRole("button", { name: "Copy react login snippet" });
    expect(copyBtn).toBeInTheDocument();
    await userEvent.click(copyBtn);
    expect(await canvas.findByText(/copied|could not copy/i)).toBeInTheDocument();
  },
};

function SnippetTypesExample() {
  return (
    <div className="content-story-stack">
      {/* Single-line snippet */}
      <div className="content-card">
        <div>
          <h4 className="content-card-title">Single-line Terminal Command</h4>
          <p className="content-card-description">Quick command line invocation.</p>
        </div>
        <CodeSnippet label="Install package command" language="bash" type="single" copyable>
          bun add @hashti/react @hashti/tokens
        </CodeSnippet>
      </div>

      {/* Multi-line wrapped */}
      <div className="content-card">
        <div>
          <h4 className="content-card-title">Multi-line Configuration (Wrapped)</h4>
          <p className="content-card-description">Formatted JSON deployment spec.</p>
        </div>
        <CodeSnippet
          label="JSON cluster config"
          language="json"
          type="multi"
          wrapText
          maxHeight="8rem"
          copyable
        >
          {`{\n  "name": "hashti-edge-gateway",\n  "replicas": 4,\n  "regions": ["us-east", "eu-central", "ap-southeast"],\n  "monitoring": { "enabled": true, "sampleRate": 0.05 }\n}`}
        </CodeSnippet>
      </div>

      {/* Inline snippet */}
      <div className="content-card">
        <div>
          <h4 className="content-card-title">Inline Code Reference</h4>
          <p className="content-card-description">Embedded directly into descriptive prose.</p>
        </div>
        <p style={{ margin: 0, color: "var(--hashti-text-primary)", fontSize: "0.875rem" }}>
          To apply dark mode styling, set the property{" "}
          <CodeSnippet label="Theme attribute" type="inline" copyable={false}>
            data-hashti-theme="frame-dark"
          </CodeSnippet>{" "}
          on your application root element.
        </p>
      </div>
    </div>
  );
}

export const SnippetTypes: Story = {
  render: () => <SnippetTypesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const terminalSnippet = canvas.getByRole("generic", { name: "Install package command" });
    expect(terminalSnippet).toBeInTheDocument();
    expect(terminalSnippet).toHaveTextContent("bun add @hashti/react @hashti/tokens");

    const jsonSnippet = canvas.getByRole("generic", { name: "JSON cluster config" });
    expect(jsonSnippet).toBeInTheDocument();

    const inlineCode = canvas.getByText('data-hashti-theme="frame-dark"');
    expect(inlineCode).toBeInTheDocument();
  },
};

function LongContentAndLocalesExample() {
  const { theme } = useTheme();

  return (
    <div className="content-story-stack">
      {/* Long query with wrapping */}
      <div className="content-card">
        <div>
          <h4 className="content-card-title">Long SQL Analytical Query</h4>
          <p className="content-card-description">Complex query demonstrating scroll behavior.</p>
        </div>
        <CodeSnippet label="Telemetry query" language="sql" type="multi" maxHeight="6rem" copyable>
          {`SELECT service_id, cluster_zone, percentile_cont(0.99) WITHIN GROUP (ORDER BY latency_ms) AS p99_latency, count(*) AS total_requests FROM cluster_telemetry_events WHERE timestamp >= NOW() - INTERVAL '24 hours' AND status_code >= 400 GROUP BY service_id, cluster_zone HAVING count(*) > 100 ORDER BY p99_latency DESC;`}
        </CodeSnippet>
      </div>

      {/* Persian RTL notes */}
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl" className="content-card">
          <div>
            <h4 className="content-card-title">قطعه کد همراه با راهنمای فارسی</h4>
            <p className="content-card-description">
              نمایش دستورات نصب و راه‌اندازی در محیط راست‌به‌چپ
            </p>
          </div>
          <CodeSnippet label="دستور راه‌اندازی پروژه" language="bash" type="single" copyable>
            git clone https://github.com/cinder/cinder-design-system.git && cd cinder
          </CodeSnippet>
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LongContentAndLocalesExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Long SQL Analytical Query")).toBeInTheDocument();
    expect(canvas.getByText("قطعه کد همراه با راهنمای فارسی")).toBeInTheDocument();

    const faSnippet = canvas.getByRole("generic", { name: "دستور راه‌اندازی پروژه" });
    expect(faSnippet).toBeInTheDocument();
  },
};
