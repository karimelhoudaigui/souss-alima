import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { socialLinks } from "@/components/social-links";

const primaryLinks = [
  ["Explorer", "/"],
  ["Madrassas", "/madrassas"],
  ["Savants", "/savants"],
  ["Articles", "/articles"],
  ["Ressources", "/ressources"]
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/96">
      <div className="nav-inner container-page flex h-16 min-w-0 items-center justify-between gap-3 overflow-visible">
        <Link className="flex min-w-0 items-center gap-2.5" href="/" aria-label="Al-Maghrib al-ʿĀlim, accueil">
          <Image alt="" className="h-9 w-9 shrink-0 rounded-full border border-brand-line bg-surface object-cover" height={72} priority src="/images/brand/almaghrib-alalim-logo.png" unoptimized width={72} />
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-medium leading-5 text-ink sm:text-[15px]">Al-Maghrib al-ʿĀlim</span>
            <span className="brand-arabic hidden text-sm leading-5 text-faint sm:block" dir="rtl" lang="ar">المغرب العالِم</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {primaryLinks.map(([label, href]) => (
            <Link className="ui-sans border-b border-transparent px-2.5 py-2 text-sm text-muted transition duration-150 hover:border-brand hover:text-ink" href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-1 border-r border-line pr-2">
            {socialLinks.map(([label, href, Icon]) => (
              <a className="inline-flex h-9 w-9 items-center justify-center border border-transparent text-muted transition hover:border-brand-line hover:bg-surface hover:text-brand" href={href} key={href} rel="me noreferrer" target="_blank" aria-label={label}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
          <Link className="ui-sans border-b border-transparent px-2.5 py-2 text-sm text-muted transition duration-150 hover:border-brand hover:text-ink" href="/contribuer">
            Contribuer
          </Link>
          <button className="ui-sans border border-line px-2.5 py-1.5 text-xs font-medium text-muted" type="button">
            FR
          </button>
        </div>

        <details className="group relative ml-auto shrink-0 md:hidden">
          <summary className="ui-sans flex min-h-11 cursor-pointer list-none items-center gap-2 border border-line px-3 py-2 text-sm font-medium text-ink marker:hidden">
            <Menu className="h-4 w-4" aria-hidden="true" />
            <span>Menu</span>
          </summary>
          <div className="absolute right-0 mt-2 w-[min(calc(100vw-2rem),340px)] border border-line bg-surface p-2 shadow-[0_18px_50px_rgba(23,23,23,0.08)]">
            {[...primaryLinks, ["Contribuer", "/contribuer"], ["Contact", "/contact"]].map(([label, href]) => (
              <Link className="ui-sans block min-h-11 border-b border-line px-3 py-3 text-sm text-ink last:border-b-0 hover:bg-subtle" href={href} key={href}>
                {label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {socialLinks.map(([label, href, Icon]) => (
                <a className="ui-sans inline-flex min-h-11 items-center justify-center gap-2 border border-line bg-subtle px-3 text-sm font-medium text-ink transition hover:border-brand-line hover:text-brand" href={href} key={href} rel="me noreferrer" target="_blank">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
