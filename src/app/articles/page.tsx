import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { themes } from "@/content/data";
import { getAllArticles } from "@/content/store";

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div>
      <PageHeader
        kicker="Editorial"
        title="Articles"
        description="Publications, etudes et notes editoriales reliees aux madrassas, savants, sources et ouvrages du Souss."
      >
        <form className="max-w-2xl" role="search">
          <label className="sr-only" htmlFor="article-search">Rechercher un article</label>
          <input className="input min-h-12" id="article-search" placeholder="Rechercher un article, un theme ou une source" />
        </form>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <Link className="filter-chip" href="/articles">Tous</Link>
          {themes.map((theme) => (
            <Link className="filter-chip" href="/articles" key={theme.slug}>{theme.label}</Link>
          ))}
        </div>
      </PageHeader>

      <section className="container-page pb-12">
        <div className="max-w-5xl divide-y divide-line border-y border-line">
          {articles.map((article) => {
            const theme = themes.find((item) => item.slug === article.theme)?.label ?? article.theme;

            return (
              <Link className="entity-row grid gap-4 md:grid-cols-[0.35fr_1fr_auto] md:items-start" href={`/articles/${article.slug}`} key={article.slug}>
                <div>
                  <p className="metadata-label">{theme}</p>
                  <p className="mt-2 text-sm text-muted">{article.publishedAt} · {article.readingTime}</p>
                </div>
                <div>
                  {article.titleAr ? <p className="text-right text-xl text-ink" dir="rtl" lang="ar">{article.titleAr}</p> : null}
                  <h2 className="mt-1 text-lg font-medium text-ink">{article.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{article.summary}</p>
                </div>
                <StatusBadge status={article.status} />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
