import { createContext, isValidElement, useContext, type ReactNode, type Ref } from "react";
import { useAgentSurface } from "@hashti/agent";
import {
  Button as RACButton,
  Link as RACLink,
  ToggleButton as RACToggleButton,
  ToggleButtonGroup as RACToggleButtonGroup,
  ProgressBar as RACProgressBar,
  composeRenderProps,
  type ButtonProps as RACButtonProps,
  type LinkProps as RACLinkProps,
  type ToggleButtonProps as RACToggleButtonProps,
  type ToggleButtonGroupProps as RACToggleButtonGroupProps,
} from "react-aria-components";
import { classes, type ControlSize } from "../../utils";
import { ToolbarContext } from "../toolbar/toolbar";

export type ButtonVariant =
  "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-tertiary" | "danger-ghost";
export interface ButtonProps extends RACButtonProps {
  /** Core choices: primary, secondary, ghost, danger. Additional existing variants remain supported. */
  variant?: ButtonVariant;
  /** Frame defaults to 44px; older themes default to 48px. Sizes are minimums. */
  size?: ControlSize;
  /** Square target for an icon. Supply an accessible name on the Button. */
  iconOnly?: boolean;
  /** Progress label announced alongside the action while pending. Localize both. */
  pendingLabel?: string;
  /** A sentence that tells an agent this action changes something; it waits for a person. */
  agentConfirm?: string;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = "primary",
  size: requestedSize,
  iconOnly = false,
  pendingLabel = "Pending",
  agentConfirm,
  className,
  children,
  ...props
}: ButtonProps) {
  const size = requestedSize === undefined ? "lg" : requestedSize;
  const toolbar = useContext(ToolbarContext);
  // Whitespace text is not a name: the Select trigger and icon-only slotted buttons render some.
  const label =
    (
      props["aria-label"] ??
      (typeof children === "function" ? undefined : textOf(children)) ??
      ""
    ).trim() || undefined;

  useAgentSurface({
    component: "button",
    label,
    actions:
      props.isDisabled || props.isPending
        ? {}
        : {
            press: () => {
              (props.onPress as (() => void) | undefined)?.();
              (props.onClick as (() => void) | undefined)?.();
            },
          },
    // An unnamed button is internal, like a Select's trigger: the Select surface owns it.
    mark: { confirm: agentConfirm, hidden: !label },
  });

  return (
    <RACButton
      {...props}
      data-slot="root"
      // A disabled Toolbar disables its actions, matching its presentation.
      isDisabled={props.isDisabled ?? toolbar.isDisabled}
      className={classes("hashti-button", className)}
      data-variant={variant}
      data-size={size}
      data-hashti-size-default={requestedSize === undefined ? "" : undefined}
      data-icon-only={iconOnly || undefined}
    >
      {composeRenderProps(children, (content, { isPending }) => (
        <>
          {content}
          {isPending && (
            <RACProgressBar className="hashti-spinner" isIndeterminate aria-label={pendingLabel} />
          )}
        </>
      ))}
    </RACButton>
  );
}

export interface LinkProps extends RACLinkProps {
  /** RAC renders an anchor with an enabled href, otherwise a span with link semantics. */
  ref?: Ref<HTMLAnchorElement>;
  /** Always underline links within prose; navigation behavior is unchanged. */
  inline?: boolean;
}
export function Link({ className, inline, ...props }: LinkProps) {
  return (
    <RACLink
      {...props}
      data-inline={inline || undefined}
      className={classes("hashti-link", className)}
    />
  );
}

export interface ToggleButtonProps extends RACToggleButtonProps {
  size?: ControlSize;
  ref?: Ref<HTMLButtonElement>;
}
const ContentSwitcherSizeContext = createContext<ControlSize>("md");

/** The text a person sees on a button, so an agent can name it without an aria-label. */
const textOf = (node: ReactNode): string =>
  typeof node === "string" || typeof node === "number"
    ? String(node)
    : Array.isArray(node)
      ? node.map(textOf).join(" ")
      : isValidElement<{ children?: ReactNode }>(node)
        ? textOf(node.props.children)
        : "";

export function ToggleButton({ className, size, ...props }: ToggleButtonProps) {
  const inheritedSize = useContext(ContentSwitcherSizeContext);
  return (
    <RACToggleButton
      {...props}
      data-size={size ?? inheritedSize}
      className={classes("hashti-toggle-button", className)}
    />
  );
}

export interface ContentSwitcherProps extends RACToggleButtonGroupProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}
export function ContentSwitcher({ className, size = "md", ...props }: ContentSwitcherProps) {
  return (
    <ContentSwitcherSizeContext.Provider value={size}>
      <RACToggleButtonGroup
        selectionMode="single"
        disallowEmptySelection
        {...props}
        data-size={size}
        className={classes("hashti-content-switcher", className)}
      />
    </ContentSwitcherSizeContext.Provider>
  );
}
