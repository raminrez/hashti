import { useState } from "react";
import { TokenField, TokenFieldValue } from "@hashti/react";

export function TokenFieldLiveDemo() {
  const [value, setValue] = useState(
    () =>
      new TokenFieldValue([
        { type: "text", text: "Translate portal design into " },
        { type: "token", text: "@PersianStyle", value: { id: "style" } },
        { type: "text", text: " with " },
        { type: "token", text: "@TurquoiseAccent", value: { id: "accent" } },
        { type: "text", text: " " },
      ]),
  );

  return (
    <div className="w-full max-w-md space-y-3">
      <TokenField
        label="AI Prompt Template & Tokens"
        description="Type text or use interactive tokens with backspace deletion."
        value={value}
        onChange={setValue}
        multiline
      />
      <div className="text-xs text-neutral-500 font-mono">Serialized: {value?.toString()}</div>
    </div>
  );
}
