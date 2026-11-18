import { createContext, useContext, useMemo, type ComponentPropsWithRef } from "react";
import { nextLayer, type LayerLevel, type ThemeName } from "@hashti/styles/tokens";

type ThemeContextValue = {
  theme: ThemeName;
  layer: LayerLevel;
  direction: "ltr" | "rtl";
  lang?: string;
  appearanceClassName?: string;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProps extends ComponentPropsWithRef<"div"> {
  theme?: ThemeName;
  /** Explicit reading/keyboard direction. ui-sdk reads direction from the DOM. */
  dir?: "ltr" | "rtl";
  /** BCP 47 language tag stamped on the root element. */
  lang?: string;
  /** Portable root/portal recipe. Omit to inherit; a string replaces it; "" clears it. */
  appearanceClassName?: string;
}

export function Theme({
  theme,
  dir,
  lang,
  appearanceClassName,
  className,
  children,
  ...props
}: ThemeProps) {
  const parent = useContext(ThemeContext);
  const resolvedTheme = theme ?? parent?.theme ?? "frame-light";
  const direction = dir ?? parent?.direction ?? "ltr";
  const resolvedLang = lang ?? parent?.lang;
  const appearance = appearanceClassName ?? parent?.appearanceClassName;
  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      layer: 0 as const,
      direction,
      lang: resolvedLang,
      appearanceClassName: appearance,
    }),
    [resolvedTheme, direction, resolvedLang, appearance],
  );
  return (
    <ThemeContext.Provider value={value}>
      <div
        {...props}
        lang={resolvedLang}
        dir={direction}
        data-hashti-theme={resolvedTheme}
        data-hashti-layer="0"
        className={["hashti-theme", appearance, className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export interface LayerProps extends ComponentPropsWithRef<"div"> {
  level?: LayerLevel;
}

export function Layer({ level, className, children, ...props }: LayerProps) {
  const parent = useTheme();
  const layer = level ?? nextLayer(parent.layer);
  const value = useMemo(() => ({ ...parent, layer }), [parent, layer]);
  return (
    <ThemeContext.Provider value={value}>
      <div
        {...props}
        data-hashti-layer={layer}
        className={["hashti-layer", className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  return (
    context ?? {
      theme: "frame-light",
      layer: 0,
      direction: "ltr",
    }
  );
}

/** CSS inheritance stops at a portal; React context does not. */
export function useOverlayTheme() {
  const { theme, layer, direction, lang, appearanceClassName } = useTheme();
  return {
    "data-hashti-theme": theme,
    "data-hashti-layer": layer,
    dir: direction,
    lang,
    appearanceClassName,
  };
}
