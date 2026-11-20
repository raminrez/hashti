"use client";

import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@hashti/react";

const slides = ["First slide", "Second slide", "Third slide"];

export function CarouselDemo() {
  return (
    <Carousel aria-label="Highlights" style={{ maxWidth: 480 }}>
      <CarouselViewport>
        <CarouselContent>
          {slides.map((s, i) => (
            <CarouselItem key={s}>
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  blockSize: 160,
                  background: "var(--hashti-layer-03)",
                  borderRadius: "var(--hashti-popover-radius)",
                  fontSize: "0.875rem",
                }}
              >
                {s} {i + 1}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CarouselPrevious aria-label="Previous slide">
          <ChevLeft />
        </CarouselPrevious>
        <CarouselIndicatorGroup aria-label="Choose a slide">
          {slides.map((s, i) => (
            <CarouselIndicator
              key={s}
              page={i + 1}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </CarouselIndicatorGroup>
        <CarouselNext aria-label="Next slide">
          <ChevRight />
        </CarouselNext>
      </div>
    </Carousel>
  );
}

function ChevLeft() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="m10 3-5 5 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevRight() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="m6 3 5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
