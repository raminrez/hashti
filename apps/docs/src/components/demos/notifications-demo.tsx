import { useState } from "react";
import {
  Alert,
  InlineNotification,
  ProgressBar,
  ProgressCircle,
  AILabel,
  Button,
} from "@hashti/react";

export function AlertLiveDemo() {
  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      <Alert
        kind="info"
        title="Zenithal Angle Aligned"
        subtitle="The sunlight aperture has transitioned into the midday solar window."
      />
      <Alert
        kind="error"
        title="Threshold Access Blocked"
        subtitle="Ingress certificate expired for external perimeter."
      />
    </div>
  );
}

export function InlineNotificationLiveDemo() {
  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      <InlineNotification
        kind="success"
        title="Configuration Saved"
        subtitle="Masonry bench parameters successfully stored in state."
      />
      <InlineNotification
        kind="warning"
        title="High Thermal Delta"
        subtitle="Exterior temperature differs by 18°C from inner courtyard."
      />
    </div>
  );
}

export function ToastLiveDemo() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = () => {
    setToastMsg("Spatial portal settings updated successfully!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onPress={triggerToast}>Trigger System Toast</Button>
      {toastMsg && (
        <div className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium shadow-lg animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--hashti-focus)]"></span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

export function ProgressBarLiveDemo() {
  return (
    <div className="w-full max-w-xs flex flex-col gap-4">
      <ProgressBar label="Portal Synchronization" value={68} showValue />
      <ProgressBar label="Indeterminate Calculation" isIndeterminate />
    </div>
  );
}

export function ProgressCircleLiveDemo() {
  return (
    <div className="flex items-center gap-6">
      <ProgressCircle aria-label="Solar Window" value={75} size="md" />
      <ProgressCircle aria-label="Buffering Telemetry" isIndeterminate size="md" />
    </div>
  );
}

export function AILabelLiveDemo() {
  return (
    <div className="flex items-center gap-3">
      <AILabel text="Spatial Analysis" />
      <span className="text-xs text-neutral-500">
        AI model optimized for ogival arch acoustic resonance calculations.
      </span>
    </div>
  );
}
