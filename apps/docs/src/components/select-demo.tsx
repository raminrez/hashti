"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@hashti/react"

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m4 6 4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SelectDemo() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 320 }}>
      <Select items={["Viewer", "Editor", "Admin"]} defaultValue="Editor">
        <SelectLabel>Role</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <Chevron />
        </SelectTrigger>
        <SelectContent>
          {["Viewer", "Editor", "Admin"].map((role) => (
            <SelectItem key={role} value={role}>
              {role}
              <SelectItemIndicator>
                <Check />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select placeholder="Choose a plan">
        <SelectLabel>Plan</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <Chevron />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">
            Free
            <SelectItemIndicator>
              <Check />
            </SelectItemIndicator>
          </SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectGroupLabel>Contact sales</SelectGroupLabel>
            <SelectItem value="enterprise">
              Enterprise
              <SelectItemIndicator>
                <Check />
              </SelectItemIndicator>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
