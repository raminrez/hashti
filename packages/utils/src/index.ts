// Framework-free TypeScript helpers shared by every wrapper package
// (@hashti/react today; future Vue/Svelte renderers keep using these verbatim).

/**
 * Prepends the Hashti class contract to a ui-sdk className prop. ui-sdk
 * classNames can be a string or a function of the part's state; both forms
 * must carry the wrapper's base class.
 */
export const join = <State,>(
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
