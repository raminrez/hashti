"use client";

import { createContext, useContext, type ReactNode, type Ref } from "react";
import {
  TokenField as AriaTokenField,
  TokenInput as AriaTokenInput,
  Token as AriaToken,
  TokenFieldContext as AriaTokenFieldContext,
  TokenFieldValue,
  type TokenFieldProps as AriaTokenFieldProps,
  type TokenInputProps as AriaTokenInputProps,
  type TokenProps as AriaTokenProps,
} from "react-aria-components/TokenField";
import {
  useFieldAnatomy,
  fieldClassName,
  fieldParts,
  type FieldPresentationProps,
  FieldLayout,
  type FieldContentProps,
} from "../field";
import { Icon } from "../../icons";
import { classes, cx, type ControlSize } from "../../utils";

export { TokenFieldValue };

export interface TokenSegment<T = any> {
  type: "token";
  text: string;
  value?: T;
}

export interface TokenFieldContextValue {
  size?: ControlSize;
  multiline?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export const TokenFieldContext = createContext<TokenFieldContextValue>({});
export const useTokenFieldContext = () => useContext(TokenFieldContext);

export interface TokenFieldRootProps<T extends TokenFieldValue = TokenFieldValue>
  extends AriaTokenFieldProps<T>, FieldPresentationProps {
  size?: ControlSize;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function TokenFieldRoot<T extends TokenFieldValue = TokenFieldValue>({
  size = "md",
  multiline = false,
  placeholder,
  className,
  children,
  status,
  statusVariant,
  isOptional,
  allowsNewlines,
  ref,
  ...props
}: TokenFieldRootProps<T>) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    AriaTokenFieldContext,
  );
  const resolvedAllowsNewlines = multiline || allowsNewlines;

  return (
    <TokenFieldContext.Provider
      value={{
        size,
        multiline,
        placeholder,
        isDisabled: props.isDisabled,
        isReadOnly: props.isReadOnly,
      }}
    >
      <AriaTokenField<T>
        {...props}
        {...anatomy.props}
        ref={ref}
        allowsNewlines={resolvedAllowsNewlines}
        data-size={size}
        data-multiline={multiline || undefined}
        className={classes(
          cx(
            fieldClassName("token-field"),
            multiline ? "hashti-token-field--multiline" : undefined,
          ),
          className,
        )}
      >
        {anatomy.wrap(children, anatomy.slotted?.children)}
      </AriaTokenField>
    </TokenFieldContext.Provider>
  );
}

export interface TokenInputProps<T extends TokenFieldValue = TokenFieldValue> extends Omit<
  AriaTokenInputProps<T>,
  "children" | "className"
> {
  placeholder?: string;
  className?: string;
  children?: (segment: TokenSegment<any>) => React.ReactElement;
  ref?: Ref<HTMLDivElement>;
}

export function TokenFieldInput<T extends TokenFieldValue = TokenFieldValue>({
  placeholder,
  className,
  children,
  ref,
  ...props
}: TokenInputProps<T>) {
  const ctx = useTokenFieldContext();
  const resolvedPlaceholder = placeholder ?? ctx.placeholder;
  const size = ctx.size ?? "md";
  const multiline = ctx.multiline;

  const defaultRender = (segment: TokenSegment<any>) => (
    <TokenFieldToken key={segment.text}>{segment.text}</TokenFieldToken>
  );

  return (
    <AriaTokenInput<T>
      {...props}
      ref={ref}
      data-size={size}
      data-multiline={multiline || undefined}
      data-placeholder={resolvedPlaceholder}
      className={classes(
        cx(
          "hashti-token-input react-aria-TokenInput",
          multiline ? "hashti-token-input--multiline" : undefined,
        ),
        className,
      )}
    >
      {children ?? defaultRender}
    </AriaTokenInput>
  );
}

export interface TokenProps extends Omit<AriaTokenProps, "className" | "children"> {
  icon?: ReactNode;
  onRemove?: () => void;
  size?: ControlSize;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

export function TokenFieldToken({
  icon,
  onRemove,
  size: propSize,
  isDisabled: propIsDisabled,
  className,
  children,
  ref,
  ...props
}: TokenProps) {
  const ctx = useTokenFieldContext();
  const size = propSize ?? ctx.size ?? "md";
  const isDisabled = propIsDisabled ?? ctx.isDisabled;
  const isReadOnly = ctx.isReadOnly;

  return (
    <AriaToken
      {...props}
      ref={ref}
      data-size={size}
      className={classes("hashti-token react-aria-Token", className)}
    >
      {() => (
        <>
          {icon && <span className="hashti-token__icon">{icon}</span>}
          <span className="hashti-token__label">{children}</span>
          {onRemove && !isDisabled && !isReadOnly && (
            <button
              type="button"
              aria-label="Remove token"
              className="hashti-token__remove"
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemove();
              }}
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </>
      )}
    </AriaToken>
  );
}

export interface TokenFieldProps<T extends TokenFieldValue = TokenFieldValue>
  extends Omit<TokenFieldRootProps<T>, "children">, FieldContentProps {
  children?: ReactNode | ((segment: TokenSegment<any>) => React.ReactElement);
}

function TokenFieldDefault<T extends TokenFieldValue = TokenFieldValue>({
  label,
  labelTooltip,
  description,
  errorMessage,
  placeholder,
  size = "md",
  multiline = false,
  className,
  children,
  ...props
}: TokenFieldProps<T>) {
  const isFunctionChildren = typeof children === "function";
  const isCustomChildren = children != null && !isFunctionChildren;

  return (
    <TokenFieldRoot<T>
      {...props}
      size={size}
      multiline={multiline}
      placeholder={placeholder}
      className={className}
    >
      {isCustomChildren ? (
        children
      ) : (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <TokenFieldInput placeholder={placeholder}>
            {isFunctionChildren
              ? (children as (segment: TokenSegment<any>) => React.ReactElement)
              : undefined}
          </TokenFieldInput>
        </FieldLayout>
      )}
    </TokenFieldRoot>
  );
}

export const TokenField = Object.assign(TokenFieldDefault, {
  Root: TokenFieldRoot,
  Input: TokenFieldInput,
  Token: TokenFieldToken,
  ...fieldParts,
});
