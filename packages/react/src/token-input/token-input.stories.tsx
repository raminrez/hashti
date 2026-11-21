import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuList,
} from "../trigger-menu/trigger-menu";
import {
  TokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
} from "./token-input";

const people = [
  { value: "hollis", label: "Hollis Grant" },
  { value: "ines", label: "Inès Moreau" },
  { value: "kofi", label: "Kofi Mensah" },
];

const meta = {
  title: "Components/TokenInput",
  component: TokenInput,
  tags: ["autodocs"],
  // The root renders no element and takes a render prop; the panel cannot drive it.
  parameters: { layout: "padded", controls: { disable: true } },
  args: {},
  render: () => (
    <div style={{ maxInlineSize: 360 }}>
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
  ),
} satisfies Meta<typeof TokenInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
