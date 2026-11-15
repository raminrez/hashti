"use client";

import type { Ref } from "react";
import {
  Calendar as RACCalendar,
  RangeCalendar as RACRangeCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell,
  Heading,
  DatePicker as RACDatePicker,
  DateRangePicker as RACDateRangePicker,
  DateSegment,
  DatePickerContext,
  DateRangePickerContext,
  type CalendarProps as RACCalendarProps,
  type RangeCalendarProps as RACRangeCalendarProps,
  type DatePickerProps as RACDatePickerProps,
  type DateRangePickerProps as RACDateRangePickerProps,
  type DateValue,
} from "react-aria-components";
import { Button } from "../button";
import { Icon } from "../../icons";
import { Popover, type PopoverProps } from "../popover";
import { Dialog } from "../dialog";
import {
  FieldLayout,
  FieldControl,
  FieldButton,
  FieldGroupDateInput,
  useFieldAnatomy,
  fieldClassName,
  fieldParts,
  type FieldContentProps,
  type FieldPresentationProps,
} from "../field";
import { classes, type ControlSize } from "../../utils";

function CalendarContent() {
  return (
    <>
      <div className="hashti-calendar-header">
        <Button variant="ghost" iconOnly size="md" slot="previous">
          <Icon name="chevronLeft" />
        </Button>
        <Heading />
        <Button variant="ghost" iconOnly size="md" slot="next">
          <Icon name="chevronRight" />
        </Button>
      </div>
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
      </CalendarGrid>
    </>
  );
}

export interface CalendarProps<T extends DateValue> extends RACCalendarProps<T> {
  ref?: Ref<HTMLDivElement>;
}
export function Calendar<T extends DateValue>({ className, children, ...props }: CalendarProps<T>) {
  return (
    <RACCalendar {...props} className={classes("hashti-calendar", className)}>
      {children ?? <CalendarContent />}
    </RACCalendar>
  );
}

export interface RangeCalendarProps<T extends DateValue> extends RACRangeCalendarProps<T> {
  ref?: Ref<HTMLDivElement>;
}
export function RangeCalendar<T extends DateValue>({
  className,
  children,
  ...props
}: RangeCalendarProps<T>) {
  return (
    <RACRangeCalendar
      {...props}
      className={classes("hashti-calendar hashti-range-calendar", className)}
    >
      {children ?? <CalendarContent />}
    </RACRangeCalendar>
  );
}

function DatePopover({ className, ...props }: PopoverProps) {
  return <Popover {...props} className={classes("hashti-date-popover", className)} />;
}

export interface DatePickerRootProps<T extends DateValue>
  extends RACDatePickerProps<T>, FieldPresentationProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

function DatePickerRoot<T extends DateValue>({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  ...props
}: DatePickerRootProps<T>) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    DatePickerContext,
  );
  return (
    <RACDatePicker<T>
      {...props}
      {...anatomy.props}
      data-size={size}
      className={classes(fieldClassName("date-picker"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children)}
    </RACDatePicker>
  );
}

export interface DatePickerProps<T extends DateValue>
  extends DatePickerRootProps<T>, FieldContentProps {}

function DatePickerDefault<T extends DateValue>({
  label,
  labelTooltip,
  description,
  errorMessage,
  children,
  className,
  size = "md",
  ...props
}: DatePickerProps<T>) {
  return (
    <DatePickerRoot<T> {...props} size={size} className={className}>
      {children ?? (
        <>
          <FieldLayout
            label={label}
            labelTooltip={labelTooltip}
            description={description}
            errorMessage={errorMessage}
          >
            <FieldControl>
              <FieldGroupDateInput>
                {(segment) => <DateSegment segment={segment} />}
              </FieldGroupDateInput>
              <FieldButton size={size}>
                <Icon name="calendar" />
              </FieldButton>
            </FieldControl>
          </FieldLayout>
          <DatePopover>
            <Dialog aria-label="Choose a date">
              <Calendar />
            </Dialog>
          </DatePopover>
        </>
      )}
    </DatePickerRoot>
  );
}

export const DatePicker = Object.assign(DatePickerDefault, {
  Root: DatePickerRoot,
  ...fieldParts,
  Input: FieldGroupDateInput,
  Segment: DateSegment,
  Control: FieldControl,
  Trigger: FieldButton,
  Popover: DatePopover,
  Calendar,
});

export interface DateRangePickerRootProps<T extends DateValue>
  extends RACDateRangePickerProps<T>, FieldPresentationProps {
  size?: ControlSize;
  ref?: Ref<HTMLDivElement>;
}

function DateRangePickerRoot<T extends DateValue>({
  size = "md",
  className,
  children,
  status,
  statusVariant,
  isOptional,
  ...props
}: DateRangePickerRootProps<T>) {
  const anatomy = useFieldAnatomy(
    { ...props, status, statusVariant, isOptional },
    DateRangePickerContext,
  );
  return (
    <RACDateRangePicker<T>
      {...props}
      {...anatomy.props}
      data-size={size}
      className={classes(fieldClassName("date-range-picker"), className)}
    >
      {anatomy.wrap(children, anatomy.slotted?.children)}
    </RACDateRangePicker>
  );
}

export interface DateRangePickerProps<T extends DateValue>
  extends DateRangePickerRootProps<T>, FieldContentProps {}

function DateRangePickerDefault<T extends DateValue>({
  label,
  labelTooltip,
  description,
  errorMessage,
  children,
  className,
  size = "md",
  ...props
}: DateRangePickerProps<T>) {
  return (
    <DateRangePickerRoot<T> {...props} size={size} className={className}>
      {children ?? (
        <>
          <FieldLayout
            label={label}
            labelTooltip={labelTooltip}
            description={description}
            errorMessage={errorMessage}
          >
            <FieldControl>
              <FieldGroupDateInput slot="start">
                {(segment) => <DateSegment segment={segment} />}
              </FieldGroupDateInput>
              <span aria-hidden="true">–</span>
              <FieldGroupDateInput slot="end">
                {(segment) => <DateSegment segment={segment} />}
              </FieldGroupDateInput>
              <FieldButton size={size}>
                <Icon name="calendar" />
              </FieldButton>
            </FieldControl>
          </FieldLayout>
          <DatePopover>
            <Dialog aria-label="Choose a date range">
              <RangeCalendar />
            </Dialog>
          </DatePopover>
        </>
      )}
    </DateRangePickerRoot>
  );
}

export const DateRangePicker = Object.assign(DateRangePickerDefault, {
  Root: DateRangePickerRoot,
  ...fieldParts,
  Input: FieldGroupDateInput,
  Segment: DateSegment,
  Control: FieldControl,
  Trigger: FieldButton,
  Popover: DatePopover,
  Calendar: RangeCalendar,
});
