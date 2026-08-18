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
    <header className="sticky top-0 z-40 border-b border-line bg-background/92 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-5">
        <Link className="flex items-baseline gap-2" href="/" aria-label="Souss Alima, accueil">
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Souss Alima</span>
          <span className="hidden text-xs text-faint sm:inline">مدارس سوس</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {primaryLinks.map(([label, href]) => (
            <Link className="rounded-[10px] px-3 py-2 text-sm text-muted transition duration-150 hover:bg-subtle hover:text-ink" href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link className="rounded-[10px] px-3 py-2 text-sm text-muted transition duration-150 hover:bg-subtle hover:text-ink" href="/contribuer">
            Contribuer
          </Link>
          <button className="rounded-[10px] border border-line px-2.5 py-1.5 text-xs font-medium text-muted" type="button">
            FR
          </button>
        </div>

        <details className="group relative md:hidden">
          <summary className="list-none rounded-[10px] border border-line px-3 py-2 text-sm font-medium text-ink marker:hidden">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-[min(86vw,320px)] rounded-[16px] border border-line bg-surface p-2 shadow-[0_18px_50px_rgba(23,23,23,0.08)]">
            {[...primaryLinks, ["Contribuer", "/contribuer"], ["Contact", "/contact"]].map(([label, href]) => (
              <Link className="block rounded-[10px] px-3 py-3 text-sm text-ink hover:bg-subtle" href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
