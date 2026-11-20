"use client";

import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@hashti/react";

const events = [
  {
    title: "Order placed",
    time: "09:12",
    desc: "We received your order.",
    status: "complete",
  },
  {
    title: "Payment confirmed",
    time: "09:13",
    desc: "Card charged successfully.",
    status: "complete",
  },
  {
    title: "Shipped",
    time: "14:40",
    desc: "Your parcel left the warehouse.",
    status: "current",
  },
  {
    title: "Out for delivery",
    time: "Tomorrow",
    desc: "Expected before 18:00.",
    status: "upcoming",
  },
] as const;

export function TimelineDemo() {
  return (
    <Timeline style={{ maxWidth: 420 }}>
      {events.map((e) => (
        <TimelineItem key={e.title} status={e.status}>
          <TimelineMarker />
          <TimelineConnector />
          <TimelineTitle>{e.title}</TimelineTitle>
          <TimelineTime>{e.time}</TimelineTime>
          <TimelineDescription>{e.desc}</TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
