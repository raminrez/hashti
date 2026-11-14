"use client";

import { useState, type ReactNode, type Ref, useContext, useEffect, useRef, type Key } from "react";
import { useAgentSurface, type ChangeDetails, type ChangeSource } from "@hashti/agent";
import {
  Select as RACSelect,
  SelectStateContext,
  SelectValue,
  SelectContext,
  ListBox as RACListBox,
  type SelectProps as RACSelectProps,
  type ListBoxProps,
  type SelectValueProps,
} from "react-aria-components";
import { Button, type ButtonProps } from "../button";
import { Popover, type PopoverProps } from "../popover";
import {
  FieldLayout,
  FieldStatusIcon,
  useFieldAnatomy,
  fieldClassName,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { Icon } from "../../icons";
import { classes, type ControlSize } from "../../utils";

type SelectionMode = "single" | "multiple";

export interface SelectRootProps<T = {}, M extends SelectionMode = "single">
  extends RACSelectProps<T, M>, FieldPresentationProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

function SelectRoot<T, M extends SelectionMode = "single">({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  ...props
}: SelectRootProps<T, M>) {
  const anatomy = useFieldAnatomy({ ...props, status, statusVariant, isOptional }, SelectContext);
  return (
    <RACSelect<T, M>
      {...props}
      {...anatomy.props}
      data-size={size}
      className={classes(fieldClassName("select"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children)}
    </RACSelect>
  );
}

function SelectTrigger({ className, children, size = "md", ref, ...props }: ButtonProps) {
  const state = useContext(SelectStateContext);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // A chip's remove affordance can never take focus: ARIA gives a button's children none.
  // Backspace/Delete is the keyboard path, and it listens on the element because RAC's own
  // select trigger replaces any key handler passed through props.
  // shortcut: hand-rolled chips instead of the documented TagGroup-in-SelectValue pattern, so
  // removal is unannounced and pointer-only; upgrade when the trigger becomes a Group (as in
  // React Aria's Select and IntentUI's MultipleSelect).
  useEffect(() => {
    const element = triggerRef.current;
    if (!element || state?.selectionManager.selectionMode !== "multiple") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Backspace" && event.key !== "Delete") return;
      const keys = [...state.selectionManager.selectedKeys];
      if (keys.length === 0) return;
      event.preventDefault();
      state.selectionManager.setSelectedKeys(new Set(keys.slice(0, -1)));
    };
    element.addEventListener("keydown", handleKeyDown);
    return () => element.removeEventListener("keydown", handleKeyDown);
  }, [state]);

  return (
    <Button
      variant="ghost"
      {...props}
      ref={(element) => {
        triggerRef.current = element;
        if (typeof ref === "function") ref(element);
        else if (ref) ref.current = element;
      }}
      size={size}
      className={classes("hashti-field__control hashti-select-trigger", className)}
    >
      {composeTriggerContent(children)}
    </Button>
  );
}

function composeTriggerContent(children: ReactNode | ((values: any) => ReactNode)) {
  return (
    <>
      {typeof children === "function" ? (values: any) => children(values) : children}
      <FieldStatusIcon />
    </>
  );
}

function SelectValuePart<T>({
  className,
  ...props
}: SelectValueProps<T> & { ref?: Ref<HTMLSpanElement> }) {
  return (
    <SelectValue<T>
      {...props}
      className={classes("hashti-select__value react-aria-SelectValue", className)}
    />
  );
}

function SelectPopover({ className, offset = 6, ...props }: PopoverProps) {
  return (
    <Popover offset={offset} {...props} className={classes("hashti-select-popover", className)} />
  );
}

function SelectListBox<T extends object>({
  className,
  ...props
}: ListBoxProps<T> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <RACListBox<T>
      {...props}
      className={classes("hashti-select__listbox react-aria-ListBox", className)}
    />
  );
}

type WithChangeDetails<F> = F extends (...args: infer A) => infer R
  ? (...args: [...A, ChangeDetails]) => R
  : never;

export interface SelectProps<T extends object, M extends SelectionMode = "single">
  extends Omit<SelectRootProps<T, M>, "children" | "onSelectionChange">,
    FieldContentProps {
  items?: Iterable<T>;
  children: ListBoxProps<T>["children"];
  placeholder?: string;
  renderValue?: (selectedItems: T[]) => ReactNode;
  multipleDisplay?: "chips" | "badge" | "text";
  /** `details.source` tells an agent's change from a person's; `details.cancel()` refuses it. */
  onSelectionChange?: WithChangeDetails<
    NonNullable<SelectRootProps<T, M>["onSelectionChange"]>
  >;
}

function SelectDefault<T extends object, M extends SelectionMode = "single">({
  label,
  labelTooltip,
  description,
  errorMessage,
  items,
  children,
  className,
  size = "md",
  placeholder,
  renderValue,
  multipleDisplay = "chips",
  ...props
}: SelectProps<T, M>) {
  const isMultiple = props.selectionMode === "multiple";
  const [mirror, setMirror] = useState<Key | null>(
    (props.selectedKey as Key) ?? (props.defaultSelectedKey as Key) ?? null,
  );
  const handleSelectionChange = (
    value: Key | null,
    source: ChangeSource = "user",
    reason?: string,
  ) => {
    let cancelled = false;
    (
      props.onSelectionChange as
        | ((value: Key | null, details: ChangeDetails) => void)
        | undefined
    )?.(value, {
      source,
      reason,
      cancel: () => {
        cancelled = true;
      },
    });
    if (!cancelled) setMirror(value);
  };

  // Owned when the consumer does not own it, so an agent's write repaints the trigger.
  // `Key` from react-aria-components is React's (it carries bigint); RAC's own prop is string | number.
  const selectedKey = (
    props.selectedKey !== undefined ? props.selectedKey : mirror
  ) as SelectRootProps<T, M>["selectedKey"];

  useAgentSurface({
    component: "select",
    label: typeof label === "string" ? label : props["aria-label"],
    value: isMultiple ? undefined : selectedKey,
    actions: {
      setValue: ([key]) =>
        handleSelectionChange(String(key) as Key, "agent", "setValue"),
    },
    mark: { hidden: isMultiple },
  });

  return (
    <SelectRoot<T, M>
      {...props}
      {...(isMultiple ? {} : { selectedKey, defaultSelectedKey: undefined })}
      onSelectionChange={handleSelectionChange as never}
      placeholder={placeholder}
      size={size}
      className={className}
    >
      <FieldLayout
        label={label}
        labelTooltip={labelTooltip}
        description={description}
        errorMessage={errorMessage}
      >
        <SelectTrigger size={size}>
          <SelectValuePart>
            {renderValue
              ? ({ selectedItems }: any) => renderValue(selectedItems as T[])
              : isMultiple
                ? ({ selectedItems, state, defaultChildren }: any) => {
                    const itemsList = selectedItems.filter(Boolean) as any[];
                    if (!itemsList.length) {
                      return defaultChildren;
                    }

                    if (multipleDisplay === "badge") {
                      return (
                        <span className="hashti-select-multi-badge-wrapper">
                          <span className="hashti-select-multi-first">
                            {itemsList[0]?.textValue ??
                              itemsList[0]?.name ??
                              itemsList[0]?.rendered ??
                              itemsList[0]?.id ??
                              "Selected"}
                          </span>
                          <span className="hashti-badge" data-kind="info">
                            +{itemsList.length - 1}
                          </span>
                        </span>
                      );
                    }

                    if (multipleDisplay === "chips") {
                      return (
                        <span className="hashti-select-chips-wrapper">
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
                                className="hashti-tag hashti-select-chip"
                                data-size="sm"
                                role="presentation"
                              >
                                <span>{text}</span>
                                <span
                                  aria-hidden="true"
                                  className="hashti-select-chip-remove"
                                  onPointerDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const currentKeys = new Set(
                                      state.selectionManager.selectedKeys,
                                    );
                                    currentKeys.delete(key);
                                    state.selectionManager.setSelectedKeys(currentKeys);
                                  }}
                                >
                                  <Icon name="close" size={16} />
                                </span>
                              </span>
                            );
                          })}
                        </span>
                      );
                    }

                    return defaultChildren;
                  }
                : undefined}
          </SelectValuePart>
          <Icon name="chevronDown" />
        </SelectTrigger>
      </FieldLayout>
      <SelectPopover>
        <SelectListBox items={items}>{children}</SelectListBox>
      </SelectPopover>
    </SelectRoot>
  );
}

export const Select = Object.assign(SelectDefault, {
  Root: SelectRoot,
  ...fieldParts,
  Trigger: SelectTrigger,
  Value: SelectValuePart,
  Popover: SelectPopover,
  ListBox: SelectListBox,
});
