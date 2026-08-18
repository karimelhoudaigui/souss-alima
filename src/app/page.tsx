import Link from "next/link";
import { scholars } from "@/content/data";
import { getAllArticles, getAllMadrassas } from "@/content/store";
import { StatusBadge } from "@/components/status-badge";

const regions = ["Tiznit", "Taroudant", "Agadir", "Anti-Atlas", "Souss"];

export default async function HomePage() {
  const [articles, madrassas] = await Promise.all([getAllArticles(), getAllMadrassas()]);

  return (
    <div>
      <section className="container-page py-12 md:py-20">
        <div className="max-w-4xl">
          <p className="page-kicker">Plateforme documentaire</p>
          <h1 className="mt-4 text-[3rem] font-semibold leading-[0.98] tracking-[-0.035em] text-ink md:text-[6.5rem]">
            Explorer le Souss savant.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Une cartographie documentee des madrassas, savants et publications reliees au patrimoine scientifique traditionnel du Souss.
          </p>
        </div>

        <form className="mt-10 max-w-3xl" role="search">
          <label className="sr-only" htmlFor="home-search">Rechercher</label>
          <input className="input min-h-14 text-base" id="home-search" placeholder="Rechercher une madrassa, une ville ou un savant..." />
        </form>

        <div className="mt-6 flex flex-wrap gap-2" aria-label="Explorer par region">
          {regions.map((region) => (
            <Link className="filter-chip" href="/madrassas" key={region}>
              {region}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page border-t border-line py-10 md:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="page-kicker">Carte</p>
            <h2 className="section-title mt-2">Madrassas recemment documentees</h2>
          </div>
          <Link className="hidden text-sm font-medium text-brand hover:text-brand-hover sm:inline" href="/madrassas">
            Tout explorer
          </Link>
        </div>
        <div className="mt-5 divide-y divide-line">
          {madrassas.map((madrassa) => (
            <Link className="entity-row grid gap-3 md:grid-cols-[1fr_0.8fr_0.4fr] md:items-center" href={`/madrassas/${madrassa.slug}`} key={madrassa.slug}>
              <div>
                <p className="text-base font-medium text-ink">{madrassa.name}</p>
                <p className="mt-1 text-sm text-muted">{madrassa.commune} · {madrassa.province}</p>
              </div>
              <p className="text-sm text-muted">{madrassa.specialties.join(" · ")}</p>
              <StatusBadge status={madrassa.status} />
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-10 border-t border-line py-10 md:grid-cols-2 md:py-14">
        <div>
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">Articles</h2>
            <Link className="text-sm font-medium text-brand hover:text-brand-hover" href="/articles">Voir</Link>
          </div>
          <div className="mt-5 divide-y divide-line">
            {articles.map((article) => (
              <Link className="entity-row" href={`/articles/${article.slug}`} key={article.slug}>
                <p className="text-base font-medium text-ink">{article.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{article.summary}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <h2 className="section-title">Savants</h2>
            <Link className="text-sm font-medium text-brand hover:text-brand-hover" href="/savants">Voir</Link>
          </div>
          <div className="mt-5 divide-y divide-line">
            {scholars.map((scholar) => (
              <Link className="entity-row" href={`/savants/${scholar.slug}`} key={scholar.slug}>
                <p className="text-right text-lg text-ink" dir="rtl" lang="ar">{scholar.nameAr}</p>
                <p className="mt-1 text-base font-medium text-ink">{scholar.nameFr}</p>
                <p className="mt-1 text-sm text-muted">{scholar.places}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
