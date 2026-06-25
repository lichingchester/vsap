import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * LinkTag (React / Next.js) — a universal link.
 *
 * Renders the most appropriate element for the context:
 *  - next/link <Link> for internal navigation
 *  - a plain <a> for external URLs
 *  - a <div> when you want the children without any navigation
 */

interface LinkTagProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** URL or path to navigate to. */
  href?: string;
  /** Render a <div> instead of a link. */
  noLink?: boolean;
  /** Treat href as an external URL — a plain <a>. */
  external?: boolean;
  /** Open in a new tab (sets target="_blank" + safe rel). */
  newTab?: boolean;
  children?: ReactNode;
}

export function LinkTag({
  href = "",
  noLink = false,
  external = false,
  newTab = false,
  children,
  ...attributes
}: LinkTagProps) {
  const target = newTab ? "_blank" : undefined;
  const rel = newTab ? "noopener noreferrer" : undefined;

  if (noLink) {
    return <div {...attributes}>{children}</div>;
  }

  if (external) {
    return (
      <a href={href} target={target} rel={rel} {...attributes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} target={target} rel={rel} {...attributes}>
      {children}
    </Link>
  );
}

export default LinkTag;
