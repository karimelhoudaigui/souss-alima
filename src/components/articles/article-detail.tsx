import Image from "next/image";
import Link from "next/link";
import { MetadataItem } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { themes, type Article, type Madrassa, type Scholar } from "@/content/data";
import { publicAsset } from "@/lib/assets";

export function ArticleDetail({ article, madrassas = [], scholars = [] }: { article: Article; madrassas?: Madrassa[]; scholars?: Scholar[] }) {
  const theme = themes.find((item) => item.slug === article.theme)?.label ?? article.theme;
  const linkedScholars = scholars.filter((scholar) => article.scholarSlugs.includes(scholar.slug));
  const linkedMadrassas = madrassas.filter((madrassa) => article.madrassaSlugs.includes(madrassa.slug));

  return (
    <article>
      <header className="container-page py-8 md:py-12">
        <Link className="text-sm font-medium text-muted hover:text-ink" href="/articles">← Tous les articles</Link>
        <p className="page-kicker mt-8">{theme}</p>
        {article.titleAr ? <p className="arabic-title mt-4" dir="rtl" lang="ar">{article.titleAr}</p> : null}
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.025em] text-ink md:text-6xl">{article.title}</h1>
        <p className="page-description">{article.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>{article.author}</span>
          <span>{article.publishedAt}</span>
          <span>{article.readingTime}</span>
          <StatusBadge status={article.status} />
        </div>
      </header>

      {article.image ? (
        <div className="container-page pb-10">
          <figure className="overflow-hidden rounded-[18px] border border-line bg-subtle">
            <Image alt="" className="h-[260px] w-full object-cover md:h-[420px]" height={840} priority sizes="(max-width: 768px) 100vw, 1200px" src={publicAsset(article.image) ?? ""} unoptimized width={2400} />
            {article.imageCredit ? <figcaption className="border-t border-line px-4 py-3 text-xs text-muted">{article.imageCredit}</figcaption> : null}
          </figure>
        </div>
      ) : null}

      <div className="container-page grid gap-10 pb-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="max-w-3xl">
          <section className="border-b border-line pb-9">
            <div className="whitespace-pre-line text-lg leading-9 text-ink">{article.body}</div>
          </section>

          <section className="border-b border-line py-9">
            <h2 className="section-title">Sources</h2>
            <div className="mt-5 divide-y divide-line border-y border-line">
              {article.sources.map((source, index) => (
                <div className="grid gap-3 py-4 md:grid-cols-[44px_1fr]" key={source}>
                  <span className="text-sm text-faint">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-6 text-muted">{source}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-8 pt-9 md:grid-cols-2">
            <div>
              <h2 className="section-title">Savants mentionnes</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {linkedScholars.length ? linkedScholars.map((scholar) => (
                  <Link className="relation-link" href={`/savants/${scholar.slug}`} key={scholar.slug}>{scholar.nameFr}</Link>
                )) : <p className="text-sm text-muted">Aucun savant relie pour le moment.</p>}
              </div>
            </div>
            <div>
              <h2 className="section-title">Madrassas mentionnees</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {linkedMadrassas.length ? linkedMadrassas.map((madrassa) => (
                  <Link className="relation-link" href={`/madrassas/${madrassa.slug}`} key={madrassa.slug}>{madrassa.name}</Link>
                )) : <p className="text-sm text-muted">Aucune madrassa reliee pour le moment.</p>}
              </div>
            </div>
          </section>
        </main>

        <aside className="h-fit border-t border-line pt-6 lg:sticky lg:top-24 lg:border-t-0 lg:pt-0">
          <dl className="grid gap-6">
            <MetadataItem label="Theme" value={theme} />
            <MetadataItem label="Tags" value={article.tags.join(" · ")} />
            <MetadataItem label="Verification" value={<StatusBadge status={article.status} />} />
          </dl>
        </aside>
      </div>
    </article>
  );
}
