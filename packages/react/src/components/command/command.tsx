"use client";

import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  Command as UiSdkCommand,
  CommandEmpty as UiSdkCommandEmpty,
  CommandGroup as UiSdkCommandGroup,
  CommandGroupLabel,
  CommandInput as UiSdkCommandInput,
  CommandItem as UiSdkCommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList as UiSdkCommandList,
  CommandPage,
  CommandSeparator,
  CommandShortcut,
  CommandStatus,
  createCommandController,
  type CommandItemState,
} from "@ui-sdk/react/command";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogClose,
  type DialogRootProps,
} from "../dialog";
import { Button } from "../button";
import { Kbd } from "../kbd";
import { Icon } from "../../icons";
import { cx, uiClass } from "../../utils";

export interface CommandContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Close the dialog after a command runs. */
  closeOnSelect: boolean;
}

export const CommandContext = createContext<CommandContextValue | null>(null);

export function useCommandContext(): CommandContextValue {
  const ctx = useContext(CommandContext);
  if (!ctx) {
    throw new Error("Command subcomponents must be used within Command.Root");
  }
  return ctx;
}

export interface CommandRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Listen for the global shortcut (⌘K / Ctrl+K by default) that toggles the palette. */
  enableShortcut?: boolean;
  shortcutKey?: string;
  closeOnSelect?: boolean;
  children?: ReactNode;
}

export function CommandRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  enableShortcut = true,
  shortcutKey = "k",
  closeOnSelect = true,
  children,
}: CommandRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const value = typeof next === "function" ? next(open) : next;
      onOpenChange?.(value);
      if (controlledOpen === undefined) setUncontrolledOpen(value);
    },
    [controlledOpen, open, onOpenChange],
  );

  useEffect(() => {
    if (!enableShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        handleOpenChange((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut, shortcutKey, handleOpenChange]);

  return (
    <CommandContext.Provider value={{ open, onOpenChange: handleOpenChange, closeOnSelect }}>
      {children}
    </CommandContext.Provider>
  );
}

export interface CommandDialogProps
  extends Omit<DialogRootProps, "children" | "open" | "onOpenChange" | "controller">,
    Omit<ComponentProps<typeof UiSdkCommand>, "children" | "onAction"> {
  children: ReactNode;
  "aria-label"?: string;
  /** Class names for the dialog content surface. */
  className?: string;
  dialogClassName?: string;
  /** Hides the dialog's close button. */
  hideCloseButton?: boolean;
  /** Runs when a command runs; the dialog closes after it when `closeOnSelect` is set. */
  onAction?: ComponentProps<typeof UiSdkCommand>["onAction"];
}

/**
 * The palette surface: a ui-sdk Command inside the Hashti Dialog. The Command
 * props (`query`, `onQueryChange`, `filter`, `items`, …) pass straight through.
 */
export function CommandDialog({
  children,
  className,
  dialogClassName,
  "aria-label": ariaLabel = "Command palette",
  hideCloseButton = false,
  onAction,
  ...props
}: CommandDialogProps) {
  const { open, onOpenChange, closeOnSelect } = useCommandContext();

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogBackdrop className="hashti-command-palette-overlay" />
      <DialogContent
        className={cx("hashti-command-palette-modal hashti-command-palette-dialog", className, dialogClassName)}
        aria-label={ariaLabel}
      >
        <UiSdkCommand
          {...props}
          onAction={(value, details) => {
            const result = onAction?.(value, details);
            if (closeOnSelect) onOpenChange(false);
            return result;
          }}
        >
          {children}
        </UiSdkCommand>
        {!hideCloseButton && (
          <DialogClose
            className="hashti-command-palette__close"
            render={<Button variant="ghost" size="sm" iconOnly aria-label="Close command palette" />}
          >
            <Icon name="close" />
          </DialogClose>
        )}
      </DialogContent>
    </DialogRoot>
  );
}
CommandDialog.displayName = "CommandDialog";

export type CommandInputProps = ComponentProps<typeof UiSdkCommandInput>;

export function CommandInput({
  placeholder = "Type a command or search...",
  className,
  ...props
}: CommandInputProps) {
  return (
    <div className="hashti-command-palette__input-wrapper">
      <span className="hashti-command-palette__search-icon" aria-hidden="true">
        <Icon name="search" size={16} />
      </span>
      <UiSdkCommandInput
        type="search"
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        {...props}
        className={uiClass(className as never, "hashti-command-palette__input")}
      />
    </div>
  );
}

export type CommandListProps = ComponentProps<typeof UiSdkCommandList>;

export function CommandList({ className, children, ...props }: CommandListProps) {
  return (
    <UiSdkCommandList
      {...props}
      className={uiClass(className as never, "hashti-command-palette__list")}
    >
      {children}
    </UiSdkCommandList>
  );
}

export interface CommandGroupProps
  extends Omit<ComponentProps<typeof UiSdkCommandGroup>, "children" | "title"> {
  heading?: ReactNode;
  children?: ReactNode;
}

export function CommandGroup({ heading, className, children, ...props }: CommandGroupProps) {
  return (
    <UiSdkCommandGroup
      {...props}
      className={uiClass(className as string | undefined, "hashti-command-palette__group")}
    >
      {heading != null && (
        <CommandGroupLabel className="hashti-command-palette__group-header">
          {heading}
        </CommandGroupLabel>
      )}
      {children}
    </UiSdkCommandGroup>
  );
}

export interface CommandItemProps
  extends Omit<ComponentProps<typeof UiSdkCommandItem>, "children"> {
  icon?: ReactNode;
  /** Shown as a Kbd hint; for a working shortcut pass ui-sdk's `shortcut` string too. */
  shortcutKeys?: string | string[];
  addon?: ReactNode;
  description?: ReactNode;
  children?: ReactNode | ((state: CommandItemState) => ReactNode);
}

export function CommandItem({
  icon,
  shortcutKeys,
  addon,
  description,
  children,
  className,
  ...props
}: CommandItemProps) {
  return (
    <UiSdkCommandItem
      {...props}
      className={uiClass(
        className as string | ((state: CommandItemState) => string | undefined) | undefined,
        "hashti-command-palette__item",
      )}
    >
      {(state: CommandItemState) => (
        <>
          <div className="hashti-command-palette__item-content">
            {icon && <span className="hashti-command-palette__item-icon">{icon}</span>}
            <div className="hashti-command-palette__item-text">
              <span className="hashti-command-palette__item-title">
                {typeof children === "function" ? children(state) : children}
              </span>
              {description && (
                <span className="hashti-command-palette__item-desc">{description}</span>
              )}
            </div>
          </div>
          {(shortcutKeys || addon) && (
            <div className="hashti-command-palette__item-extra">
              {addon}
              {shortcutKeys && <Kbd keys={shortcutKeys} className="hashti-command-palette__kbd" />}
            </div>
          )}
        </>
      )}
    </UiSdkCommandItem>
  );
}

export interface CommandEmptyProps
  extends Omit<ComponentProps<typeof UiSdkCommandEmpty>, "children" | "title"> {
  children?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}

export function CommandEmpty({
  children,
  className,
  icon,
  title,
  description,
  ...props
}: CommandEmptyProps) {
  return (
    <UiSdkCommandEmpty
      {...props}
      className={uiClass(className as never, "hashti-command-palette__empty")}
    >
      {children ?? (
        <>
          <div className="hashti-command-palette__empty-icon" aria-hidden="true">
            {icon ?? <Icon name="search" size={24} />}
          </div>
          <div className="hashti-command-palette__empty-title">{title ?? "No results found"}</div>
          {description && <div className="hashti-command-palette__empty-desc">{description}</div>}
        </>
      )}
    </UiSdkCommandEmpty>
  );
}

export interface CommandFooterProps {
  children?: ReactNode;
  className?: string;
}

export function CommandFooter({ children, className }: CommandFooterProps) {
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

export interface CommandPaletteProps
  extends CommandRootProps,
    Omit<ComponentProps<typeof UiSdkCommand>, "children" | "onAction"> {
  "aria-label"?: string;
  className?: string;
  dialogClassName?: string;
  hideCloseButton?: boolean;
  onAction?: ComponentProps<typeof UiSdkCommand>["onAction"];
  children?: ReactNode;
}

/**
 * The one-call palette: root state plus the dialog surface. Render
 * `Command.Dialog` yourself as the only child to compose your own surface.
 */
function CommandDefault({
  open,
  defaultOpen,
  onOpenChange,
  enableShortcut = true,
  shortcutKey = "k",
  closeOnSelect = true,
  children,
  ...props
}: CommandPaletteProps) {
  const hasDialog =
    isValidElement(children) &&
    (children.type === CommandDialog ||
      (children.type as { displayName?: string })?.displayName === "CommandDialog");

  return (
    <CommandRoot
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      enableShortcut={enableShortcut}
      shortcutKey={shortcutKey}
      closeOnSelect={closeOnSelect}
    >
      {hasDialog ? children : <CommandDialog {...props}>{children}</CommandDialog>}
    </CommandRoot>
  );
}

interface CommandCompound {
  (props: CommandPaletteProps): ReactNode;
  Root: typeof CommandRoot;
  Dialog: typeof CommandDialog;
  Input: typeof CommandInput;
  List: typeof CommandList;
  Group: typeof CommandGroup;
  Item: typeof CommandItem;
  Empty: typeof CommandEmpty;
  Footer: typeof CommandFooter;
  Page: typeof CommandPage;
  Separator: typeof CommandSeparator;
  Shortcut: typeof CommandShortcut;
  Status: typeof CommandStatus;
  ItemText: typeof CommandItemText;
  ItemIcon: typeof CommandItemIcon;
  Kbd: typeof Kbd;
}

export const Command: CommandCompound = Object.assign(CommandDefault, {
  Root: CommandRoot,
  Dialog: CommandDialog,
  Input: CommandInput,
  List: CommandList,
  Group: CommandGroup,
  Item: CommandItem,
  Empty: CommandEmpty,
  Footer: CommandFooter,
  Page: CommandPage,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
  Status: CommandStatus,
  ItemText: CommandItemText,
  ItemIcon: CommandItemIcon,
  Kbd,
});

export { createCommandController };
