"use client";

import type { ReactNode } from "react";
import {
  Select as UiSdkSelect,
  SelectClear,
  SelectContent as UiSdkSelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem as UiSdkSelectItem,
  SelectItemIcon,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectSeparator,
  SelectStatus,
  SelectTrigger as UiSdkSelectTrigger,
  SelectValue as UiSdkSelectValue,
  createSelectController,
  type ListData,
  type SelectProps as UiSdkSelectProps,
  type SelectContentState,
  type SelectItemState,
  type SelectTriggerState,
  type SelectValueState,
} from "@ui-sdk/react/select";
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
import { useOverlayTheme } from "../../theme";
import { Icon } from "../../icons";
import { cx, uiClass, type ControlSize } from "../../utils";

/** `Omit` does not distribute over ui-sdk's single/multiple option unions; this does. */
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : T;

export type SelectRootProps<T = string, M extends boolean | undefined = false> =
  DistributiveOmit<UiSdkSelectProps<T, M>, "status"> &
    FieldPresentationProps & {
      size?: ControlSize;
      className?: string;
    };

/**
 * The select root: a ui-sdk Field (so labels, descriptions and errors wire up
 * through the field's ids) holding a ui-sdk Select. Hashti adds `size` and the
 * field status presentation.
 */
function SelectRoot<T = string, M extends boolean | undefined = false>({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  name,
  disabled,
  required,
  ...props
}: SelectRootProps<T, M>) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      name={name}
      disabled={disabled}
      data-size={size}
      {...presentation.props}
      className={cx(fieldClassName("select"), className as string)}
    >
      <FieldPresentationProvider
        status={status}
        statusVariant={presentation.statusVariant}
        isOptional={isOptional}
        isRequired={required}
        fieldGated
      >
        <UiSdkSelect<T, M> {...(props as UiSdkSelectProps<T, M>)} disabled={disabled} required={required}>
          {children}
        </UiSdkSelect>
      </FieldPresentationProvider>
    </UiSdkField>
  );
}

export interface SelectTriggerProps
  extends Omit<React.ComponentProps<typeof UiSdkSelectTrigger>, "children"> {
  children?: ReactNode | ((state: SelectTriggerState) => ReactNode);
}

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  return (
    <UiSdkSelectTrigger
      {...props}
      className={uiClass(
        className as string | ((state: SelectTriggerState) => string | undefined) | undefined,
        "hashti-field__control",
        "hashti-select-trigger",
      )}
    >
      {children}
    </UiSdkSelectTrigger>
  );
}

export interface SelectValueProps
  extends Omit<React.ComponentProps<typeof UiSdkSelectValue>, "children"> {
  children?: ReactNode | ((state: SelectValueState) => ReactNode);
}

function SelectValuePart({ className, children, ...props }: SelectValueProps) {
  return (
    <UiSdkSelectValue
      {...props}
      className={uiClass(
        className as string | ((state: SelectValueState) => string | undefined) | undefined,
        "hashti-select__value",
      )}
    >
      {children}
    </UiSdkSelectValue>
  );
}

export interface SelectContentProps
  extends Omit<React.ComponentProps<typeof UiSdkSelectContent>, "children"> {
  children?: ReactNode | ((state: SelectContentState) => ReactNode);
}

function SelectContent({ className, children, ...props }: SelectContentProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <UiSdkSelectContent
      sideOffset={6}
      {...theme}
      {...props}
      className={uiClass(
        className as string | ((state: SelectContentState) => string | undefined) | undefined,
        "hashti-popover",
        "hashti-select-popover",
        appearanceClassName,
      )}
    >
      {children}
    </UiSdkSelectContent>
  );
}

export interface SelectItemProps
  extends Omit<React.ComponentProps<typeof UiSdkSelectItem>, "children"> {
  children?: ReactNode | ((state: SelectItemState) => ReactNode);
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <UiSdkSelectItem
      {...props}
      className={uiClass(
        className as string | ((state: SelectItemState) => string | undefined) | undefined,
        "hashti-listbox-item",
        "hashti-select-item",
      )}
    >
      {children}
    </UiSdkSelectItem>
  );
}

export type SelectProps<T = string, M extends boolean | undefined = false> = DistributiveOmit<
  SelectRootProps<T, M>,
  "children"
> &
  FieldContentProps & {
    /** The options as data; the popup renders them for you. */
    items?: ListData<T>;
    placeholder?: string;
    /** Custom rendering of the selected value(s) inside the trigger. */
    renderValue?: (state: SelectValueState) => ReactNode;
    /**
     * With `multiple`, how the trigger shows the selection: joined text, a
     * first-label-plus-count badge, or one chip per label (display only — the
     * listbox toggles selection).
     */
    multipleDisplay?: "chips" | "badge" | "text";
    children?: ReactNode;
  };

function renderMultipleValue(state: SelectValueState, display: "chips" | "badge") {
  if (display === "badge") {
    return (
      <span className="hashti-select-multi-badge-wrapper">
        <span className="hashti-select-multi-first">{state.labels[0]}</span>
        {state.labels.length > 1 && (
          <span className="hashti-badge hashti-select-badge" data-variant="info">
            +{state.labels.length - 1}
          </span>
        )}
      </span>
    );
  }
  return (
    <span className="hashti-select-chips-wrapper">
      {state.labels.map((label) => (
        <span key={label} className="hashti-tag hashti-select-chip" data-size="sm">
          <span>{label}</span>
        </span>
      ))}
    </span>
  );
}

function SelectDefault<T = string, M extends boolean | undefined = false>({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  placeholder,
  renderValue,
  multipleDisplay = "chips",
  children,
  ...props
}: SelectProps<T, M>) {
  const multiple = Boolean((props as { multiple?: boolean }).multiple);
  const renderTriggerValue = (state: SelectValueState): ReactNode => {
    if (renderValue) return renderValue(state);
    if (multiple && multipleDisplay !== "text" && !state.placeholder && state.labels.length > 0) {
      return renderMultipleValue(state, multipleDisplay);
    }
    return state.placeholder ? (placeholder ?? null) : state.label;
  };

  return (
    <SelectRoot<T, M> {...(props as SelectRootProps<T, M>)} size={size} placeholder={placeholder}>
      <FieldLayout
        label={label}
        labelTooltip={labelTooltip}
        description={description}
        errorMessage={errorMessage}
      >
        <SelectTrigger>
          <SelectValuePart placeholder={placeholder}>{renderTriggerValue}</SelectValuePart>
          <Icon name="chevronDown" aria-hidden="true" />
        </SelectTrigger>
      </FieldLayout>
      <SelectContent>{children}</SelectContent>
    </SelectRoot>
  );
}

interface SelectCompound {
  <T = string, M extends boolean | undefined = false>(props: SelectProps<T, M>): ReactNode;
  Root: typeof SelectRoot;
  Label: typeof fieldParts.Label;
  Description: typeof fieldParts.Description;
  Help: typeof fieldParts.Help;
  ErrorMessage: typeof fieldParts.ErrorMessage;
  Status: typeof SelectStatus;
  StatusIcon: typeof fieldParts.StatusIcon;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValuePart;
  Content: typeof SelectContent;
  List: typeof SelectList;
  Item: typeof SelectItem;
  ItemIndicator: typeof SelectItemIndicator;
  ItemIcon: typeof SelectItemIcon;
  ItemText: typeof SelectItemText;
  Group: typeof SelectGroup;
  GroupLabel: typeof SelectGroupLabel;
  Separator: typeof SelectSeparator;
  Input: typeof SelectInput;
  Empty: typeof SelectEmpty;
  Clear: typeof SelectClear;
}

export const Select: SelectCompound = Object.assign(SelectDefault, {
  Root: SelectRoot,
  ...fieldParts,
  Trigger: SelectTrigger,
  Value: SelectValuePart,
  Content: SelectContent,
  List: SelectList,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  ItemIcon: SelectItemIcon,
  ItemText: SelectItemText,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
  Input: SelectInput,
  Empty: SelectEmpty,
  Status: SelectStatus,
  Clear: SelectClear,
});

export {
  SelectRoot,
  SelectTrigger,
  SelectValuePart,
  SelectContent,
  SelectItem,
  createSelectController,
};
export type { ListData, SelectValueState };
