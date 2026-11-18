import { expect, test, describe } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Input, TextArea } from "../../packages/react/src/components/text-field";
import { NumberInput } from "../../packages/react/src/components/number-field";
import { OtpInput } from "../../packages/react/src/components/input-otp";
import { SearchField } from "../../packages/react/src/components/search-field";
import { FileInput } from "../../packages/react/src/components/dropzone";
import { TimeInput } from "../../packages/react/src/components/time-field";
import { Meter, deriveMeterTone } from "../../packages/react/src/components/meter";
import { Pagination, paginationRange } from "../../packages/react/src/components/pagination";
import { ProgressBar, ProgressCircle } from "../../packages/react/src/components/progress";
import { Slider } from "../../packages/react/src/components/slider";

describe("text-field (Input / TextArea)", () => {
  test("renders input with label, description, classes", () => {
    const html = renderToStaticMarkup(
      <Input label="Workspace name" description="Pick a name." defaultValue="Weekly review" />,
    );
    expect(html).toContain("hashti-field hashti-text-field");
    expect(html).toContain("hashti-field__label");
    expect(html).toContain("Workspace name");
    expect(html).toContain("hashti-field__description");
    expect(html).toContain("<input");
    expect(html).toContain('value="Weekly review"');
  });

  test("required shows necessity marker and data-required", () => {
    const html = renderToStaticMarkup(<Input label="Email" required />);
    expect(html).toContain("hashti-field__necessity");
    expect(html).toContain("(required)");
  });

  test("disabled marks the field", () => {
    const html = renderToStaticMarkup(<Input label="Email" disabled />);
    expect(html).toContain("data-disabled");
  });

  test("invalid marks the field and gates the error", () => {
    const invalid = renderToStaticMarkup(
      <Input label="Email" invalid errorMessage="Enter a valid email." />,
    );
    expect(invalid).toContain("data-invalid");
    expect(invalid).toContain("Enter a valid email.");
    const valid = renderToStaticMarkup(<Input label="Email" errorMessage="Enter a valid email." />);
    expect(valid).not.toContain("Enter a valid email.");
  });

  test("TextArea renders a textarea", () => {
    const html = renderToStaticMarkup(<TextArea label="Notes" rows={3} />);
    expect(html).toContain("hashti-text-area");
    expect(html).toContain("<textarea");
  });
});

describe("number-field (NumberInput)", () => {
  test("renders steppers with aria-labels", () => {
    const html = renderToStaticMarkup(<NumberInput label="Reviewers" defaultValue={3} min={1} max={12} />);
    expect(html).toContain("hashti-field hashti-number-field");
    expect(html).toContain('aria-label="Decrease"');
    expect(html).toContain('aria-label="Increase"');
    expect(html).toContain("number-input-control");
  });
});

describe("input-otp (OtpInput)", () => {
  test("renders the requested number of slots", () => {
    const html = renderToStaticMarkup(<OtpInput label="Code" length={4} />);
    expect(html).toContain("hashti-field hashti-input-otp");
    expect(html.match(/otp-input-slot/g)?.length).toBe(4);
    expect(html).toContain('autoComplete="one-time-code"');
    // The label is a sibling of the control under the field, not nested in it.
    expect(html.indexOf("field-label")).toBeLessThan(html.indexOf('data-slot="otp-input"'));
  });
});

describe("search-field (SearchField)", () => {
  test("renders a search input with icon", () => {
    const html = renderToStaticMarkup(<SearchField label="Search" defaultValue="query" />);
    expect(html).toContain("hashti-field hashti-search-field");
    expect(html).toContain('type="search"');
    expect(html).toContain('data-slot="input-group"');
  });
});

describe("dropzone (FileInput)", () => {
  test("renders dropzone with variant", () => {
    const html = renderToStaticMarkup(<FileInput aria-label="Upload" variant="card" />);
    expect(html).toContain("hashti-dropzone");
    expect(html).toContain("hashti-dropzone--card");
    expect(html).toContain('data-variant="card"');
  });
});

describe("time-field (TimeInput)", () => {
  test("renders segments", () => {
    const html = renderToStaticMarkup(<TimeInput label="Meeting time" defaultValue="09:30" />);
    expect(html).toContain("hashti-field hashti-time-field");
    expect(html).toContain("time-input-segment");
  });
});

describe("meter", () => {
  test("renders bar with tone and track", () => {
    const html = renderToStaticMarkup(<Meter label="Disk" value={45} low={60} high={80} optimum={20} />);
    expect(html).toContain("hashti-meter");
    expect(html).toContain("hashti-meter-track");
    expect(html).toContain('data-tone="success"');
    expect(html).toContain('role="meter"');
  });
  test("circular variant", () => {
    const html = renderToStaticMarkup(<Meter label="CPU" value={85} variant="circular" size="lg" />);
    expect(html).toContain("hashti-meter-circle-svg");
    expect(html).toContain('data-size="lg"');
  });
  test("deriveMeterTone", () => {
    expect(deriveMeterTone({ value: 50 })).toBe("neutral");
    expect(deriveMeterTone({ value: 30, low: 60, high: 80, optimum: 20 })).toBe("success");
  });
});

describe("pagination", () => {
  test("renders range and prev/next", () => {
    const html = renderToStaticMarkup(
      <Pagination totalItems={95} page={2} pageSize={20} onPageChange={() => {}} />,
    );
    expect(html).toContain("hashti-pagination");
    expect(html).toContain("21–40 of 95 items");
    expect(html).toContain('aria-label="Previous page"');
    expect(html).toContain('aria-label="Next page"');
  });
  test("paginationRange clamps", () => {
    expect(paginationRange(95, 20, 99).page).toBe(5);
    expect(paginationRange(0, 10, 1).pages).toBe(1);
  });
});

describe("progress", () => {
  test("ProgressBar renders label and track", () => {
    const html = renderToStaticMarkup(<ProgressBar label="Exporting" value={60} />);
    expect(html).toContain("hashti-progress");
    expect(html).toContain("hashti-progress-track");
    expect(html).toContain('role="progressbar"');
  });
  test("ProgressCircle renders svg", () => {
    const html = renderToStaticMarkup(<ProgressCircle value={40} aria-label="Progress" />);
    expect(html).toContain("hashti-progress-circle");
    expect(html).toContain("hashti-progress-circle-fill");
  });
});

describe("slider", () => {
  test("renders a thumb and track", () => {
    const html = renderToStaticMarkup(<Slider defaultValue={50} aria-label="Volume" />);
    expect(html).toContain("hashti-slider");
    expect(html).toContain("hashti-slider-track");
    expect(html).toContain("hashti-slider-thumb");
  });
  test("range renders two thumbs", () => {
    const html = renderToStaticMarkup(
      <Slider defaultValue={[20, 80]} thumbLabels={["Min", "Max"]} aria-label="Price" />,
    );
    expect(html.match(/hashti-slider-thumb/g)?.length).toBe(2);
    expect(html).toContain('aria-label="Min"');
  });
});
