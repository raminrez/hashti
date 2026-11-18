"use client";

import {
  createContext,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  Accordion as UiSdkAccordion,
  AccordionHeader as UiSdkAccordionHeader,
  AccordionItem as UiSdkAccordionItem,
  AccordionPanel as UiSdkAccordionPanel,
  AccordionTrigger as UiSdkAccordionTrigger,
  type AccordionItemState,
  type AccordionState,
} from "@ui-sdk/react/accordion";
import { Icon } from "../../icons";
import { uiClass, type ControlSize } from "../../utils";

type AccordionClass<State> = string | ((state: State) => string | undefined);

export type AccordionVariant = "default" | "card" | "flush";

interface AccordionConfig {
  size: ControlSize;
  variant: AccordionVariant;
}

const AccordionConfigContext = createContext<AccordionConfig>({
  size: "md",
  variant: "default",
});

export interface AccordionProps<T extends string = string>
  extends Omit<ComponentProps<typeof UiSdkAccordion<T>>, "className" | "children"> {
  size?: ControlSize;
  /** `default` divides rows with hairlines, `card` boxes each item, `flush` strips all chrome. */
  variant?: AccordionVariant;
  className?: AccordionClass<AccordionState<T>>;
  children?: ReactNode;
}

export function AccordionRoot<T extends string = string>({
  size = "md",
  variant = "default",
  className,
  children,
  ...props
}: AccordionProps<T>) {
  return (
    <AccordionConfigContext.Provider value={{ size, variant }}>
      <UiSdkAccordion<T>
        {...props}
        className={uiClass(className, "hashti-accordion")}
        data-size={size}
        data-variant={variant}
      >
        {children}
      </UiSdkAccordion>
    </AccordionConfigContext.Provider>
  );
}

export interface AccordionItemProps
  extends Omit<ComponentProps<typeof UiSdkAccordionItem>, "className" | "children"> {
  className?: AccordionClass<AccordionItemState>;
  children?: ReactNode;
}

export function AccordionItem({ className, children, ...props }: AccordionItemProps) {
  const { variant } = useContext(AccordionConfigContext);
  return (
    <UiSdkAccordionItem
      {...props}
      className={uiClass(className, "hashti-accordion-item")}
      data-variant={variant}
    >
      {children}
    </UiSdkAccordionItem>
  );
}

export interface AccordionHeaderProps
  extends Omit<ComponentProps<typeof UiSdkAccordionHeader>, "className" | "children"> {
  /** Heading level (1–6); the header renders `h3` by default. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: AccordionClass<AccordionItemState>;
  children?: ReactNode;
}

export function AccordionHeader({
  headingLevel,
  className,
  children,
  render,
  ...props
}: AccordionHeaderProps) {
  const heading = render ?? (headingLevel ? (() => {
    const HeadingTag = `h${headingLevel}` as "h1";
    return <HeadingTag />;
  })() : undefined);
  return (
    <UiSdkAccordionHeader
      {...props}
      render={heading}
      className={uiClass(className, "hashti-accordion-header")}
    >
      {children}
    </UiSdkAccordionHeader>
  );
}

export interface AccordionTriggerProps
  extends Omit<ComponentProps<typeof UiSdkAccordionTrigger>, "className" | "children"> {
  className?: AccordionClass<AccordionItemState>;
  children?: ReactNode;
}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const { size } = useContext(AccordionConfigContext);
  return (
    <UiSdkAccordionTrigger
      {...props}
      className={uiClass(className, "hashti-accordion-trigger")}
      data-size={size}
    >
      {children}
    </UiSdkAccordionTrigger>
  );
}

export interface AccordionIndicatorProps extends ComponentProps<"span"> {
  children?: ReactNode;
}

/** Chevron icon that points right and rotates down while its item is open. */
export function AccordionIndicator({ children, className, ...props }: AccordionIndicatorProps) {
  return (
    <span aria-hidden="true" {...props} className={uiClass(className, "hashti-accordion-indicator") as string}>
      {children ?? <Icon name="chevronRight" />}
    </span>
  );
}

export interface AccordionPanelProps
  extends Omit<ComponentProps<typeof UiSdkAccordionPanel>, "className" | "children" | "style"> {
  className?: AccordionClass<AccordionItemState>;
  style?: CSSProperties | ((state: AccordionItemState) => CSSProperties | undefined);
  children?: ReactNode;
}

export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  return (
    <UiSdkAccordionPanel {...props} className={uiClass(className, "hashti-accordion-panel")}>
      <div className="hashti-accordion-panel-inner">{children}</div>
    </UiSdkAccordionPanel>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Indicator: AccordionIndicator,
  Panel: AccordionPanel,
});

export { AccordionConfigContext };
