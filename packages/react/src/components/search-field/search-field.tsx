"use client";

import type { ReactNode, Ref } from "react";
import {
  SearchField as RACSearchField,
  SearchFieldContext,
  Input,
  type SearchFieldProps as RACSearchFieldProps,
  type InputProps,
} from "react-aria-components";
import { Icon } from "../../icons";
import {
  FieldLayout,
  FieldGroupInput,
  FieldButton,
  FieldControl,
  useFieldAnatomy,
  fieldClassName,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { classes, type ControlSize } from "../../utils";

export interface SearchFieldRootProps extends RACSearchFieldProps, FieldPresentationProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

function SearchFieldRoot({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  ...props
}: SearchFieldRootProps) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    SearchFieldContext as Parameters<typeof useFieldAnatomy>[1],
  );
  return (
    <RACSearchField
      {...props}
      {...anatomy.props}
      data-size={size}
      className={classes(fieldClassName("search-field"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children as ReactNode)}
    </RACSearchField>
  );
}

export interface SearchFieldProps extends SearchFieldRootProps, FieldContentProps {
  placeholder?: string;
  inputProps?: InputProps;
}

function SearchFieldDefault({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  placeholder = "Search",
  inputProps,
  className,
  children,
  ...props
}: SearchFieldProps) {
  return (
    <SearchFieldRoot {...props} size={size} className={className}>
      {children ?? (
        <FieldLayout
          label={label}
          labelTooltip={labelTooltip}
          description={description}
          errorMessage={errorMessage}
        >
          <FieldControl>
            <Icon name="search" />
            <Input placeholder={placeholder} {...inputProps} />
            <FieldButton size={size}>
              <Icon name="close" />
            </FieldButton>
          </FieldControl>
        </FieldLayout>
      )}
    </SearchFieldRoot>
  );
}

export const SearchField = Object.assign(SearchFieldDefault, {
  Root: SearchFieldRoot,
  ...fieldParts,
  Input: FieldGroupInput,
  Control: FieldControl,
  ClearButton: FieldButton,
});
