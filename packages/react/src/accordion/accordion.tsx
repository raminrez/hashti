"use client";

import type { ComponentProps } from "react";
import { join } from "@hashti/utils";
import {
  Accordion as UiAccordion,
  AccordionHeader as UiAccordionHeader,
  AccordionItem as UiAccordionItem,
  AccordionPanel as UiAccordionPanel,
  AccordionTrigger as UiAccordionTrigger,
} from "@ui-sdk/react/accordion";

function Accordion(props: ComponentProps<typeof UiAccordion>) {
  return (
    <UiAccordion
      {...props}
      className={join("hashti-accordion", props.className)}
    />
  );
}

function AccordionItem(props: ComponentProps<typeof UiAccordionItem>) {
  return (
    <UiAccordionItem
      {...props}
      className={join("hashti-accordion__item", props.className)}
    />
  );
}

function AccordionHeader(props: ComponentProps<typeof UiAccordionHeader>) {
  return (
    <UiAccordionHeader
      {...props}
      className={join("hashti-accordion__header", props.className)}
    />
  );
}

function AccordionTrigger(props: ComponentProps<typeof UiAccordionTrigger>) {
  return (
    <UiAccordionTrigger
      {...props}
      className={join("hashti-accordion__trigger", props.className)}
    />
  );
}

function AccordionPanel(props: ComponentProps<typeof UiAccordionPanel>) {
  return (
    <UiAccordionPanel
      {...props}
      className={join("hashti-accordion__panel", props.className)}
    />
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
};
