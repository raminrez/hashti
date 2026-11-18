"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  TokenInput as UiSdkTokenInput,
  TokenInputEditor,
  TokenInputToken,
  TokenInputTokenRemove,
  createTokenInputController,
  defaultCodec,
  fromText,
  toLabel,
  toText,
  type Token,
  type TokenInputEditorState,
  type TokenInputTokenState,
  type TokenInputValue,
} from "@ui-sdk/react/token-input";
import { Field as UiSdkField } from "@ui-sdk/react/field";
import {
  FieldLayout,
  FieldPresentationProvider,
  fieldClassName,
  fieldParts,
  useFieldPresentation,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { Icon } from "../../icons";
import { cx, uiClass, type ControlSize } from "../../utils";

export type TokenInputRootProps = Omit<ComponentProps<typeof UiSdkTokenInput>, "children"> &
  FieldPresentationProps & {
    size?: ControlSize;
    /** Allow the editor to grow to several lines. */
    multiline?: boolean;
    placeholder?: string;
    className?: string;
    children?: ReactNode;
  };

/**
 * The token input root: a ui-sdk Field holding a ui-sdk TokenInput. Hashti
 * adds `size`, `multiline` and the field status presentation.
 */
function TokenInputRoot({
  size = "md",
  multiline = false,
  placeholder,
  className,
  children,
  status,
  statusVariant,
  isOptional,
  name,
  disabled,
  required,
  renderToken,
  ...props
}: TokenInputRootProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      name={name}
      disabled={disabled}
      data-size={size}
      data-multiline={multiline || undefined}
      {...presentation.props}
      className={cx(fieldClassName("token-input"), className as string)}
    >
      <FieldPresentationProvider
        status={status}
        statusVariant={presentation.statusVariant}
        isOptional={isOptional}
        isRequired={required}
        fieldGated
      >
        <UiSdkTokenInput
          {...props}
          disabled={disabled}
          required={required}
          renderToken={renderToken ?? defaultRenderToken}
        >
          {children ?? <TokenInputEditorControl placeholder={placeholder} />}
        </UiSdkTokenInput>
      </FieldPresentationProvider>
    </UiSdkField>
  );
}

export interface TokenInputEditorControlProps
  extends Omit<ComponentProps<typeof TokenInputEditor>, "children"> {
  children?: ReactNode | ((state: TokenInputEditorState) => ReactNode);
}

/** The editable surface: ui-sdk's TokenInputEditor with Hashti's control classes. */
function TokenInputEditorControl({ className, ...props }: TokenInputEditorControlProps) {
  return (
    <TokenInputEditor
      {...props}
      className={uiClass(
        className as string | ((state: TokenInputEditorState) => string | undefined) | undefined,
        "hashti-field__control",
        "hashti-token-input__editor",
      )}
    />
  );
}

export interface TokenProps extends Omit<ComponentProps<typeof TokenInputToken>, "children"> {
  icon?: ReactNode;
  children?: ReactNode | ((state: TokenInputTokenState) => ReactNode);
}

/** A token's content, rendered inside `renderToken`. */
function Token({ icon, className, children, ...props }: TokenProps) {
  return (
    <TokenInputToken
      {...props}
      className={uiClass(
        className as string | ((state: TokenInputTokenState) => string | undefined) | undefined,
        "hashti-token",
      )}
    >
      {(state: TokenInputTokenState) => (
        <>
          {icon && <span className="hashti-token__icon">{icon}</span>}
          <span className="hashti-token__label">
            {typeof children === "function" ? children(state) : (children ?? state.token.label)}
          </span>
          <TokenInputTokenRemove className="hashti-token__remove">
            <Icon name="close" aria-hidden="true" />
          </TokenInputTokenRemove>
        </>
      )}
    </TokenInputToken>
  );
}

function defaultRenderToken(token: Token) {
  return <Token>{token.label}</Token>;
}

export type TokenInputProps = Omit<TokenInputRootProps, "children"> &
  FieldContentProps & {
    children?: ReactNode;
  };

function TokenInputDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  multiline = false,
  placeholder,
  className,
  children,
  ...props
}: TokenInputProps) {
  return (
    <TokenInputRoot
      {...props}
      size={size}
      multiline={multiline}
      placeholder={placeholder}
      className={className}
    >
      {children ?? (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <TokenInputEditorControl placeholder={placeholder} />
        </FieldLayout>
      )}
    </TokenInputRoot>
  );
}

interface TokenInputCompound {
  (props: TokenInputProps): ReactNode;
  Root: typeof TokenInputRoot;
  Editor: typeof TokenInputEditorControl;
  Token: typeof Token;
  TokenRemove: typeof TokenInputTokenRemove;
  Label: typeof fieldParts.Label;
  Description: typeof fieldParts.Description;
  Help: typeof fieldParts.Help;
  ErrorMessage: typeof fieldParts.ErrorMessage;
  Status: typeof fieldParts.Status;
  StatusIcon: typeof fieldParts.StatusIcon;
}

export const TokenInput: TokenInputCompound = Object.assign(TokenInputDefault, {
  Root: TokenInputRoot,
  Editor: TokenInputEditorControl,
  Token: Token,
  TokenRemove: TokenInputTokenRemove,
  ...fieldParts,
});

export {
  TokenInputRoot,
  TokenInputEditorControl,
  Token,
  TokenInputTokenRemove,
  createTokenInputController,
  defaultCodec,
  fromText,
  toLabel,
  toText,
};
export type { TokenInputValue, TokenInputTokenState, TokenInputEditorState };
export type { Token as TokenData };
