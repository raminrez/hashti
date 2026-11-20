"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@hashti/react"

const docsLinks = [
  { href: "#components", title: "Components", desc: "Every building block." },
  { href: "#styles", title: "Styles", desc: "Tokens and recipes." },
]

export function NavigationMenuDemo() {
  return (
    <NavigationMenu aria-label="Main navigation">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
          <NavigationMenuContent>
            {docsLinks.map((l) => (
              <NavigationMenuLink key={l.href} href={l.href}>
                <div style={{ fontWeight: 600 }}>{l.title}</div>
                <div style={{ color: "var(--hashti-text-secondary)", fontSize: "0.8125rem" }}>{l.desc}</div>
              </NavigationMenuLink>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#guides">Guides</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  )
}
