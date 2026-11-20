"use client";

import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
} from "@hashti/react";

export function CalendarDemo() {
  return (
    <Calendar aria-label="Pick a date" style={{ maxWidth: 320 }}>
      <div className="hashti-calendar__header">
        <CalendarPrevious />
        <CalendarHeading />
        <CalendarNext />
      </div>
      <CalendarGrid>
        <CalendarWeekdays>
          {(index) => <CalendarWeekday index={index} />}
        </CalendarWeekdays>
        <CalendarWeeks>
          {(cell) => <CalendarDay value={cell.date} />}
        </CalendarWeeks>
      </CalendarGrid>
    </Calendar>
  );
}
