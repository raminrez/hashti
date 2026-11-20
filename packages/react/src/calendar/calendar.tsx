"use client"

import type { ComponentProps } from "react"
import {
  Calendar as UiCalendar,
  CalendarDay as UiCalendarDay,
  CalendarGrid as UiCalendarGrid,
  CalendarHeading as UiCalendarHeading,
  CalendarMonthSelect as UiCalendarMonthSelect,
  CalendarNext as UiCalendarNext,
  CalendarPrevious as UiCalendarPrevious,
  CalendarWeekday as UiCalendarWeekday,
  CalendarWeekdays as UiCalendarWeekdays,
  CalendarWeeks as UiCalendarWeeks,
  CalendarYearSelect as UiCalendarYearSelect,
} from "@ui-sdk/react/calendar"

const join = <State,>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined,
): string | ((state: State) => string | undefined) => {
  if (typeof className === "function") {
    return (state: State) => {
      const extra = className(state)
      return extra ? `${base} ${extra}` : base
    }
  }
  return className ? `${base} ${className}` : base
}

function Calendar(props: ComponentProps<typeof UiCalendar>) {
  return <UiCalendar {...props} className={join("hashti-calendar", props.className)} />
}

function CalendarHeading(props: ComponentProps<typeof UiCalendarHeading>) {
  return (
    <UiCalendarHeading
      {...props}
      className={join("hashti-calendar__heading", props.className)}
    />
  )
}

function CalendarPrevious(props: ComponentProps<typeof UiCalendarPrevious>) {
  return (
    <UiCalendarPrevious
      {...props}
      className={join("hashti-calendar__previous", props.className)}
    />
  )
}

function CalendarNext(props: ComponentProps<typeof UiCalendarNext>) {
  return (
    <UiCalendarNext
      {...props}
      className={join("hashti-calendar__next", props.className)}
    />
  )
}

function CalendarGrid(props: ComponentProps<typeof UiCalendarGrid>) {
  return (
    <UiCalendarGrid {...props} className={join("hashti-calendar__grid", props.className)} />
  )
}

function CalendarWeekdays(props: ComponentProps<typeof UiCalendarWeekdays>) {
  return (
    <UiCalendarWeekdays
      {...props}
      className={
        props.className
          ? `hashti-calendar__weekdays ${props.className}`
          : "hashti-calendar__weekdays"
      }
    />
  )
}

function CalendarWeekday(props: ComponentProps<typeof UiCalendarWeekday>) {
  return (
    <UiCalendarWeekday
      {...props}
      className={join("hashti-calendar__weekday", props.className)}
    />
  )
}

function CalendarWeeks(props: ComponentProps<typeof UiCalendarWeeks>) {
  return (
    <UiCalendarWeeks
      {...props}
      className={
        props.className ? `hashti-calendar__weeks ${props.className}` : "hashti-calendar__weeks"
      }
    />
  )
}

function CalendarDay(props: ComponentProps<typeof UiCalendarDay>) {
  return <UiCalendarDay {...props} className={join("hashti-calendar__day", props.className)} />
}

function CalendarMonthSelect(props: ComponentProps<typeof UiCalendarMonthSelect>) {
  return (
    <UiCalendarMonthSelect
      {...props}
      className={join("hashti-calendar__month-select", props.className)}
    />
  )
}

function CalendarYearSelect(props: ComponentProps<typeof UiCalendarYearSelect>) {
  return (
    <UiCalendarYearSelect
      {...props}
      className={join("hashti-calendar__year-select", props.className)}
    />
  )
}

export {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarMonthSelect,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
  CalendarYearSelect,
}
