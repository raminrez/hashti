import { expect, test, describe } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Meter, deriveMeterTone, FileInput, Button } from "@hashti/react";

describe("Meter unit tests", () => {
  describe("deriveMeterTone logic", () => {
    test("returns neutral when thresholds are not provided", () => {
      expect(deriveMeterTone({ value: 50 })).toBe("neutral");
    });

    test("handles lower-is-better (optimum <= low, e.g. CPU/disk usage)", () => {
      // low=60, high=80, optimum=20
      expect(deriveMeterTone({ value: 30, low: 60, high: 80, optimum: 20 })).toBe("success");
      expect(deriveMeterTone({ value: 60, low: 60, high: 80, optimum: 20 })).toBe("success");
      expect(deriveMeterTone({ value: 70, low: 60, high: 80, optimum: 20 })).toBe("warning");
      expect(deriveMeterTone({ value: 80, low: 60, high: 80, optimum: 20 })).toBe("error");
      expect(deriveMeterTone({ value: 95, low: 60, high: 80, optimum: 20 })).toBe("error");
    });

    test("handles higher-is-better (optimum >= high, e.g. battery level/score)", () => {
      // low=20, high=80, optimum=90
      expect(deriveMeterTone({ value: 90, low: 20, high: 80, optimum: 90 })).toBe("success");
      expect(deriveMeterTone({ value: 80, low: 20, high: 80, optimum: 90 })).toBe("success");
      expect(deriveMeterTone({ value: 50, low: 20, high: 80, optimum: 90 })).toBe("warning");
      expect(deriveMeterTone({ value: 20, low: 20, high: 80, optimum: 90 })).toBe("error");
      expect(deriveMeterTone({ value: 10, low: 20, high: 80, optimum: 90 })).toBe("error");
    });

    test("handles medium-is-better (low < optimum < high, e.g. room temperature)", () => {
      // low=40, high=60, optimum=50
      expect(deriveMeterTone({ value: 50, low: 40, high: 60, optimum: 50 })).toBe("success");
      expect(deriveMeterTone({ value: 45, low: 40, high: 60, optimum: 50 })).toBe("success");
      expect(deriveMeterTone({ value: 20, low: 40, high: 60, optimum: 50 })).toBe("warning");
      expect(deriveMeterTone({ value: 80, low: 40, high: 60, optimum: 50 })).toBe("warning");
    });
  });

  describe("Meter rendering & anatomy", () => {
    test("renders standard bar Meter with label, value, and track", () => {
      const html = renderToStaticMarkup(
        <Meter label="Disk Usage" value={45} low={60} high={80} optimum={20} />,
      );
      expect(html).toContain("hashti-meter");
      expect(html).toContain("hashti-meter-track");
      expect(html).toContain("hashti-meter-fill");
      expect(html).toContain("Disk Usage");
      expect(html).toContain('data-tone="success"');
      expect(html).toContain('role="meter"');
    });

    test("renders multi-segment Meter bar", () => {
      const segments = [
        { value: 40, color: "#0f62fe", label: "System" },
        { value: 30, color: "#8a3ffc", label: "Apps" },
        { value: 10, color: "#6f6f6f", label: "Other" },
      ];
      const html = renderToStaticMarkup(
        <Meter
          label="Storage Breakdown"
          value={80}
          min={0}
          max={100}
          segments={segments}
        />,
      );
      expect(html).toContain("hashti-meter-segment");
      expect(html).toContain("background-color:#0f62fe");
      expect(html).toContain("background-color:#8a3ffc");
      expect(html).toContain("background-color:#6f6f6f");
      expect(html).toContain('title="System: 40"');
    });

    test("renders circular variant of Meter", () => {
      const html = renderToStaticMarkup(
        <Meter
          label="CPU Load"
          value={85}
          variant="circular"
          low={50}
          high={80}
          optimum={20}
          size="lg"
        />,
      );
      expect(html).toContain("hashti-meter--circular");
      expect(html).toContain("hashti-meter-circle-container");
      expect(html).toContain("hashti-meter-circle-svg");
      expect(html).toContain("hashti-meter-circle-track");
      expect(html).toContain("hashti-meter-circle-fill");
      expect(html).toContain('data-tone="error"');
      expect(html).toContain('data-size="lg"');
    });

    test("supports compound composition with Meter subcomponents", () => {
      const html = renderToStaticMarkup(
        <Meter.Root value={75} tone="warning">
          <Meter.Label>Compound Meter</Meter.Label>
          <Meter.Value>75%</Meter.Value>
          <Meter.Track>
            <Meter.Fill />
          </Meter.Track>
          <Meter.HelperText>Approaching limit</Meter.HelperText>
        </Meter.Root>,
      );
      expect(html).toContain("hashti-meter-label-text");
      expect(html).toContain("Compound Meter");
      expect(html).toContain("hashti-meter-value-text");
      expect(html).toContain("75%");
      expect(html).toContain("hashti-meter-helper");
      expect(html).toContain("Approaching limit");
      expect(html).toContain('data-tone="warning"');
    });
  });
});

describe("FileInput unit tests", () => {
  test("renders FileInput with default dashed variant", () => {
    const html = renderToStaticMarkup(
      <FileInput aria-label="Drop area">
        <span>Drop files here</span>
      </FileInput>,
    );
    expect(html).toContain("hashti-dropzone");
    expect(html).toContain("hashti-dropzone--dashed");
    expect(html).toContain('data-variant="dashed"');
  });

  test("renders FileInput with solid and card variants", () => {
    const solidHtml = renderToStaticMarkup(<FileInput variant="solid" aria-label="Solid" />);
    expect(solidHtml).toContain("hashti-dropzone--solid");
    expect(solidHtml).toContain('data-variant="solid"');

    const cardHtml = renderToStaticMarkup(<FileInput variant="card" aria-label="Card" />);
    expect(cardHtml).toContain("hashti-dropzone--card");
    expect(cardHtml).toContain('data-variant="card"');
  });

  test("integrates a trigger inside FileInput", () => {
    const html = renderToStaticMarkup(
      <FileInput aria-label="Drop area" accept=".png,.jpg">
        <FileInput.Dropzone>
          <span>Drag files here or</span>
          <FileInput.Trigger>
            <Button variant="secondary">Browse files</Button>
          </FileInput.Trigger>
        </FileInput.Dropzone>
      </FileInput>,
    );
    expect(html).toContain("Browse files");
  });

  test("supports compound FileInput.Root namespacing", () => {
    const html = renderToStaticMarkup(
      <FileInput.Root aria-label="Custom drop zone" variant="card">
        <FileInput.Dropzone>Drop Zone Content</FileInput.Dropzone>
      </FileInput.Root>,
    );
    expect(html).toContain("hashti-dropzone--card");
    expect(html).toContain("Drop Zone Content");
  });
});
