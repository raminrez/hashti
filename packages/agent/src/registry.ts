export type SurfaceMark = {
  confirm?: string;
  secret?: boolean;
  hidden?: boolean;
};

/** Who changed a component, and a way for the app to refuse the change. */
export type ChangeSource = "user" | "agent";

export type ChangeDetails = {
  source: ChangeSource;
  reason?: string;
  cancel: () => void;
};

export type SurfaceAction = (args: unknown[]) => unknown;

export interface SurfaceInput {
  component: string;
  label?: string;
  value?: unknown;
  actions?: Record<string, SurfaceAction>;
  items?: { value: string; label: string }[];
  mark?: SurfaceMark;
}

export interface Surface extends SurfaceInput {
  ref: string;
}

export type AgentStep = { ref?: string; action: string; args?: unknown[] };

export type AgentRequest = {
  ref: string;
  component: string;
  label?: string;
  action: string;
  args: unknown[];
  confirm?: string;
};

export type Allow = (request: AgentRequest) => boolean | Promise<boolean>;

const surfaces = new Map<string, Surface>();
let nextRef = 0;

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const wordsOf = (text: string) =>
  normalize(text)
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))
    .filter(Boolean);

export function registerSurface(input: SurfaceInput) {
  const ref = `c${++nextRef}`;
  surfaces.set(ref, { ...input, ref });

  return {
    ref,
    update(next: Partial<SurfaceInput>) {
      const previous = surfaces.get(ref);
      if (previous) surfaces.set(ref, { ...previous, ...next, ref });
    },
    dispose() {
      surfaces.delete(ref);
    },
  };
}

export function clearSurfaces() {
  surfaces.clear();
  nextRef = 0;
}

const publicValue = (surface: Surface) =>
  surface.mark?.secret ? "[redacted]" : surface.value;

export function snapshot() {
  return [...surfaces.values()]
    .filter((surface) => !surface.mark?.hidden)
    .map((surface) => ({
      ref: surface.ref,
      component: surface.component,
      label: surface.label,
      value: publicValue(surface),
      actions: Object.keys(surface.actions ?? {}),
      ...(surface.items && surface.items.length <= 10 ? { items: surface.items } : {}),
      ...(surface.mark?.confirm ? { confirm: surface.mark.confirm } : {}),
    }));
}

function find(step: AgentStep) {
  if (!step.ref) {
    return undefined;
  }

  // An exact ref reaches a hidden surface; a label never does.
  if (surfaces.has(step.ref)) {
    return surfaces.get(step.ref);
  }

  const words = wordsOf(step.ref);
  const candidates = [...surfaces.values()].filter(
    (surface) => !surface.mark?.hidden && surface.label,
  );

  const exact = candidates.filter(
    (surface) => wordsOf(surface.label!).join(" ") === words.join(" "),
  );
  if (exact.length === 1) return exact[0];

  const partial = candidates.filter((surface) => {
    const tokens = wordsOf(surface.label!);
    return words.every((word) => tokens.includes(word));
  });

  return partial.length === 1 ? partial[0] : undefined;
}

function itemValue(surface: Surface, named: unknown) {
  if (!surface.items?.length || typeof named !== "string") {
    return named;
  }

  const wanted = normalize(named);
  return (
    surface.items.find((item) => normalize(item.label) === wanted)?.value ?? named
  );
}

export async function act({
  steps,
  allow,
}: {
  steps: AgentStep[];
  allow?: Allow;
}) {
  const ran: Record<string, unknown>[] = [];

  for (const step of steps) {
    const target = find(step);

    if (!target) {
      return { ok: false, error: `No component "${step.ref}" on the page.`, steps: ran };
    }

    const action = target.actions?.[step.action];

    if (!action) {
      const offered = Object.keys(target.actions ?? {}).join(", ") || "nothing";
      return {
        ok: false,
        error: `${target.component} ${target.ref} takes no ${step.action}. It takes: ${offered}.`,
        steps: ran,
      };
    }

    const request: AgentRequest = {
      ref: target.ref,
      component: target.component,
      label: target.label,
      action: step.action,
      args: (step.args ?? []).map((arg) => itemValue(target, arg)),
      ...(target.mark?.confirm ? { confirm: target.mark.confirm } : {}),
    };

    if (request.confirm && !allow) {
      return {
        ok: false,
        error: `Needs a person: "${request.confirm}".`,
        steps: ran,
      };
    }

    if (allow && !(await allow(request))) {
      return {
        ok: false,
        error: `The person said no to "${request.confirm ?? step.action}".`,
        steps: ran,
      };
    }

    let value: unknown;
    try {
      value = await action(request.args);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, error: `${step.action} failed: ${message}.`, steps: ran };
    }

    ran.push({ ref: target.ref, action: step.action, value });
  }

  return { ok: true, steps: ran, values: snapshot() };
}

export function query({ within, text }: { within?: string; text?: string }) {
  const target = within ? find({ ref: within, action: "" }) : undefined;

  if (!target) {
    return { error: `No component "${within}" on the page.` };
  }

  if (!target.items) {
    return { ref: target.ref, items: [], more: 0 };
  }

  const wanted = text ? normalize(text) : "";
  const items = target.items.filter((item) =>
    normalize(item.label).includes(wanted),
  );

  return {
    ref: target.ref,
    items: items.slice(0, 50),
    more: Math.max(0, items.length - 50),
  };
}

export function createAgent(options: { allow?: Allow } = {}) {
  return {
    snapshot,
    query,
    act: (input: { steps: AgentStep[] }, allow?: Allow) =>
      act({ steps: input.steps, allow: allow ?? options.allow }),
  };
}