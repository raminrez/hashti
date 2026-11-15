"use client";

import { createContext, useContext, type ComponentProps, type ReactNode, type Ref } from "react";
import {
  Sheet as RACSheet,
  SheetBackdrop as RACSheetBackdrop,
  SheetContent as RACSheetContent,
  SheetOverlay as RACSheetOverlay,
  SheetTrigger as RACSheetTrigger,
  type SheetProps as RACSheetProps,
  type SheetRenderProps,
  type SheetBackdropProps as RACSheetBackdropProps,
  type SheetContentProps as RACSheetContentProps,
  type SheetOverlayProps as RACSheetOverlayProps,
  type SheetTriggerProps as RACSheetTriggerProps,
} from "react-aria-components";
import { useOverlayTheme } from "../../theme";
import { classes, cx } from "../../utils";

export interface SheetContextValue {
  position?: "bottom" | "top" | "left" | "right" | "start" | "end" | "center";
  preventDismissal?: boolean;
}

export const SheetContext = createContext<SheetContextValue>({
  position: "bottom",
});

export interface SheetOverlayProps extends RACSheetOverlayProps {
  ref?: Ref<HTMLDivElement>;
}

export function SheetOverlay({
  className,
  position = "bottom",
  preventDismissal,
  children,
  ref,
  ...props
}: SheetOverlayProps) {
  const { appearanceClassName, ...theme } = useOverlayTheme();

  return (
    <SheetContext.Provider value={{ position, preventDismissal }}>
      <RACSheetOverlay
        {...props}
        {...theme}
        ref={ref}
        position={position}
        preventDismissal={preventDismissal}
        className={classes(
          "react-aria-SheetOverlay hashti-sheet-overlay",
          classes(appearanceClassName ?? "", className),
        )}
      >
        {children}
      </RACSheetOverlay>
    </SheetContext.Provider>
  );
}

export interface SheetBackdropProps extends RACSheetBackdropProps {
  ref?: Ref<HTMLDivElement>;
}

export function SheetBackdrop({
  className,
  swipeAnimation = "sheet-backdrop",
  ref,
  ...props
}: SheetBackdropProps) {
  return (
    <RACSheetBackdrop
      {...props}
      ref={ref}
      swipeAnimation={swipeAnimation}
      className={classes("react-aria-SheetBackdrop hashti-sheet-backdrop", className)}
    />
  );
}

export interface SheetContentProps extends RACSheetContentProps {
  ref?: Ref<HTMLDivElement>;
}

export function SheetContent({ className, children, ref, ...props }: SheetContentProps) {
  return (
    <RACSheetContent
      {...props}
      ref={ref}
      className={cx("react-aria-SheetContent", "hashti-sheet-content", className)}
    >
      {children}
    </RACSheetContent>
  );
}

export interface SheetHandleProps extends ComponentProps<"div"> {
  ref?: Ref<HTMLDivElement>;
}

export function SheetHandle({ className, ...props }: SheetHandleProps) {
  return <div aria-hidden="true" {...props} className={cx("hashti-sheet-handle", className)} />;
}

export interface SheetRootProps extends RACSheetProps {
  ref?: Ref<HTMLDivElement>;
}

export function SheetRoot({
  className,
  children,
  overscrollPadding = false,
  stackAnimation = "sheet-scale-back",
  ref,
  ...props
}: SheetRootProps) {
  const { preventDismissal } = useContext(SheetContext);

  return (
    <RACSheet
      {...props}
      ref={ref}
      overscrollPadding={overscrollPadding}
      stackAnimation={stackAnimation}
      data-overscroll-padding={overscrollPadding || undefined}
      className={classes("react-aria-Sheet hashti-sheet", className)}
    >
      {(renderProps) => (
        <>
          {!preventDismissal && <SheetHandle />}
          {typeof children === "function" ? children(renderProps) : children}
        </>
      )}
    </RACSheet>
  );
}

export interface SheetTriggerProps extends RACSheetTriggerProps {
  children: ReactNode;
}

export function SheetTrigger(props: SheetTriggerProps) {
  return <RACSheetTrigger {...props} />;
}

export interface SheetConvenienceProps extends SheetOverlayProps {
  /** The contents of the sheet, rendered inside SheetContent. */
  children?: ReactNode;
  /**
   * Whether to add padding so the sheet appears to continue outside the viewport.
   *
   * Off by default: the padding is applied inside the sheet's box, so the clamped
   * `max-height`/`height` in `sheet.css` has to grow by one viewport to compensate.
   *
   * @default false
   */
  overscrollPadding?: boolean;
  /** Custom keyframe animation for swipe. */
  swipeAnimation?: string;
  /** Custom keyframe animation for sheet stacking. */
  stackAnimation?: string;
}

export type SheetProps = SheetConvenienceProps;
export type { SheetRenderProps };

export function SheetConvenience({
  children,
  snapPoints,
  overscrollPadding = false,
  swipeAnimation,
  stackAnimation = "sheet-scale-back",
  className,
  position = "bottom",
  preventDismissal,
  ...props
}: SheetConvenienceProps) {
  return (
    <SheetOverlay
      {...props}
      position={position}
      snapPoints={snapPoints}
      preventDismissal={preventDismissal}
      className={className}
    >
      <SheetBackdrop
        swipeAnimation="sheet-backdrop"
        swipeAnimationRange={snapPoints ? { start: snapPoints.length - 1 } : undefined}
      />
      <SheetRoot
        overscrollPadding={overscrollPadding}
        swipeAnimation={swipeAnimation}
        stackAnimation={stackAnimation}
      >
        <SheetContent>{children}</SheetContent>
      </SheetRoot>
    </SheetOverlay>
  );
}

export const Sheet = Object.assign(SheetConvenience, {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Overlay: SheetOverlay,
  Backdrop: SheetBackdrop,
  Content: SheetContent,
  Handle: SheetHandle,
});
