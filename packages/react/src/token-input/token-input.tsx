"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  TokenInput,
  TokenInputEditor as UiTokenInputEditor,
  TokenInputToken as UiTokenInputToken,
  TokenInputTokenRemove as UiTokenInputTokenRemove,
} from "@ui-sdk/react/token-input";

// The root renders no element of its own, so it is re-exported directly.
function TokenInputEditor(props: ComponentProps<typeof UiTokenInputEditor>) {
  return (
    <UiTokenInputEditor
      {...props}
      className={join("hashti-token-input-editor", props.className)}
    />
  );
}

function TokenInputToken(props: ComponentProps<typeof UiTokenInputToken>) {
  return (
    <UiTokenInputToken
      {...props}
      className={join("hashti-token-input-token", props.className)}
    />
  );
}

function TokenInputTokenRemove(
  props: ComponentProps<typeof UiTokenInputTokenRemove>,
) {
  return (
    <UiTokenInputTokenRemove
      {...props}
      className={join("hashti-token-input-token-remove", props.className)}
    />
  );
}

export { TokenInput, TokenInputEditor, TokenInputToken, TokenInputTokenRemove };
