"use client"

import type { ComponentPropsWithRef, Ref } from "react"

export interface LinkProps extends ComponentPropsWithRef<"a"> {
  ref?: Ref<HTMLAnchorElement>
}

function Link({ className, ref, ...props }: LinkProps) {
  const base = "hashti-link"
  return <a {...props} ref={ref} className={className ? `${base} ${className}` : base} />
}

export { Link }
