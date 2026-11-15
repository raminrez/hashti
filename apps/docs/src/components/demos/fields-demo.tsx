import { useState } from "react";
import {
  Button,
  Form,
  TextField,
  TextArea,
  NumberField,
  SearchField,
  TimeField,
  DatePicker,
  DateRangePicker,
  InputOTP,
  Autocomplete,
  ListBoxItem,
  NativeSelect,
  Slider,
} from "@hashti/react";

export function TextFieldLiveDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <TextField
        label="Architectural Workspace Name"
        description="Enter the identifier for your Hashti environment."
        placeholder="e.g. Isfahan Pavilion"
        value={value}
        onChange={setValue}
      />
      <TextArea
        label="Spatial Notes"
        placeholder="Diffuse zenithal light and masonry bench observations..."
        rows={3}
      />
    </div>
  );
}

export function NumberFieldLiveDemo() {
  const [val, setVal] = useState<number | null>(44);
  return (
    <div className="w-full max-w-xs">
      <NumberField
        label="Touch Target Height (px)"
        description="Standard ergonomic touch boundary in pixels."
        value={val}
        onChange={setVal}
        minValue={24}
        maxValue={96}
        step={4}
      />
    </div>
  );
}

export function SearchFieldLiveDemo() {
  const [query, setQuery] = useState("");
  return (
    <div className="w-full max-w-sm">
      <SearchField
        label="Search Architectural Records"
        placeholder="Search vaults, portals, tokens..."
        value={query}
        onChange={setQuery}
      />
    </div>
  );
}

export function TimeFieldLiveDemo() {
  return (
    <div className="w-full max-w-xs flex flex-col gap-4">
      <TimeField label="Zenithal Illumination Peak" />
    </div>
  );
}

export function DatePickerLiveDemo() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-5">
      <DatePicker label="Observation Date" />
      <DateRangePicker label="Exhibition Window" />
    </div>
  );
}

export function InputOTPLiveDemo() {
  const [otp, setOtp] = useState("");
  return (
    <div className="flex flex-col items-center gap-3">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        aria-label="Two-factor authentication code"
      />
      <span className="text-xs text-neutral-500 font-mono">Entered: {otp || "------"}</span>
    </div>
  );
}

export function SliderLiveDemo() {
  const [value, setValue] = useState(45);
  return (
    <div className="w-full max-w-sm">
      <Slider
        label="Storage allocation (GB)"
        minValue={0}
        maxValue={100}
        value={value}
        onChange={(next) => setValue(next as number)}
      />
    </div>
  );
}

export function TextAreaLiveDemo() {
  const [notes, setNotes] = useState("Check the release checklist.");
  return (
    <div className="w-full max-w-sm flex flex-col gap-2">
      <TextArea
        label="Review notes"
        description="Keep the handoff details with this draft."
        value={notes}
        onChange={setNotes}
        rows={3}
      />
      <output aria-label="Review notes value" className="text-xs text-neutral-500 font-mono">
        {notes.length} characters
      </output>
    </div>
  );
}

export function NativeSelectLiveDemo() {
  const [pageSize, setPageSize] = useState("10");
  return (
    <div className="w-full max-w-xs">
      <NativeSelect
        label="Items per page"
        description="Choose how many records are shown on each page."
        value={pageSize}
        onChange={(event) => setPageSize(event.target.value)}
      >
        <option value="10">10 items</option>
        <option value="25">25 items</option>
        <option value="50">50 items</option>
      </NativeSelect>
    </div>
  );
}

export function FormLiveDemo() {
  const [saved, setSaved] = useState("");
  return (
    <Form
      aria-label="Workspace draft"
      className="w-full max-w-sm flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("workspace") ?? ""));
      }}
    >
      <TextField
        name="workspace"
        label="Workspace name"
        description="Use the name your team will recognize."
        isRequired
      />
      <TextArea name="notes" label="Review notes" rows={3} isOptional />
      <Button type="submit">Save draft</Button>
      <p role="status" className="text-sm text-neutral-500 min-h-5">
        {saved ? `Saved “${saved}”.` : ""}
      </p>
    </Form>
  );
}

export function AutocompleteLiveDemo() {
  return (
    <div className="w-full max-w-sm">
      <Autocomplete
        label="Architectural Component"
        placeholder="Type to filter..."
        defaultItems={[
          { id: "darvazeh", name: "Darvazeh Portal" },
          { id: "hashti", name: "Hashti Vestibule" },
          { id: "dalan", name: "Dalan Bent Corridor" },
          { id: "hayati", name: "Hayati Courtyard Pool" },
          { id: "howz", name: "Howz Turquoise Basin" },
        ]}
      >
        {(item: any) => <ListBoxItem id={item.id}>{item.name}</ListBoxItem>}
      </Autocomplete>
    </div>
  );
}
