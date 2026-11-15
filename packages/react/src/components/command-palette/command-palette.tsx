"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  isValidElement,
  type ChangeEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  Autocomplete,
  Input as RACInput,
  TextField as RACTextField,
  type Key,
} from "react-aria-components";
import { Modal, type ModalProps } from "../modal";
import { Dialog } from "../dialog";
import { Button } from "../button";
import { ListBox, type ListBoxItemProps } from "../list-box";
import { Kbd } from "../kbd";
import { Icon } from "../../icons";
import { classes, cx } from "../../utils";

export interface CommandPaletteContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  closeOnSelect: boolean;
}

export const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPaletteContext(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("CommandPalette subcomponents must be used within CommandPalette.Root");
  }
  return ctx;
}

export interface CommandPaletteRootProps {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  enableShortcut?: boolean;
  shortcutKey?: string;
  closeOnSelect?: boolean;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  children?: ReactNode;
}

export function CommandPaletteRoot({
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  enableShortcut = true,
  shortcutKey = "k",
  closeOnSelect = true,
  query: controlledQuery,
  defaultQuery = "",
  onQueryChange,
  children,
}: CommandPaletteRootProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = useCallback(
    (nextOpen: boolean | ((prev: boolean) => boolean)) => {
      const value = typeof nextOpen === "function" ? nextOpen(isOpen) : nextOpen;
      onOpenChange?.(value);
      if (controlledIsOpen === undefined) setUncontrolledIsOpen(value);
    },
    [controlledIsOpen, isOpen, onOpenChange],
  );

  const [uncontrolledQuery, setUncontrolledQuery] = useState(defaultQuery);
  const query = controlledQuery !== undefined ? controlledQuery : uncontrolledQuery;

  const setQuery = useCallback(
    (nextQuery: string) => {
      if (controlledQuery === undefined) {
        setUncontrolledQuery(nextQuery);
      }
      onQueryChange?.(nextQuery);
    },
    [controlledQuery, onQueryChange],
  );

  useEffect(() => {
    if (!enableShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut, shortcutKey, setIsOpen]);

  return (
    <CommandPaletteContext.Provider
      value={{
        isOpen,
        setIsOpen,
        query,
        setQuery,
        closeOnSelect,
      }}
    >
      {children}
    </CommandPaletteContext.Provider>
  );
}

export interface CommandPaletteDialogProps extends Omit<ModalProps, "children"> {
  children: ReactNode;
  "aria-label"?: string;
  dialogClassName?: string;
  /** Hides the dialog's close button. */
  hideCloseButton?: boolean;
}

export function CommandPaletteDialog({
  children,
  className,
  overlayClassName,
  dialogClassName,
  "aria-label": ariaLabel = "Command Palette",
  hideCloseButton = false,
  ref,
  ...props
}: CommandPaletteDialogProps) {
  const { isOpen, setIsOpen } = useCommandPaletteContext();

  return (
    <Modal
      {...props}
      ref={ref}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      overlayClassName={classes("hashti-command-palette-overlay", overlayClassName)}
      className={classes("hashti-command-palette-modal", className)}
    >
      <Dialog
        aria-label={ariaLabel}
        className={cx("hashti-command-palette-dialog", dialogClassName)}
      >
        {/* Autocomplete owns the arrow keys and the filtering between the input and the list. */}
        <Autocomplete>{children}</Autocomplete>
        {!hideCloseButton && (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label="Close command palette"
            className="hashti-command-palette__close"
            onPress={() => setIsOpen(false)}
          >
            <Icon name="close" />
          </Button>
        )}
      </Dialog>
    </Modal>
  );
}
CommandPaletteDialog.displayName = "CommandPaletteDialog";

export interface CommandPaletteInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  autoFocus?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function CommandPaletteInput({
  placeholder = "Type a command or search...",
  value: propValue,
  onChange,
  className,
  autoFocus = true,
  ref,
}: CommandPaletteInputProps) {
  const { query, setQuery } = useCommandPaletteContext();
  const currentQuery = propValue !== undefined ? propValue : query;
  const inputRef = useRef<HTMLInputElement>(null);

  // Focused imperatively rather than with autoFocus: the palette mounts on every open, and
  // autoFocus on a component input trips the a11y lint rule for sighted users.
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <RACTextField
      value={currentQuery}
      onChange={setQuery}
      className={cx("hashti-command-palette__input-wrapper", className)}
    >
      <span className="hashti-command-palette__search-icon" aria-hidden="true">
        <Icon name="search" size={16} />
      </span>
      <RACInput
        ref={(node: HTMLInputElement | null) => {
          inputRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
        }}
        type="search"
        aria-label="Search commands"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
        onChange={onChange}
        className="hashti-command-palette__input"
      />
      {currentQuery ? (
        <button
          type="button"
          aria-label="Clear search"
          className="hashti-command-palette__clear"
          onClick={() => setQuery("")}
        >
          <Icon name="close" size={16} />
        </button>
      ) : (
        <Kbd keys={["esc"]} className="hashti-command-palette__input-kbd" />
      )}
    </RACTextField>
  );
}

export interface CommandPaletteListProps<T extends object = object> {
  children?: ReactNode;
  className?: string;
  items?: Iterable<T>;
  onAction?: (key: Key) => void;
  emptyContent?: ReactNode;
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

export function CommandPaletteList<T extends object = object>({
  children,
  className,
  items,
  onAction,
  emptyContent,
  "aria-label": ariaLabel = "Commands",
  ref,
}: CommandPaletteListProps<T>) {
  const { closeOnSelect, setIsOpen } = useCommandPaletteContext();

  return (
    <ListBox.Root<T>
      ref={ref}
      aria-label={ariaLabel}
      items={items}
      selectionMode="single"
      variant="flat"
      emptyContent={emptyContent}
      onAction={(key) => {
        onAction?.(key);
        if (closeOnSelect) {
          setIsOpen(false);
        }
      }}
      className={cx("hashti-command-palette__list", className)}
    >
      {children}
    </ListBox.Root>
  );
}

export interface CommandPaletteGroupProps {
  heading?: ReactNode;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function CommandPaletteGroup({
  heading,
  title,
  children,
  className,
}: CommandPaletteGroupProps) {
  const headerContent = heading ?? title;

  return (
    <ListBox.Section className={cx("hashti-command-palette__group", className)}>
      {headerContent && (
        <ListBox.Header className="hashti-command-palette__group-header">
          {headerContent}
        </ListBox.Header>
      )}
      {children}
    </ListBox.Section>
  );
}

export interface CommandPaletteItemProps<T extends object = object> extends Omit<
  ListBoxItemProps<T>,
  "children" | "onAction"
> {
  icon?: ReactNode;
  shortcut?: string | string[];
  addon?: ReactNode;
  description?: ReactNode;
  onAction?: () => void;
  onSelect?: () => void;
  children?: ReactNode;
}

export function CommandPaletteItem<T extends object = object>({
  icon,
  shortcut,
  addon,
  description,
  onAction,
  onSelect,
  children,
  className,
  ...props
}: CommandPaletteItemProps<T>) {
  const { closeOnSelect, setIsOpen } = useCommandPaletteContext();

  const handleAction = () => {
    onAction?.();
    onSelect?.();
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const resolvedClassName =
    typeof className === "function"
      ? (values: any) => cx("hashti-command-palette__item", className(values))
      : cx("hashti-command-palette__item", className);

  return (
    <ListBox.Item {...props} onAction={handleAction} className={resolvedClassName}>
      <div className="hashti-command-palette__item-content">
        {icon && <span className="hashti-command-palette__item-icon">{icon}</span>}
        <div className="hashti-command-palette__item-text">
          <span className="hashti-command-palette__item-title">{children}</span>
          {description && <span className="hashti-command-palette__item-desc">{description}</span>}
        </div>
      </div>
      {(shortcut || addon) && (
        <div className="hashti-command-palette__item-extra">
          {addon}
          {shortcut && <Kbd keys={shortcut} className="hashti-command-palette__kbd" />}
        </div>
      )}
    </ListBox.Item>
  );
}

export interface CommandPaletteEmptyProps {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}

export function CommandPaletteEmpty({
  children,
  className,
  icon,
  title,
  description,
}: CommandPaletteEmptyProps) {
  if (children) {
    return <div className={cx("hashti-command-palette__empty", className)}>{children}</div>;
  }

  return (
    <div className={cx("hashti-command-palette__empty", className)}>
      <div className="hashti-command-palette__empty-icon" aria-hidden="true">
        {icon ?? <Icon name="search" size={24} />}
      </div>
      <div className="hashti-command-palette__empty-title">{title ?? "No results found"}</div>
      {description && <div className="hashti-command-palette__empty-desc">{description}</div>}
    </div>
  );
}

export interface CommandPaletteFooterProps {
  children?: ReactNode;
  className?: string;
}

export function CommandPaletteFooter({ children, className }: CommandPaletteFooterProps) {
  if (children) {
    return <footer className={cx("hashti-command-palette__footer", className)}>{children}</footer>;
  }

  return (
    <footer className={cx("hashti-command-palette__footer", className)}>
      <div className="hashti-command-palette__shortcut-item">
        <Kbd keys={["up", "down"]} />
        <span>Navigate</span>
      </div>
      <div className="hashti-command-palette__shortcut-item">
        <Kbd keys={["enter"]} />
        <span>Select</span>
      </div>
      <div className="hashti-command-palette__shortcut-item">
        <Kbd keys={["escape"]} />
        <span>Dismiss</span>
      </div>
    </footer>
  );
}

export interface CommandPaletteProps extends CommandPaletteRootProps {
  placeholder?: string;
  emptyContent?: ReactNode;
  footer?: ReactNode;
  dialogClassName?: string;
}

function CommandPaletteDefault({
  isOpen,
  defaultOpen,
  onOpenChange,
  enableShortcut = true,
  shortcutKey = "k",
  closeOnSelect = true,
  query,
  defaultQuery,
  onQueryChange,
  placeholder,
  emptyContent,
  footer,
  dialogClassName,
  children,
  ...props
}: CommandPaletteProps) {
  const hasDialog =
    isValidElement(children) &&
    (children.type === CommandPaletteDialog ||
      (children.type as any)?.displayName === "CommandPaletteDialog");

  return (
    <CommandPaletteRoot
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      enableShortcut={enableShortcut}
      shortcutKey={shortcutKey}
      closeOnSelect={closeOnSelect}
      query={query}
      defaultQuery={defaultQuery}
      onQueryChange={onQueryChange}
    >
      {hasDialog ? (
        children
      ) : (
        <CommandPaletteDialog className={dialogClassName} {...props}>
          {children}
        </CommandPaletteDialog>
      )}
    </CommandPaletteRoot>
  );
}

export const CommandPalette = Object.assign(CommandPaletteDefault, {
  Root: CommandPaletteRoot,
  Dialog: CommandPaletteDialog,
  Input: CommandPaletteInput,
  List: CommandPaletteList,
  Group: CommandPaletteGroup,
  Item: CommandPaletteItem,
  Empty: CommandPaletteEmpty,
  Footer: CommandPaletteFooter,
  Kbd,
});
