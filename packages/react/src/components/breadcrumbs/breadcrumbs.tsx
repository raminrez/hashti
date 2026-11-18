"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { Link, type LinkProps } from "../link";
import { cx } from "../../utils";

export interface BreadcrumbProps extends ComponentPropsWithRef<"li"> {}

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return <li {...props} className={cx("hashti-breadcrumb", className)} />;
}

export interface BreadcrumbsProps extends ComponentPropsWithRef<"nav"> {}

export interface BreadcrumbItemProps extends Omit<ComponentPropsWithRef<"li">, "children"> {
  children?: ReactNode;
  href?: string;
  /** Marks the item as the current page (aria-current="page"). */
  isCurrent?: boolean;
}

export function BreadcrumbItem({
  href,
  isCurrent,
  children,
  ...props
}: BreadcrumbItemProps) {
  return (
    <Breadcrumb {...props}>
      <Link href={href} aria-current={isCurrent ? "page" : undefined}>
        {children}
      </Link>
    </Breadcrumb>
  );
}

export function Breadcrumbs({ className, children, ...props }: BreadcrumbsProps) {
  const crumbs = Children.toArray(children).filter(isValidElement);

  return (
    <nav {...props} className={cx("hashti-breadcrumbs", className)}>
      <ol>
        {crumbs.map((crumb, index) => {
          if (crumb.type !== Breadcrumb && crumb.type !== BreadcrumbItem) return crumb;
          const link = Children.toArray(
            (crumb.props as BreadcrumbProps).children,
          ).find((child) => isValidElement(child) && child.type === Link);
          // The last crumb is the current page unless it says otherwise.
          if (
            isValidElement<LinkProps>(link) &&
            link.props["aria-current"] === undefined &&
            index === crumbs.length - 1
          ) {
            return cloneElement(crumb as ReactElement<BreadcrumbProps>, {
              children: cloneElement(link, { "aria-current": "page" }),
            });
          }
          return crumb;
        })}
      </ol>
    </nav>
  );
}
