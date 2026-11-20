"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
} from "react";

type ResolvedTheme = "light" | "dark";

type OverlayTheme = { container: HTMLDivElement | null };

const ThemeContext = createContext<OverlayTheme | null>(null);

/**
 * The themed container of the nearest `<Theme>`, or null outside one. Overlay
 * wrappers pass it as their ui-sdk part's `container` so portals render inside
 * the themed subtree instead of `document.body`.
 */
function useOverlayTheme(): OverlayTheme | null {
  return useContext(ThemeContext);
}

type ThemeProps = ComponentProps<"div"> & {
  theme?: "light" | "dark" | "system";
};

function useResolvedTheme(theme: NonNullable<ThemeProps["theme"]>) {
  // SSR renders light; the client corrects on mount.
  const [system, setSystem] = useState<ResolvedTheme>("light");
  useEffect(() => {
    if (theme !== "system") return () => {};
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystem(query.matches ? "dark" : "light");
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [theme]);
  return theme === "system" ? system : theme;
}

function Theme({ theme = "system", ...props }: ThemeProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const resolved = useResolvedTheme(theme);
  return (
    <ThemeContext.Provider value={{ container: element }}>
      <div
        {...props}
        ref={setElement}
        data-theme={resolved}
        className={
          props.className ? `hashti-theme ${props.className}` : "hashti-theme"
        }
      />
    </ThemeContext.Provider>
  );
}

export { Theme, useOverlayTheme };
