import { ModeratorForms } from "@/components/moderateur/moderator-forms";
import { getAllArticles, getAllMadrassas, getAllScholars } from "@/content/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration | Souss Alima",
  robots: {
    index: false,
    follow: false
  }
};

export default async function ModeratorPage() {
  const [madrassas, articles, scholars] = await Promise.all([getAllMadrassas(), getAllArticles(), getAllScholars()]);
  const recentMadrassas = madrassas.slice(-4).reverse().map((madrassa) => ({
    name: madrassa.name,
    href: `/madrassas/${madrassa.slug}`,
    meta: `${madrassa.commune} · ${madrassa.province}`
  }));
  const recentArticles = articles.slice(-4).reverse().map((article) => ({
    name: article.title,
    href: `/articles/${article.slug}`,
    meta: article.summary
  }));
  const recentScholars = scholars.slice(-4).reverse().map((scholar) => ({
    name: scholar.nameFr,
    href: `/savants/${scholar.slug}`,
    meta: scholar.places
  }));

  return (
    <div>
      <header className="container-page py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="page-kicker">Espace editorial</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.025em] text-ink md:text-6xl">Moderation</h1>
            <p className="page-description">
              Ajouter, verifier et publier les contenus qui alimentent la carte, les fiches madrassas et l'espace editorial.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-4 rounded-[18px] border border-line bg-surface p-4">
            <div>
              <dt className="metadata-label">Madrassas</dt>
              <dd className="mt-1 text-3xl font-semibold text-ink">{madrassas.length}</dd>
            </div>
            <div>
              <dt className="metadata-label">Articles</dt>
              <dd className="mt-1 text-3xl font-semibold text-ink">{articles.length}</dd>
            </div>
            <div>
              <dt className="metadata-label">Savants</dt>
              <dd className="mt-1 text-3xl font-semibold text-ink">{scholars.length}</dd>
            </div>
          </dl>
        </div>
      </header>
      <main className="container-page pb-16">
        <div className="border-t border-line pt-8">
          <ModeratorForms
            recentArticles={recentArticles}
            recentMadrassas={recentMadrassas}
            recentScholars={recentScholars}
            totals={{ articles: articles.length, madrassas: madrassas.length, scholars: scholars.length }}
          />
        </div>
      </main>
    </div>
  );
}
