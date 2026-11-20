"use client";

import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuList,
} from "@hashti/react";

const people = [
  { value: "hollis", label: "Hollis Grant" },
  { value: "ines", label: "Inès Moreau" },
  { value: "kofi", label: "Kofi Mensah" },
];

export function TokenInputDemo() {
  // The root renders no element, so the width lives on a wrapping div.
  return (
    <div style={{ maxWidth: 360 }}>
      <TokenInput
        renderToken={(token) => (
          <TokenInputToken>
            {token.label}
            <TokenInputTokenRemove>×</TokenInputTokenRemove>
          </TokenInputToken>
        )}
      >
        <TokenInputEditor placeholder="Type @ to mention someone…" />
        <TriggerMenu triggers={[{ char: "@", type: "mention", items: people }]}>
          <TriggerMenuContent>
            <TriggerMenuList />
          </TriggerMenuContent>
        </TriggerMenu>
      </TokenInput>
    </div>
  );
}
