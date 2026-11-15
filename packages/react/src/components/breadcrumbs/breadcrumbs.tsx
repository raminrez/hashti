"use client";

import { Children, isValidElement, type ComponentProps, type ReactNode, type Ref } from "react";
import {
  Breadcrumbs as RACBreadcrumbs,
  Breadcrumb,
  type BreadcrumbsProps as RACBreadcrumbsProps,
} from "react-aria-components";
import { Link } from "../button";

export interface BreadcrumbItemProps extends ComponentProps<"li"> {
  children: ReactNode;
  href?: string;
  isCurrent?: boolean;
}

export function BreadcrumbItem(_props: BreadcrumbItemProps): ReactNode {
  void _props;
  return null;
}

export interface BreadcrumbsProps<T extends object> extends RACBreadcrumbsProps<T> {
  ref?: Ref<HTMLOListElement>;
}

export function Breadcrumbs<T extends object>({
  className,
  children,
  ...props
}: BreadcrumbsProps<T>) {
  const transformed =
    typeof children === "function"
      ? children
      : Children.map(children, (child) => {
          if (isValidElement(child) && child.type === BreadcrumbItem) {
            const {
              href,
              isCurrent,
              children: label,
              ...rest
            } = child.props as BreadcrumbItemProps;
            return (
              <Breadcrumb {...rest}>
                <Link href={href} aria-current={isCurrent ? "page" : undefined}>
                  {label}
                </Link>
              </Breadcrumb>
            );
          }
          return child;
        });

  return (
    <RACBreadcrumbs
      {...props}
      className={["hashti-breadcrumbs", className].filter(Boolean).join(" ")}
    >
      {transformed}
    </RACBreadcrumbs>
  );
}

export { Breadcrumb };
