import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "react-aria-components";
import { expect, waitFor, within } from "storybook/test";
import { ComboBox, ListBoxItem, ListBoxSection, Theme, useTheme, type Key } from "@hashti/react";
import { http, HttpResponse } from "msw";
import "./fields.css";

const meta = {
  title: "Fields/ComboBox",
  component: ComboBox,
  parameters: {
    docs: {
      description: {
        component:
          "ComboBox combines a text input with a filterable popover listbox, allowing users to search, filter, and pick from suggested options or optionally enter custom values.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const cloudServices = [
  { id: "compute", name: "Compute Engine (VMs)" },
  { id: "k8s", name: "Kubernetes Engine (GKE)" },
  { id: "functions", name: "Cloud Functions (Serverless)" },
  { id: "storage", name: "Cloud Storage (Buckets)" },
  { id: "sql", name: "Cloud SQL (Managed Database)" },
  { id: "pubsub", name: "Cloud Pub/Sub (Messaging)" },
];

function PlaygroundExample() {
  const [selected, setSelected] = useState<Key | null>("k8s");
  return (
    <div className="field-story-stack">
      <ComboBox
        label="Cloud infrastructure service"
        description="Select a managed service to provision in your target project."
        placeholder="Search services..."
        defaultInputValue="Kubernetes Engine (GKE)"
        selectedKey={selected}
        onSelectionChange={setSelected}
        items={cloudServices}
      >
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>
    </div>
  );
}

interface Service {
  id: string;
  name: string;
}

function AsyncComboBoxExample() {
  const [services, setServices] = useState<Service[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/services", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ services: Service[] }>;
      })
      .then((payload) => {
        setServices(payload.services);
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
        isInvalid={state === "error"}
        placeholder={state === "loading" ? "Loading..." : "Search services..."}
        items={services}
        isDisabled={state !== "ready"}
      >
        {(item: Service) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>
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

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });

    const functionsOption = await within(popover).findByRole("option", {
      name: /Cloud Functions/,
    });
    await waitFor(() => expect(functionsOption).toBeVisible());

    await userEvent.click(functionsOption);
    expect(input).toHaveValue("Cloud Functions (Serverless)");
  },
};

export const SizesAndStatus: Story = {
  render: () => (
    <div className="field-story-stack">
      <ComboBox
        size="sm"
        label="Small (sm) service"
        placeholder="Pick service..."
        items={cloudServices}
      >
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>

      <ComboBox
        size="md"
        label="Medium (md - default) service"
        placeholder="Pick service..."
        items={cloudServices}
      >
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>

      <ComboBox
        size="lg"
        label="Large (lg) service"
        status={{ type: "warning", message: "Service region has limited remaining quotas." }}
        placeholder="Pick service..."
        items={cloudServices}
      >
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>
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

const serviceGroups = [
  {
    id: "compute-grp",
    title: "Compute & Containers",
    items: [
      { id: "gke", name: "Google Kubernetes Engine" },
      { id: "cloud-run", name: "Cloud Run" },
      { id: "compute-vm", name: "Compute Engine VMs" },
    ],
  },
  {
    id: "data-grp",
    title: "Data & Storage",
    items: [
      { id: "cloud-sql", name: "Cloud SQL" },
      { id: "spanner", name: "Cloud Spanner" },
      { id: "firestore", name: "Cloud Firestore" },
    ],
  },
];

export const SectionsAndGroups: Story = {
  render: () => (
    <div className="field-story-stack">
      <ComboBox label="Service category" placeholder="Search categorized catalog...">
        {serviceGroups.map((grp) => (
          <ListBoxSection key={grp.id} id={grp.id}>
            <Header className="hashti-select-section-header">{grp.title}</Header>
            {grp.items.map((it) => (
              <ListBoxItem key={it.id} id={it.id} textValue={it.name}>
                {it.name}
              </ListBoxItem>
            ))}
          </ListBoxSection>
        ))}
      </ComboBox>
    </div>
  ),
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: /Open items list/ });
    await userEvent.click(trigger);

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });

    const spannerOption = await within(popover).findByRole("option", {
      name: "Cloud Spanner",
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
        allowsCustomValue
        items={[
          { id: "v1", name: "v1.0.0-release" },
          { id: "v2", name: "v2.0.0-beta" },
          { id: "latest", name: "latest-stable" },
        ]}
      >
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>
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

export const DisabledAndInvalid: Story = {
  render: () => (
    <div className="field-story-stack">
      <ComboBox
        label="Cluster zone (Disabled)"
        defaultValue="us-central1-a"
        isDisabled
        items={[{ id: "us-central1-a", name: "us-central1-a" }]}
      >
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>

      <ComboBox
        label="Mandatory cluster"
        isRequired
        isInvalid
        errorMessage="Please select a cluster zone before continuing."
        items={[{ id: "europe-west1", name: "europe-west1-b" }]}
      >
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const disabledInput = canvas.getByRole("combobox", { name: /Cluster zone \(Disabled\)/ });
    expect(disabledInput).toBeDisabled();

    await waitFor(() =>
      expect(canvas.getByText("Please select a cluster zone before continuing.")).toBeVisible(),
    );
  },
};

function LocalizedComboBox() {
  const { theme } = useTheme();
  return (
    <div className="field-story-stack">
      <Theme theme={theme} locale="fa-IR">
        <div dir="rtl">
          <ComboBox
            label="ناحیه رایانش ابری"
            description="ناحیه سرورهای ابری را جهت بهینه‌سازی تاخیر انتخاب کنید."
            placeholder="جستجوی ناحیه..."
            defaultInputValue="تهران (مرکز داده آسیاتک)"
            defaultSelectedKey="tehran"
            items={[
              { id: "tehran", name: "تهران (مرکز داده آسیاتک)" },
              { id: "shiraz", name: "شیراز (مرکز داده پارس)" },
              { id: "isfahan", name: "اصفهان (مرکز داده صفه)" },
              { id: "tabriz", name: "تبریز (مرکز داده سهند)" },
            ]}
          >
            {(item) => (
              <ListBoxItem id={item.id} textValue={item.name}>
                {item.name}
              </ListBoxItem>
            )}
          </ComboBox>
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

    const popover = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(".hashti-popover");
      expect(el).not.toBeNull();
      return el!;
    });

    const shirazOption = await within(popover).findByRole("option", {
      name: /شیراز/,
    });
    await waitFor(() => expect(shirazOption).toBeVisible());

    await userEvent.click(shirazOption);
    expect(input).toHaveValue("شیراز (مرکز داده پارس)");
  },
};

function DynamicItemCreationDemo() {
  const [items, setItems] = useState([
    { id: "react", name: "React" },
    { id: "vue", name: "Vue" },
    { id: "svelte", name: "Svelte" },
  ]);
  const [selected, setSelected] = useState<Key | null>(null);

  return (
    <div style={{ maxWidth: 360 }}>
      <ComboBox
        label="Project framework"
        placeholder="Search or create framework..."
        items={items}
        allowCreateItem={true}
        onCreateItem={(val) => {
          const newItem = { id: val.toLowerCase().replace(/\s+/g, "-"), name: val };
          setItems((prev) => [...prev, newItem]);
          setSelected(newItem.id);
        }}
        selectedKey={selected}
        onSelectionChange={setSelected}
      >
        {(item) => (
          <ListBoxItem id={item.id} textValue={item.name}>
            {item.name}
          </ListBoxItem>
        )}
      </ComboBox>
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
