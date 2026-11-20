"use client"

import type { ComponentProps } from "react"
import { join } from "@hashti/utils"
import {
  NavigationMenu as UiNavigationMenu,
  NavigationMenuContent as UiNavigationMenuContent,
  NavigationMenuItem as UiNavigationMenuItem,
  NavigationMenuLink as UiNavigationMenuLink,
  NavigationMenuList as UiNavigationMenuList,
  NavigationMenuTrigger as UiNavigationMenuTrigger,
  NavigationMenuViewport as UiNavigationMenuViewport,
} from "@ui-sdk/react/navigation-menu"


function NavigationMenu(props: ComponentProps<typeof UiNavigationMenu>) {
  return (
    <UiNavigationMenu {...props} className={join("hashti-navigation-menu", props.className)} />
  )
}

function NavigationMenuList(props: ComponentProps<typeof UiNavigationMenuList>) {
  return (
    <UiNavigationMenuList
      {...props}
      className={join("hashti-navigation-menu-list", props.className)}
    />
  )
}

function NavigationMenuItem(props: ComponentProps<typeof UiNavigationMenuItem>) {
  return (
    <UiNavigationMenuItem
      {...props}
      className={join("hashti-navigation-menu-item", props.className)}
    />
  )
}

function NavigationMenuTrigger(props: ComponentProps<typeof UiNavigationMenuTrigger>) {
  return (
    <UiNavigationMenuTrigger
      {...props}
      className={join("hashti-navigation-menu-trigger", props.className)}
    />
  )
}

function NavigationMenuContent(props: ComponentProps<typeof UiNavigationMenuContent>) {
  return (
    <UiNavigationMenuContent
      {...props}
      className={join("hashti-navigation-menu-content", props.className)}
    />
  )
}

function NavigationMenuLink(props: ComponentProps<typeof UiNavigationMenuLink>) {
  return (
    <UiNavigationMenuLink
      {...props}
      className={join("hashti-navigation-menu-link", props.className)}
    />
  )
}

function NavigationMenuViewport(props: ComponentProps<typeof UiNavigationMenuViewport>) {
  return (
    <UiNavigationMenuViewport
      {...props}
      className={join("hashti-navigation-menu-viewport", props.className)}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
}
