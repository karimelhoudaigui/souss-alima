import Link from "next/link";

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
      <div className="container-page flex h-16 min-w-0 items-center justify-between gap-5">
        <Link className="flex min-w-0 items-baseline gap-2" href="/" aria-label="Al-Maghrib al-ʿĀlim, accueil">
          <span className="truncate text-[15px] font-medium text-ink">Al-Maghrib al-ʿĀlim</span>
          <span className="brand-arabic hidden text-base text-faint sm:inline" dir="rtl" lang="ar">المغرب العالِم</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {primaryLinks.map(([label, href]) => (
            <Link className="ui-sans border-b border-transparent px-2.5 py-2 text-sm text-muted transition duration-150 hover:border-brand hover:text-ink" href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link className="ui-sans border-b border-transparent px-2.5 py-2 text-sm text-muted transition duration-150 hover:border-brand hover:text-ink" href="/contribuer">
            Contribuer
          </Link>
          <button className="ui-sans border border-line px-2.5 py-1.5 text-xs font-medium text-muted" type="button">
            FR
          </button>
        </div>

        <details className="group relative shrink-0 md:hidden">
          <summary className="ui-sans list-none border border-line px-3 py-2 text-sm font-medium text-ink marker:hidden">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-[min(86vw,320px)] border border-line bg-surface p-2 shadow-[0_18px_50px_rgba(23,23,23,0.08)]">
            {[...primaryLinks, ["Contribuer", "/contribuer"], ["Contact", "/contact"]].map(([label, href]) => (
              <Link className="ui-sans block border-b border-line px-3 py-3 text-sm text-ink last:border-b-0 hover:bg-subtle" href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
