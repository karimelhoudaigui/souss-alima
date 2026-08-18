import type { Metadata } from "next";
import Link from "next/link";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Souss Alima",
  description: "Plateforme numerique dediee au patrimoine scientifique traditionnel du Souss."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-line bg-surface">
          <div className="container-page grid gap-8 py-10 md:grid-cols-[1fr_1fr_1fr]">
            <div>
              <p className="text-base font-semibold text-ink">Souss Alima</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted">Memoire, sources et transmission du Souss savant.</p>
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
              <span className="pt-2 text-xs text-faint">© 2026 Souss Alima</span>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
