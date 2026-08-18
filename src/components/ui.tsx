import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  kicker?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  narrow?: boolean;
};

export function PageHeader({ kicker, title, description, children, narrow = false }: PageHeaderProps) {
  return (
    <header className={narrow ? "container-text page-block" : "container-page page-block"}>
      {kicker ? <p className="page-kicker">{kicker}</p> : null}
      <h1 className="page-title">{title}</h1>
      {description ? <p className="page-description">{description}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}

export function MetadataItem({ label, value }: { label: string; value?: ReactNode }) {
  if (!value) return null;

  return (
    <div>
      <dt className="metadata-label">{label}</dt>
      <dd className="metadata-value">{value}</dd>
    </div>
  );
}

export function FilterChip({ children }: { children: ReactNode }) {
  return (
    <button className="filter-chip" type="button">
      {children}
    </button>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="text-sm font-medium text-brand transition duration-150 hover:text-brand-hover" href={href}>
      {children}
    </Link>
  );
}
