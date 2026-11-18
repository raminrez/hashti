import { createRoot } from "react-dom/client";
import { Button, type ButtonVariant } from "@hashti/react";

const variants = ["primary", "secondary", "danger", "ghost", "outline"] as const;

let releasePending: (() => void) | null = null;
(window as unknown as { __releasePending: () => void }).__releasePending = () => {
  releasePending?.();
  releasePending = null;
};
const heldPromise = () =>
  new Promise<void>((resolve) => {
    releasePending = resolve;
  });

const label = (variant: ButtonVariant) =>
  variant === "danger" ? "Delete draft" : "Save changes";

const icon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M10 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5zM9 2l4 4H9z" />
  </svg>
);

function App() {
  return (
    <>
      <div className="matrix">
        <span className="row-label">Variants (rest)</span>
        {variants.map((variant) => (
          <Button
            key={variant}
            variant={variant as ButtonVariant}
            pendingLabel="Saving changes"
            onClick={() => new Promise((resolve) => setTimeout(resolve, 1200))}
          >
            {label(variant)}
          </Button>
        ))}
      </div>

      <div className="matrix">
        <span className="row-label">Sizes</span>
        {(["sm", "md", "lg"] as const).map((size) => (
          <Button key={size} variant="primary" size={size}>
            Save changes
          </Button>
        ))}
        <Button variant="secondary" size="md">
          Save changes
        </Button>
      </div>

      <div className="matrix">
        <span className="row-label">States: hover / active / disabled / pending / iconOnly</span>
        <Button variant="primary" id="spike-hover">
          Hover me
        </Button>
        <Button variant="primary" id="spike-active">
          Press me
        </Button>
        {variants.map((variant) => (
          <Button key={variant} variant={variant as ButtonVariant} disabled>
            {label(variant)}
          </Button>
        ))}
        <Button
          variant="primary"
          id="spike-pending"
          pendingLabel="Saving draft"
          onClick={() => heldPromise()}
        >
          Save draft
        </Button>
        <Button variant="ghost" iconOnly aria-label="Copy workspace link">
          {icon}
        </Button>
      </div>

      <div className="rtl-block" dir="rtl" lang="fa">
        <p>
          فارسی · فضای کاری <bdi dir="ltr">WS-1042</bdi>
        </p>
        <Button variant="primary">ذخیرهٔ تغییرات تنظیمات فضای کاری</Button>
      </div>
      <div className="rtl-block" dir="rtl" lang="ar">
        <p>
          العربية · مساحة العمل <bdi dir="ltr">WS-1042</bdi>
        </p>
        <Button variant="primary">حفظ تغييرات إعدادات مساحة العمل</Button>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
document.body.setAttribute("data-spike", "ready");
