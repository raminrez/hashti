"use client";

import type { ReactNode } from "react";
import {
  Combobox as UiSdkCombobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsOverflow,
  ComboboxClear,
  ComboboxContent as UiSdkComboboxContent,
  ComboboxCreate as UiSdkComboboxCreate,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput as UiSdkComboboxInput,
  ComboboxItem as UiSdkComboboxItem,
  ComboboxItemIcon,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxList,
  ComboboxItems,
  ComboboxSelectAll,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger as UiSdkComboboxTrigger,
  ComboboxValue as UiSdkComboboxValue,
  createComboboxController,
  type ComboboxProps as UiSdkComboboxProps,
  type ComboboxContentState,
  type ComboboxCreateState,
  type ComboboxItemState,
  type ComboboxValueState,
  type ListData,
} from "@ui-sdk/react/combobox";
import { Field as UiSdkField } from "@ui-sdk/react/field";
import {
  FieldControl,
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

export type ComboBoxRootProps<T = string, M extends boolean | undefined = false> =
  DistributiveOmit<UiSdkComboboxProps<T, M>, "status"> &
    FieldPresentationProps & {
      size?: ControlSize;
      className?: string;
    };

/**
 * The combobox root: a ui-sdk Field holding a ui-sdk Combobox. Hashti adds
 * `size` and the field status presentation.
 */
function ComboBoxRoot<T = string, M extends boolean | undefined = false>({
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
}: ComboBoxRootProps<T, M>) {
  const presentation = useFieldPresentation({ status, statusVariant, isOptional }, undefined);
  return (
    <UiSdkField
      name={name}
      disabled={disabled}
      data-size={size}
      {...presentation.props}
      className={cx(fieldClassName("combobox"), className as string)}
    >
      <FieldPresentationProvider
        status={status}
        statusVariant={presentation.statusVariant}
        isOptional={isOptional}
        isRequired={required}
        fieldGated
      >
        <UiSdkCombobox<T, M>
          {...(props as UiSdkComboboxProps<T, M>)}
          disabled={disabled}
          required={required}
        >
          {children}
        </UiSdkCombobox>
      </FieldPresentationProvider>
    </UiSdkField>
  );
}

export type ComboBoxInputProps = React.ComponentProps<typeof UiSdkComboboxInput>;

function ComboBoxInput({ className, ...props }: ComboBoxInputProps) {
  return <UiSdkComboboxInput {...props} className={className as string} />;
}

export type ComboBoxTriggerProps = React.ComponentProps<typeof UiSdkComboboxTrigger>;

function ComboBoxTrigger({ className, children, ...props }: ComboBoxTriggerProps) {
  return (
    <UiSdkComboboxTrigger
      {...props}
      className={cx("hashti-button hashti-combobox-trigger", className as string)}
      data-variant="ghost"
    >
      {children ?? <Icon name="chevronDown" aria-hidden="true" />}
    </UiSdkComboboxTrigger>
  );
}

export interface ComboBoxContentProps
  extends Omit<React.ComponentProps<typeof UiSdkComboboxContent>, "children"> {
  children?: ReactNode | ((state: ComboboxContentState) => ReactNode);
}

function ComboBoxContent({ className, children, ...props }: ComboBoxContentProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();
  return (
    <UiSdkComboboxContent
      sideOffset={6}
      {...theme}
      {...props}
      className={uiClass(
        className as string | ((state: ComboboxContentState) => string | undefined) | undefined,
        "hashti-popover",
        "hashti-combobox-popover",
        appearanceClassName,
      )}
    >
      {children}
    </UiSdkComboboxContent>
  );
}

export type ComboBoxItemProps<T = string> = Omit<
  React.ComponentProps<typeof UiSdkComboboxItem<T>>,
  "children"
> & {
  children?: ReactNode | ((state: ComboboxItemState) => ReactNode);
};

function ComboBoxItem<T = string>({ className, children, ...props }: ComboBoxItemProps<T>) {
  return (
    <UiSdkComboboxItem<T>
      {...props}
      className={uiClass(
        className as string | ((state: ComboboxItemState) => string | undefined) | undefined,
        "hashti-listbox-item",
        "hashti-combobox-item",
      )}
    >
      {children}
    </UiSdkComboboxItem>
  );
}

export interface ComboBoxCreateProps
  extends Omit<React.ComponentProps<typeof UiSdkComboboxCreate>, "children"> {
  children?: ReactNode | ((state: ComboboxCreateState) => ReactNode);
}

/**
 * The "create <query>" option, shown when the input matches nothing exactly.
 * `onCreate` receives the query; adding the item and selecting it stays with
 * the caller.
 */
function ComboBoxCreate({ className, children, ...props }: ComboBoxCreateProps) {
  return (
    <UiSdkComboboxCreate
      {...props}
      className={cx("hashti-combobox-create-item", className as string)}
    >
      {children ??
        ((state: ComboboxCreateState) => (
          <span className="hashti-combobox-create-item-text">Create &quot;{state.query}&quot;</span>
        ))}
    </UiSdkComboboxCreate>
  );
}

export type ComboBoxProps<T = string, M extends boolean | undefined = false> = DistributiveOmit<
  ComboBoxRootProps<T, M>,
  "children"
> &
  FieldContentProps & {
    /** The options as data; the popup list renders them for you. */
    items?: ListData<T>;
    placeholder?: string;
    /** Custom rendering of the selected value(s), inside the chips row with `multiple`. */
    renderValue?: (state: ComboboxValueState) => ReactNode;
    /** With `multiple`, how the selection shows: one chip per value, a count badge, or joined text. */
    multipleDisplay?: "chips" | "badge" | "text";
    /** Show a create option for unmatched input; `onCreateItem` receives the query. */
    allowCreateItem?: boolean;
    onCreateItem?: (query: string) => unknown;
    /** Content for the empty state of the list. */
    emptyContent?: ReactNode;
    children?: ReactNode;
  };

function defaultChips(state: ComboboxValueState) {
  const values = (state.value ?? []) as string[];
  return values.map((value, index) => (
    <ComboboxChip key={String(value)} value={value} className="hashti-combobox-chip">
      {state.labels[index] ?? String(value)}
      <ComboboxChipRemove
        aria-label={`Remove ${state.labels[index] ?? String(value)}`}
        className="hashti-combobox-chip-remove"
      >
        <Icon name="close" aria-hidden="true" />
      </ComboboxChipRemove>
    </ComboboxChip>
  ));
}

function badgeValue(state: ComboboxValueState) {
  const count = ((state.value ?? []) as unknown[]).length;
  if (count === 0) return null;
  return (
    <span className="hashti-combobox-multi-badge-wrapper">
      <span className="hashti-badge hashti-combobox-badge" data-variant="info">
        {count} selected
      </span>
    </span>
  );
}

function ComboBoxDefault<T = string, M extends boolean | undefined = false>({
  label,
  labelTooltip,
  description,
  errorMessage,
  size = "md",
  placeholder,
  renderValue,
  multipleDisplay = "chips",
  allowCreateItem = false,
  onCreateItem,
  emptyContent,
  children,
  ...props
}: ComboBoxProps<T, M>) {
  const multiple = Boolean((props as { multiple?: boolean }).multiple);

  const valueContent =
    renderValue ??
    (multipleDisplay === "badge"
      ? badgeValue
      : multipleDisplay === "text"
        ? (state: ComboboxValueState) => state.label
        : defaultChips);

  return (
    <ComboBoxRoot<T, M> {...(props as ComboBoxRootProps<T, M>)} size={size}>
      <FieldLayout
        label={label}
        labelTooltip={labelTooltip}
        description={description}
        errorMessage={errorMessage}
      >
        {multiple ? (
          <ComboboxChips className="hashti-field__control hashti-input-group hashti-combobox-values">
            <UiSdkComboboxValue>{valueContent}</UiSdkComboboxValue>
            <ComboBoxInput placeholder={placeholder} />
            <ComboBoxTrigger aria-label="Open items list" />
          </ComboboxChips>
        ) : (
          <FieldControl>
            <ComboBoxInput placeholder={placeholder} />
            <ComboBoxTrigger aria-label="Open items list" />
          </FieldControl>
        )}
      </FieldLayout>
      <ComboBoxContent>
        <ComboboxEmpty>{emptyContent ?? "No results found."}</ComboboxEmpty>
        {children != null ? (
          <ComboboxList>
            {children}
            {allowCreateItem && <ComboBoxCreate onCreate={onCreateItem} />}
          </ComboboxList>
        ) : (
          // Passing any children would suppress the list's automatic rendering
          // of the root's `items`, so render them explicitly here.
          <ComboboxList>
            {(state: ComboboxContentState) => (
              <>
                <ComboboxItems items={state.items as ListData<unknown>} />
                {allowCreateItem && <ComboBoxCreate onCreate={onCreateItem} />}
              </>
            )}
          </ComboboxList>
        )}
      </ComboBoxContent>
    </ComboBoxRoot>
  );
}

interface ComboBoxCompound {
  <T = string, M extends boolean | undefined = false>(props: ComboBoxProps<T, M>): ReactNode;
  Root: typeof ComboBoxRoot;
  Label: typeof fieldParts.Label;
  Description: typeof fieldParts.Description;
  Help: typeof fieldParts.Help;
  ErrorMessage: typeof fieldParts.ErrorMessage;
  Status: typeof ComboboxStatus;
  StatusIcon: typeof fieldParts.StatusIcon;
  Control: typeof FieldControl;
  Input: typeof ComboBoxInput;
  Trigger: typeof ComboBoxTrigger;
  Content: typeof ComboBoxContent;
  List: typeof ComboboxList;
  Item: typeof ComboBoxItem;
  ItemIndicator: typeof ComboboxItemIndicator;
  ItemIcon: typeof ComboboxItemIcon;
  ItemText: typeof ComboboxItemText;
  Group: typeof ComboboxGroup;
  GroupLabel: typeof ComboboxGroupLabel;
  Separator: typeof ComboboxSeparator;
  Empty: typeof ComboboxEmpty;
  Clear: typeof ComboboxClear;
  Value: typeof UiSdkComboboxValue;
  Chips: typeof ComboboxChips;
  Chip: typeof ComboboxChip;
  ChipRemove: typeof ComboboxChipRemove;
  ChipsOverflow: typeof ComboboxChipsOverflow;
  SelectAll: typeof ComboboxSelectAll;
  Create: typeof ComboBoxCreate;
}

export const ComboBox: ComboBoxCompound = Object.assign(ComboBoxDefault, {
  Root: ComboBoxRoot,
  ...fieldParts,
  Control: FieldControl,
  Input: ComboBoxInput,
  Trigger: ComboBoxTrigger,
  Content: ComboBoxContent,
  List: ComboboxList,
  Item: ComboBoxItem,
  ItemIndicator: ComboboxItemIndicator,
  ItemIcon: ComboboxItemIcon,
  ItemText: ComboboxItemText,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Separator: ComboboxSeparator,
  Empty: ComboboxEmpty,
  Status: ComboboxStatus,
  Clear: ComboboxClear,
  Value: UiSdkComboboxValue,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
  ChipsOverflow: ComboboxChipsOverflow,
  SelectAll: ComboboxSelectAll,
  Create: ComboBoxCreate,
});

export { ComboBoxRoot, ComboBoxCreate, createComboboxController };
