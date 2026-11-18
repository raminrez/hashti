import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Theme, useTheme, useOverlayTheme, Layer } from "@hashti/react";

function ThemeInspector() {
  const theme = useTheme();
  const overlayTheme = useOverlayTheme();
  return (
    <div
      data-testid="inspector"
      data-theme={theme.theme}
      data-dir={theme.direction}
      data-overlay-theme={overlayTheme["data-hashti-theme"]}
      data-overlay-dir={overlayTheme.dir}
    />
  );
}

test("Theme defaults to frame-light, not white", () => {
  const html = renderToStaticMarkup(
    <Theme>
      <ThemeInspector />
    </Theme>,
  );
  expect(html).toContain('data-hashti-theme="frame-light"');
  expect(html).toContain('data-theme="frame-light"');
  expect(html).toContain('data-overlay-theme="frame-light"');
  expect(html).not.toContain('data-hashti-theme="white"');
});

test("nested Theme dir='rtl' inherits parent theme and does not revert to white", () => {
  const html = renderToStaticMarkup(
    <Theme theme="frame-light">
      <Theme dir="rtl">
        <ThemeInspector />
      </Theme>
    </Theme>,
  );
  expect(html).toContain('dir="rtl"');
  expect(html).toContain('data-theme="frame-light"');
  expect(html).toContain('data-overlay-theme="frame-light"');
  expect(html).not.toContain('data-hashti-theme="white"');
  expect(html).not.toContain('data-theme="white"');
});

test("nested Theme dir='rtl' under frame-dark inherits frame-dark", () => {
  const html = renderToStaticMarkup(
    <Theme theme="frame-dark">
      <Theme dir="rtl">
        <ThemeInspector />
      </Theme>
    </Theme>,
  );
  expect(html).toContain('dir="rtl"');
  expect(html).toContain('data-theme="frame-dark"');
  expect(html).toContain('data-overlay-theme="frame-dark"');
  expect(html).not.toContain('data-hashti-theme="white"');
  expect(html).not.toContain('data-theme="white"');
});

test("Layer nests properly without corrupting theme or direction", () => {
  const html = renderToStaticMarkup(
    <Theme theme="frame-light" dir="rtl">
      <Layer>
        <ThemeInspector />
      </Layer>
    </Theme>,
  );
  expect(html).toContain('data-hashti-layer="1"');
  expect(html).toContain('data-theme="frame-light"');
  expect(html).toContain('data-dir="rtl"');
});
