"use client";

import { useContext, type ReactNode, type Ref } from "react";
import {
  ComboBox as RACComboBox,
  ComboBoxValue,
  ComboBoxContext,
  ComboBoxStateContext,
  ListBox as RACListBox,
  type ComboBoxProps as RACComboBoxProps,
  type ListBoxProps,
  type ComboBoxValueProps,
} from "react-aria-components";
import { Popover } from "../popover";
import {
  FieldLayout,
  FieldControl,
  FieldGroupInput,
  FieldButton,
  useFieldAnatomy,
  fieldClassName,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { Icon } from "../../icons";
import { classes, cx, type ControlSize } from "../../utils";

type SelectionMode = "single" | "multiple";

export interface ComboBoxRootProps<T, M extends SelectionMode = "single">
  extends RACComboBoxProps<T, M>, FieldPresentationProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

function ComboBoxRoot<T, M extends SelectionMode = "single">({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  ...props
}: ComboBoxRootProps<T, M>) {
  const anatomy = useFieldAnatomy({ ...props, status, statusVariant, isOptional }, ComboBoxContext);
  return (
    <RACComboBox<T, M>
      {...props}
      {...anatomy.props}
      data-size={size}
      className={classes(fieldClassName("combobox"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children)}
    </RACComboBox>
  );
}

function ComboBoxValuePart<T>({
  className,
  ...props
}: ComboBoxValueProps<T> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <ComboBoxValue<T>
      {...props}
      className={classes("hashti-combobox-values react-aria-ComboBoxValue", className)}
    />
  );
}

export interface ComboBoxCreateItemProps {
  onCreateItem?: (val: string) => void;
  className?: string;
}

export function ComboBoxCreateItem({ onCreateItem, className }: ComboBoxCreateItemProps) {
  const state = useContext(ComboBoxStateContext);
  if (!state) return null;

  const trimmed = state.inputValue?.trim();
  if (!trimmed) return null;

  let hasExactMatch = false;
  for (const item of state.collection) {
    if (item.textValue?.toLowerCase() === trimmed.toLowerCase()) {
      hasExactMatch = true;
      break;
    }
  }
  if (hasExactMatch) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      data-testid="combobox-create-item"
      className={cx("hashti-combobox-create-item", className)}
      onClick={() => {
        onCreateItem?.(trimmed);
        state.close();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCreateItem?.(trimmed);
          state.close();
        }
      }}
    >
      <span className="hashti-combobox-create-item-text">Create &quot;{trimmed}&quot;</span>
    </div>
  );
}

export interface ComboBoxProps<T extends object, M extends SelectionMode = "single">
  extends Omit<ComboBoxRootProps<T, M>, "children">, FieldContentProps {
  children: ListBoxProps<T>["children"];
  placeholder?: string;
  renderValue?: (selectedItems: T[]) => ReactNode;
  multipleDisplay?: "chips" | "badge" | "text";
  allowCreateItem?: boolean;
  onCreateItem?: (val: string) => void;
}

function ComboBoxDefault<T extends object, M extends SelectionMode = "single">({
  label,
  labelTooltip,
  description,
  errorMessage,
  children,
  items,
  className,
  placeholder,
  size = "md",
  renderValue,
  multipleDisplay = "chips",
  allowCreateItem = false,
  onCreateItem,
  ...props
}: ComboBoxProps<T, M>) {
  const isMultiple = props.selectionMode === "multiple";

  return (
    <ComboBoxRoot<T, M> {...props} size={size} className={className}>
      <FieldLayout
        label={label}
        labelTooltip={labelTooltip}
        description={description}
        errorMessage={errorMessage}
      >
        <FieldControl>
          <FieldGroupInput placeholder={placeholder} />
          <FieldButton iconOnly aria-label="Open items list">
            <Icon name="chevronDown" />
          </FieldButton>
        </FieldControl>
        {isMultiple && (
          <ComboBoxValuePart>
            {renderValue
              ? ({ selectedItems }: any) => renderValue(selectedItems as T[])
              : ({ selectedItems, state }: any) => {
                  const itemsList = selectedItems.filter(Boolean) as any[];
                  if (!itemsList.length) return null;

                  if (multipleDisplay === "badge") {
                    return (
                      <span className="hashti-combobox-multi-badge-wrapper">
                        <span className="hashti-badge" data-kind="info">
                          {itemsList.length} selected
                        </span>
                      </span>
                    );
                  }

                  if (multipleDisplay === "chips") {
                    return (
                      <div className="hashti-combobox-chips-wrapper">
                        {itemsList.map((item, idx) => {
                          const text =
                            item?.textValue ??
                            item?.name ??
                            item?.rendered ??
                            String(item?.id ?? item);
                          const key = item?.id ?? item?.key ?? idx;
                          return (
                            <span
                              key={key}
                              className="hashti-tag hashti-combobox-chip"
                              data-size="sm"
                              role="presentation"
                            >
                              <span>{text}</span>
                              <span
                                aria-hidden="true"
                                className="hashti-combobox-chip-remove"
                                onPointerDown={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const currentKeys = new Set(state.selectionManager.selectedKeys);
                                  currentKeys.delete(key);
                                  state.selectionManager.setSelectedKeys(currentKeys);
                                }}
                              >
                                <Icon name="close" size={16} />
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    );
                  }

                  return null;
                }}
          </ComboBoxValuePart>
        )}
      </FieldLayout>
      <Popover offset={6} className="hashti-combobox-popover">
        <RACListBox items={items} className="hashti-combobox-listbox react-aria-ListBox">
          {children}
        </RACListBox>
        {allowCreateItem && <ComboBoxCreateItem onCreateItem={onCreateItem} />}
      </Popover>
    </ComboBoxRoot>
  );
}

export const ComboBox = Object.assign(ComboBoxDefault, {
  Root: ComboBoxRoot,
  ...fieldParts,
  Input: FieldGroupInput,
  Control: FieldControl,
  Trigger: FieldButton,
  Value: ComboBoxValuePart,
  Popover,
  ListBox: RACListBox,
  CreateItem: ComboBoxCreateItem,
});
