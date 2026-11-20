"use client"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@hashti/react"

function ChevronGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path d="m4.5 3 3 3-3 3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" fill="none">
      <path d="m2.5 6.5 2.5 2.5 4.5-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function LinkGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none">
      <path
        d="M6.5 9.5 9.5 6.5M7 4.5 8.8 2.7a2.5 2.5 0 0 1 3.5 3.5L10.5 8M9 11.5 7.2 13.3a2.5 2.5 0 0 1-3.5-3.5L5.5 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MailGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m2.5 5 5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function MenuDemo() {
  return (
    <Menu onAction={(value) => console.log(value)}>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem value="rename">Rename</MenuItem>
        <MenuItem value="duplicate">Duplicate</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>
            Share
            <ChevronGlyph />
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="copy-link">
              <MenuItemIcon>
                <LinkGlyph />
              </MenuItemIcon>
              Copy link
            </MenuItem>
            <MenuItem value="email">
              <MenuItemIcon>
                <MailGlyph />
              </MenuItemIcon>
              Email
            </MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuCheckboxItem value="status-bar" defaultChecked>
          <MenuItemIndicator keepMounted>
            <CheckGlyph />
          </MenuItemIndicator>
          Status bar
        </MenuCheckboxItem>
        <MenuItem value="find" shortcut="mod+f">
          Find…
        </MenuItem>        <MenuCheckboxItem value="minimap">
          <MenuItemIndicator keepMounted>
            <CheckGlyph />
          </MenuItemIndicator>
          Minimap
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuRadioGroup name="density" defaultValue="comfortable">
          <MenuGroupLabel>Density</MenuGroupLabel>
          {["Compact", "Comfortable"].map((option) => (
            <MenuRadioItem key={option} value={option.toLowerCase()}>
              <MenuItemIndicator />
              {option}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Danger zone</MenuGroupLabel>
          <MenuItem value="archive">Archive</MenuItem>
          <MenuItem value="delete">Delete</MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  )
}
