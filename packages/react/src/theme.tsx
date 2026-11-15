import { createContext, useContext, useMemo, type ComponentPropsWithRef } from "react";
import { I18nProvider, useLocale } from "react-aria-components";
import { nextLayer, type LayerLevel, type ThemeName } from "@hashti/tokens";

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
  /** Controls formatting, translated RAC labels, and reading/keyboard direction. */
  locale?: string;
  /** Explicit reading/keyboard direction override. */
  direction?: "ltr" | "rtl";
  dir?: "ltr" | "rtl";
  /** Portable root/portal recipe. Omit to inherit; a string replaces it; "" clears it. */
  appearanceClassName?: string;
}

export function Theme({ locale, direction, dir, ...props }: ThemeProps) {
  const inherited = useLocale();
  const explicitDir = direction ?? dir;
  return (
    <I18nProvider locale={locale ?? (explicitDir === "rtl" ? "ar-EG" : inherited.locale)}>
      <ThemeRoot explicitDirection={explicitDir} {...props} />
    </I18nProvider>
  );
}

function ThemeRoot({
  theme,
  appearanceClassName,
  className,
  children,
  explicitDirection,
  ...props
}: Omit<ThemeProps, "locale" | "direction" | "dir"> & { explicitDirection?: "ltr" | "rtl" }) {
  const parent = useContext(ThemeContext);
  const { locale, direction: ariaDirection } = useLocale();
  const direction = explicitDirection ?? ariaDirection ?? parent?.direction ?? "ltr";
  const resolvedTheme = theme ?? parent?.theme ?? "frame-light";
  const appearance = appearanceClassName ?? parent?.appearanceClassName;
  const lang = props.lang ?? locale ?? parent?.lang;
  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      layer: 0 as const,
      direction,
      lang,
      appearanceClassName: appearance,
    }),
    [resolvedTheme, direction, lang, appearance],
  );
  return (
    <ThemeContext.Provider value={value}>
      <div
        {...props}
        lang={lang}
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
