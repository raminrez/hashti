"use client";

import type { ReactNode, Ref } from "react";
import { Field as UiSdkField, type FieldState } from "@ui-sdk/react/field";
import {
  Input as UiSdkInput,
  InputClear,
  InputGroup,
  type InputState,
} from "@ui-sdk/react/input";
import {
  FieldLayout,
  FieldPresentationProvider,
  fieldClassName,
  useFieldPresentation,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { Icon } from "../../icons";
import { cx, type ControlSize } from "../../utils";

export interface SearchFieldRootProps extends FieldPresentationProps {
  size?: ControlSize;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  className?: string | ((state: FieldState) => string | undefined);
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function SearchFieldRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  name,
  disabled,
  invalid,
  required,
  ...props
}: SearchFieldRootProps) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      name={name}
      disabled={disabled}
      invalid={invalid}
      data-size={size}
      {...presentation.props}
      className={cx(fieldClassName("search-field"), className as string)}
    >
      <FieldPresentationProvider
        status={status}
        statusVariant={presentation.statusVariant}
        isOptional={isOptional}
        isRequired={required}
        fieldGated
      >
        {children}
      </FieldPresentationProvider>
    </UiSdkField>
  );
}

export interface SearchFieldProps extends Omit<SearchFieldRootProps, "children">, FieldContentProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
  /** Accessible name for the clear button. */
  clearLabel?: string;
  children?: ReactNode;
}

/**
 * A search box: a ui-sdk `Input type="search"` with the search icon and a
 * clear button, inside the field anatomy.
 */
function SearchFieldDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  placeholder = "Search",
  clearLabel = "Clear search",
  inputRef,
  className,
  children,
  value,
  defaultValue,
  onValueChange,
  required,
  ...props
}: SearchFieldProps) {
  return (
    <SearchFieldRoot {...props} required={required} size={size} className={className}>
      {children ?? (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <InputGroup className="hashti-field__control hashti-input-group">
            <Icon name="search" />
            <UiSdkInput
              type="search"
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              onValueChange={onValueChange}
              required={required}
              ref={inputRef}
            />
            <InputClear aria-label={clearLabel} className="hashti-button" data-variant="ghost">
              <Icon name="close" />
            </InputClear>
          </InputGroup>
        </FieldLayout>
      )}
    </SearchFieldRoot>
  );
}

export const SearchField: typeof SearchFieldDefault & {
  Root: typeof SearchFieldRoot;
  Group: typeof InputGroup;
  Clear: typeof InputClear;
} = Object.assign(SearchFieldDefault, {
  Root: SearchFieldRoot,
  Group: InputGroup,
  Clear: InputClear,
});

export type { InputState };
