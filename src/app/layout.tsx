import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { Nav } from "@/components/nav";
import { socialLinks } from "@/components/social-links";

export const metadata: Metadata = {
  title: "Al-Maghrib al-ʿĀlim",
  description: "Plateforme numerique dediee au patrimoine scientifique traditionnel du Maroc savant.",
  icons: {
    icon: "/images/brand/almaghrib-alalim-logo.png",
    apple: "/images/brand/almaghrib-alalim-logo.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-line bg-surface">
          <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <Image alt="" className="h-14 w-14 shrink-0 rounded-full border border-brand-line bg-background object-cover" height={112} src="/images/brand/almaghrib-alalim-logo.png" unoptimized width={112} />
                <div>
                  <p className="text-base font-semibold text-ink">Al-Maghrib al-ʿĀlim</p>
                  <p className="brand-arabic mt-0.5 text-base text-brand" dir="rtl" lang="ar">المغرب العالِم</p>
                </div>
              </div>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted">Memoire, sources et transmission du Maroc savant.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map(([label, href, Icon]) => (
                  <a className="ui-sans inline-flex min-h-10 items-center gap-2 border border-line bg-background px-3 text-sm font-medium text-ink transition hover:border-brand-line hover:text-brand" href={href} key={href} rel="me noreferrer" target="_blank">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <nav aria-label="Explorer" className="grid gap-2 text-sm text-muted">
              <Link className="hover:text-ink" href="/madrassas">Madrassas</Link>
              <Link className="hover:text-ink" href="/savants">Savants</Link>
              <Link className="hover:text-ink" href="/articles">Articles</Link>
              <Link className="hover:text-ink" href="/ressources">Ressources</Link>
            </nav>
            <nav aria-label="Projet" className="grid gap-2 text-sm text-muted">
              <Link className="hover:text-ink" href="/a-propos">A propos</Link>
              <Link className="hover:text-ink" href="/contribuer">Contribuer</Link>
              <Link className="hover:text-ink" href="/contact">Contact</Link>
              <span className="pt-2 text-xs text-faint">© 2026 Al-Maghrib al-ʿĀlim</span>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
