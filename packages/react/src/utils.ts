import { composeRenderProps, type ClassNameOrFunction } from "react-aria-components";

/** Keep RAC render-prop classes while always retaining the component's CSS hook. */
export function classes<T>(base: string, custom?: ClassNameOrFunction<T>): ClassNameOrFunction<T> {
  return composeRenderProps(custom, (value) => [base, value].filter(Boolean).join(" "));
}

/** Joins HTML class names cleanly. */
export function cx(...items: (string | undefined | null | false)[]): string {
  return items.filter(Boolean).join(" ");
}

/**
 * Joins static class hooks with a ui-sdk part's `className`, which may be a
 * string or a function of the part's state.
 */
export function uiClass<State>(
  custom: string | ((state: State) => string | undefined) | undefined,
  ...statics: (string | undefined)[]
): string | ((state: State) => string | undefined) {
  if (typeof custom === "function") {
    return (state: State) => cx(...statics, custom(state));
  }
  return cx(...statics, custom);
}

export type ControlSize = "sm" | "md" | "lg";
