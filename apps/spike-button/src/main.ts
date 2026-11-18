import "@ui-sdk/web/button";

const variants = ["primary", "secondary", "danger", "ghost", "outline"] as const;

// A pending promise the capture script can hold open and release deterministically.
let releasePending: (() => void) | null = null;
(window as unknown as { __releasePending: () => void }).__releasePending = () => {
  releasePending?.();
  releasePending = null;
};
const heldPromise = () =>
  new Promise<void>((resolve) => {
    releasePending = resolve;
  });

function uiButton({
  variant,
  size,
  iconOnly,
  disabled,
  label,
  holdsPending,
  id,
}: {
  variant?: string;
  size?: string;
  iconOnly?: boolean;
  disabled?: boolean;
  label?: string;
  id?: string;
}) {
  const wrapper = document.createElement("ui-button");
  if (disabled) wrapper.setAttribute("disabled", "");
  wrapper.setAttribute("pending-announcement", "Saving changes");
  const button = document.createElement("button");
  button.className = "hashti-button";
  if (variant) button.setAttribute("data-variant", variant);
  // @hashti/react Button defaults size to "lg" when the prop is omitted (and marks it
  // with data-hashti-size-default); the web mirror emits the same attributes.
  button.setAttribute("data-size", size ?? "lg");
  if (!size) button.setAttribute("data-hashti-size-default", "");
  if (iconOnly) button.setAttribute("data-icon-only", "");
  if (id) button.id = id;
  if (iconOnly) {
    button.setAttribute("aria-label", "Copy workspace link");
    button.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M10 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5zM9 2l4 4H9z"/></svg>`;
  } else {
    button.textContent = label ?? "Save changes";
  }
  wrapper.appendChild(button);
  wrapper.addEventListener("action", (event) => {
    const detail = (event as CustomEvent).detail as {
      waitUntil: (promise: Promise<unknown>) => void;
    };
    // Match the React side: the press handler inserts the spinner while pending and
    // removes it when the promise settles.
    const spinner = document.createElement("span");
    spinner.className = "hashti-spinner";
    spinner.setAttribute("aria-hidden", "true");
    requestAnimationFrame(() => {
      if (button.hasAttribute("data-pending") && !spinner.isConnected)
        button.appendChild(spinner);
    });
    const cleanup = () => spinner.remove();
    if (holdsPending) {
      detail.waitUntil(heldPromise().finally(cleanup));
    } else {
      detail.waitUntil(new Promise((resolve) => setTimeout(resolve, 1200)).finally(cleanup));
    }
  });
  return wrapper;
}

const variantsGrid = document.getElementById("variants")!;
for (const variant of variants) {
  variantsGrid.appendChild(
    uiButton({
      variant,
      label: variant === "danger" ? "Delete draft" : "Save changes",
    }),
  );
}

const sizesGrid = document.getElementById("sizes")!;
for (const size of ["sm", "md", "lg"] as const) {
  sizesGrid.appendChild(uiButton({ variant: "primary", size }));
}
// The fourth cell mirrors the React page's explicit secondary/md button.
sizesGrid.appendChild(uiButton({ variant: "secondary", size: "md" }));

const statesGrid = document.getElementById("states")!;
statesGrid.appendChild(uiButton({ variant: "primary", id: "spike-hover", label: "Hover me" }));
statesGrid.appendChild(uiButton({ variant: "primary", id: "spike-active", label: "Press me" }));
for (const variant of variants) {
  statesGrid.appendChild(
    uiButton({
      variant,
      disabled: true,
      label: variant === "danger" ? "Delete draft" : "Save changes",
    }),
  );
}
statesGrid.appendChild(
  uiButton({
    variant: "primary",
    holdsPending: true,
    id: "spike-pending",
    label: "Save draft",
  }),
);
statesGrid.appendChild(uiButton({ variant: "ghost", iconOnly: true }));

const fa = document.getElementById("rtl-fa")!;
fa.appendChild(uiButton({ variant: "primary", label: "ذخیرهٔ تغییرات تنظیمات فضای کاری" }));
const ar = document.getElementById("rtl-ar")!;
ar.appendChild(uiButton({ variant: "primary", label: "حفظ تغييرات إعدادات مساحة العمل" }));

// Signal for the capture script.
document.body.setAttribute("data-spike", "ready");
