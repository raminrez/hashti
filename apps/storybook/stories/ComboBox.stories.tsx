import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { ComboBox, Theme, useTheme, type ListData } from "@hashti/react";
import { http, HttpResponse } from "msw";
import "./fields.css";

const meta = {
  title: "Fields/ComboBox",
  component: ComboBox,
  parameters: {
    docs: {
      description: {
        component:
          "ComboBox combines a text input with a filterable popup listbox: type to search, pick from suggestions, or allow custom values. Built on `@ui-sdk/react/combobox` with Hashti's field anatomy.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const cloudServices: ListData<string> = [
  { value: "compute", label: "Compute Engine (VMs)" },
  { value: "k8s", label: "Kubernetes Engine (GKE)" },
  { value: "functions", label: "Cloud Functions (Serverless)" },
  { value: "storage", label: "Cloud Storage (Buckets)" },
  { value: "sql", label: "Cloud SQL (Managed Database)" },
  { value: "pubsub", label: "Cloud Pub/Sub (Messaging)" },
];

function PlaygroundExample() {
  const [selected, setSelected] = useState<string | null>("k8s");
  return (
    <div className="field-story-stack">
      <ComboBox
        label="Cloud infrastructure service"
        description="Select a managed service to provision in your target project."
        placeholder="Search services..."
        defaultQuery="Kubernetes Engine (GKE)"
        value={selected}
        onValueChange={(value) => setSelected(value)}
        items={cloudServices}
      />
    </div>
  );
}

function AsyncComboBoxExample() {
  const [services, setServices] = useState<ListData<string>>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/services", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ services: { id: string; name: string }[] }>;
      })
      .then((payload) => {
        setServices(payload.services.map((s) => ({ value: s.id, label: s.name })));
        setState("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("error");
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="field-story-stack">
      <ComboBox
        label="Service from the API"
        description={
          state === "loading"
            ? "Loading services from /api/services..."
            : state === "error"
              ? "The service catalog could not be loaded."
              : "Served by a mocked endpoint in this story."
        }
        status={state === "error" ? { type: "error", message: "Could not load services." } : undefined}
        placeholder={state === "loading" ? "Loading..." : "Search services..."}
        items={services}
        disabled={state !== "ready"}
      />
    </div>
  );
}

export const AsyncOptions: Story = {
  render: () => <AsyncComboBoxExample />,
  beforeEach({ msw }) {
    msw.use(
      http.get("/api/services", () =>
        HttpResponse.json({
          services: [
            { id: "vertex", name: "Vertex AI" },
            { id: "bigquery", name: "BigQuery" },
            { id: "spanner", name: "Cloud Spanner" },
          ],
        }),
      ),
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: /Service from the API/ });
    await waitFor(() => expect(input).not.toBeDisabled());
    await waitFor(() => expect(canvas.getByText(/mocked endpoint/)).toBeVisible());
  },
};

export const Playground: Story = {
  render: () => <PlaygroundExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole("combobox", { name: /Cloud infrastructure service/ });
    expect(input).toHaveValue("Kubernetes Engine (GKE)");

    const trigger = canvas.getByRole("button", { name: /Open items list/ });
    await userEvent.click(trigger);

    const functionsOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="combobox-item"][data-value="functions"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await waitFor(() => expect(functionsOption).toBeVisible());

    await userEvent.click(functionsOption);
    expect(input).toHaveValue("Cloud Functions (Serverless)");
  },
};

export const SizesAndStatus: Story = {
  render: () => (
    <div className="field-story-stack">
      <ComboBox size="sm" label="Small (sm) service" placeholder="Pick service..." items={cloudServices} />
      <ComboBox
        size="md"
        label="Medium (md - default) service"
        placeholder="Pick service..."
        items={cloudServices}
      />
      <ComboBox
        size="lg"
        label="Large (lg) service"
        status={{ type: "warning", message: "Service region has limited remaining quotas." }}
        placeholder="Pick service..."
        items={cloudServices}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const smInput = canvas.getByRole("combobox", { name: /Small \(sm\) service/ });
    const mdInput = canvas.getByRole("combobox", { name: /Medium \(md - default\) service/ });
    const lgInput = canvas.getByRole("combobox", { name: /Large \(lg\) service/ });

    await waitFor(() => expect(smInput).toBeVisible());
    await waitFor(() => expect(mdInput).toBeVisible());
    await waitFor(() => expect(lgInput).toBeVisible());
  },
};

const serviceGroups: ListData<string> = [
  {
    type: "group",
    label: "Compute & Containers",
    items: [
      { value: "gke", label: "Google Kubernetes Engine" },
      { value: "cloud-run", label: "Cloud Run" },
      { value: "compute-vm", label: "Compute Engine VMs" },
    ],
  },
  {
    type: "group",
    label: "Data & Storage",
    items: [
      { value: "cloud-sql", label: "Cloud SQL" },
      { value: "spanner", label: "Cloud Spanner" },
      { value: "firestore", label: "Cloud Firestore" },
    ],
  },
];

export const SectionsAndGroups: Story = {
  render: () => (
    <div className="field-story-stack">
      <ComboBox label="Service category" placeholder="Search categorized catalog..." items={serviceGroups} />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: /Open items list/ });
    await userEvent.click(trigger);

    const spannerOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="combobox-item"][data-value="spanner"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await waitFor(() => expect(spannerOption).toBeVisible());

    await userEvent.click(spannerOption);
    const input = canvas.getByRole("combobox", { name: /Service category/ });
    expect(input).toHaveValue("Cloud Spanner");
  },
};

export const AllowsCustomValue: Story = {
  render: () => (
    <div className="field-story-stack">
      <ComboBox
        label="Custom deployment tag"
        description="Pick an existing tag or type any custom semantic tag."
        placeholder="Type or select tag..."
        allowCustomValue
        items={[
          { value: "v1", label: "v1.0.0-release" },
          { value: "v2", label: "v2.0.0-beta" },
          { value: "latest", label: "latest-stable" },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole("combobox", { name: /Custom deployment tag/ });
    await userEvent.clear(input);
    await userEvent.type(input, "v3.1.4-custom");

    expect(input).toHaveValue("v3.1.4-custom");
  },
};

export const DisabledAndRequired: Story = {
  render: () => (
    <div className="field-story-stack">
      <ComboBox
        label="Cluster zone (Disabled)"
        defaultValue="us-central1-a"
        disabled
        items={[{ value: "us-central1-a", label: "us-central1-a" }]}
      />

      <ComboBox
        label="Mandatory cluster"
        required
        status={{ type: "error", message: "Please select a cluster zone before continuing." }}
        items={[{ value: "europe-west1", label: "europe-west1-b" }]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const disabledInput = canvas.getByRole("combobox", { name: /Cluster zone \(Disabled\)/ });
    expect(disabledInput).toBeDisabled();

    await waitFor(() =>
      expect(canvas.getByText("Please select a cluster zone before continuing.")).toBeInTheDocument(),
    );
  },
};

function LocalizedComboBox() {
  const { theme } = useTheme();
  return (
    <div className="field-story-stack">
      <Theme theme={theme} lang="fa-IR" dir="rtl">
        <div dir="rtl">
          <ComboBox
            label="ناحیه رایانش ابری"
            description="ناحیه سرورهای ابری را جهت بهینه‌سازی تاخیر انتخاب کنید."
            placeholder="جستجوی ناحیه..."
            defaultQuery="تهران (مرکز داده آسیاتک)"
            defaultValue="tehran"
            items={[
              { value: "tehran", label: "تهران (مرکز داده آسیاتک)" },
              { value: "shiraz", label: "شیراز (مرکز داده پارس)" },
              { value: "isfahan", label: "اصفهان (مرکز داده صفه)" },
              { value: "tabriz", label: "تبریز (مرکز داده سهند)" },
            ]}
          />
        </div>
      </Theme>
    </div>
  );
}

export const LongContentAndLocales: Story = {
  render: () => <LocalizedComboBox />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole("combobox", { name: /ناحیه رایانش ابری/ });
    expect(input).toHaveValue("تهران (مرکز داده آسیاتک)");

    const trigger = canvas.getByRole("button", { name: /Open items list/ });
    await userEvent.click(trigger);

    const shirazOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="combobox-item"][data-value="shiraz"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await waitFor(() => expect(shirazOption).toBeVisible());

    await userEvent.click(shirazOption);
    expect(input).toHaveValue("شیراز (مرکز داده پارس)");
  },
};

function DynamicItemCreationDemo() {
  const [items, setItems] = useState<ListData<string>>([
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
  ]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 360 }}>
      <ComboBox
        label="Project framework"
        placeholder="Search or create framework..."
        items={items}
        allowCreateItem
        onCreateItem={(query) => {
          const value = query.toLowerCase().replace(/\s+/g, "-");
          setItems((prev) => [...prev, { value, label: query }]);
          setSelected(value);
        }}
        value={selected}
        onValueChange={(value) => setSelected(value)}
      />
    </div>
  );
}

export const DynamicItemCreation: Story = {
  render: () => <DynamicItemCreationDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox", { name: "Project framework" });
    expect(input).toBeInTheDocument();
  },
};

function MultipleExample() {
  const [selected, setSelected] = useState<string[]>(["react"]);
  return (
    <div className="field-story-stack">
      <ComboBox
        label="Frameworks (chips)"
        multiple
        multipleDisplay="chips"
        placeholder="Add a framework..."
        value={selected}
        onValueChange={(value) => setSelected(value)}
        items={[
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
          { value: "svelte", label: "Svelte" },
          { value: "solid", label: "Solid" },
        ]}
      />
      <output aria-label="Selected frameworks">{selected.join(", ")}</output>
    </div>
  );
}

export const Multiple: Story = {
  render: () => <MultipleExample />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const output = canvas.getByRole("status", { name: "Selected frameworks" });
    await expect(output).toHaveTextContent("react");

    const input = canvas.getByRole("combobox", { name: /Frameworks \(chips\)/ });
    await userEvent.click(input);
    const vueOption = await waitFor(() => {
      const opt = document.querySelector<HTMLElement>('[data-slot="combobox-item"][data-value="vue"]');
      expect(opt).not.toBeNull();
      return opt!;
    });
    await userEvent.click(vueOption);

    await waitFor(async () => {
      await expect(output).toHaveTextContent("react, vue");
    });
  },
};
