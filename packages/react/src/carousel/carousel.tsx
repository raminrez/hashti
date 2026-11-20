"use client";

import type { ComponentProps } from "react";
import {
  Carousel as UiCarousel,
  CarouselContent as UiCarouselContent,
  CarouselIndicator as UiCarouselIndicator,
  CarouselIndicatorGroup as UiCarouselIndicatorGroup,
  CarouselItem as UiCarouselItem,
  CarouselNext as UiCarouselNext,
  CarouselPrevious as UiCarouselPrevious,
  CarouselViewport as UiCarouselViewport,
} from "@ui-sdk/react/carousel";

// ui-sdk className may also be a function of the part's state.
type ClassNameFn<S> = string | ((state: S) => string | undefined) | undefined;

function join<S>(base: string, className: ClassNameFn<S>): ClassNameFn<S> {
  const merge = (value?: string) => (value ? `${base} ${value}` : base);
  return typeof className === "function"
    ? (state: S) => merge(className(state))
    : merge(className);
}

function Carousel({ className, ...props }: ComponentProps<typeof UiCarousel>) {
  return (
    <UiCarousel className={join("hashti-carousel", className)} {...props} />
  );
}

function CarouselViewport({
  className,
  ...props
}: ComponentProps<typeof UiCarouselViewport>) {
  return (
    <UiCarouselViewport
      className={join("hashti-carousel-viewport", className)}
      {...props}
    />
  );
}

function CarouselContent({
  className,
  ...props
}: ComponentProps<typeof UiCarouselContent>) {
  return (
    <UiCarouselContent
      className={join("hashti-carousel-content", className)}
      {...props}
    />
  );
}

function CarouselItem({
  className,
  ...props
}: ComponentProps<typeof UiCarouselItem>) {
  return (
    <UiCarouselItem
      className={join("hashti-carousel-item", className)}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  ...props
}: ComponentProps<typeof UiCarouselPrevious>) {
  return (
    <UiCarouselPrevious
      className={join("hashti-carousel-arrow", className)}
      {...props}
    />
  );
}

function CarouselNext({
  className,
  ...props
}: ComponentProps<typeof UiCarouselNext>) {
  return (
    <UiCarouselNext
      className={join("hashti-carousel-arrow", className)}
      {...props}
    />
  );
}

function CarouselIndicatorGroup({
  className,
  ...props
}: ComponentProps<typeof UiCarouselIndicatorGroup>) {
  return (
    <UiCarouselIndicatorGroup
      className={join("hashti-carousel-indicators", className)}
      {...props}
    />
  );
}

function CarouselIndicator({
  className,
  ...props
}: ComponentProps<typeof UiCarouselIndicator>) {
  return (
    <UiCarouselIndicator
      className={join("hashti-carousel-indicator", className)}
      {...props}
    />
  );
}

export {
  Carousel,
  CarouselViewport,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselIndicatorGroup,
  CarouselIndicator,
};
