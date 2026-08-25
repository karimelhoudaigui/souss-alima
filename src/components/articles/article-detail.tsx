import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { themes, type Article, type Madrassa, type Scholar } from "@/content/data";
import { publicAsset } from "@/lib/assets";

const arabicPattern = /[\u0600-\u06ff]/;

function formatArticleDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function articleParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function renderInlineArabic(text: string) {
  const parts = text.split(/([\u0600-\u06ff][\u0600-\u06ff\sـ،؛؟«»'"().:\-]*[\u0600-\u06ff])/g);

  return parts.map((part, index) => {
    if (!part) return null;
    if (!arabicPattern.test(part)) return part;

    return (
      <span className="article-arabic-inline" dir="rtl" lang="ar" key={`${part}-${index}`}>
        {part}
      </span>
    );
  });
}

export function ArticleDetail({ article, madrassas = [], scholars = [] }: { article: Article; madrassas?: Madrassa[]; scholars?: Scholar[] }) {
  const theme = themes.find((item) => item.slug === article.theme)?.label ?? article.theme;
  const linkedScholars = scholars.filter((scholar) => article.scholarSlugs.includes(scholar.slug));
  const linkedMadrassas = madrassas.filter((madrassa) => article.madrassaSlugs.includes(madrassa.slug));
  const paragraphs = articleParagraphs(article.body);
  const meta = [article.author, formatArticleDate(article.publishedAt), article.readingTime].filter(Boolean);

  return (
    <article className="article-reading-page">
      <header className="border-b border-line bg-surface/55">
        <div className="container-page grid gap-8 py-8 md:py-12 lg:grid-cols-[minmax(0,0.74fr)_minmax(240px,0.26fr)] lg:items-end">
          <div>
            <Link className="ui-sans text-sm font-medium text-muted transition hover:text-ink" href="/articles">
              ← Tous les articles
            </Link>
            <p className="page-kicker mt-8">{theme}</p>
            {article.titleAr ? <p className="article-title-ar mt-5" dir="rtl" lang="ar">{article.titleAr}</p> : null}
            <h1 className="article-title-fr mt-4">{renderInlineArabic(article.title)}</h1>
            <p className="article-summary">{article.summary}</p>
          </div>

          <div className="ui-sans border-t border-line pt-5 text-sm text-muted lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 lg:grid lg:gap-3">
              {meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
              <StatusBadge status={article.status} />
            </div>
          </div>
        </div>
      </header>

      {article.image ? (
        <div className="container-page py-6 md:py-8">
          <figure className="overflow-hidden border-y border-line bg-subtle md:border">
            <Image alt="" className="h-[240px] w-full object-cover md:h-[430px]" height={840} priority sizes="(max-width: 768px) 100vw, 1200px" src={publicAsset(article.image) ?? ""} unoptimized width={2400} />
            {article.imageCredit ? <figcaption className="ui-sans border-t border-line px-4 py-3 text-xs leading-5 text-muted">{article.imageCredit}</figcaption> : null}
          </figure>
        </div>
      ) : null}

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,800px)_minmax(240px,320px)] lg:justify-between lg:py-14">
        <main className="article-reader">
          <section className="border-b border-line pb-10">
            <div className="article-body">
              {paragraphs.map((paragraph, index) => {
                const isArabicParagraph = arabicPattern.test(paragraph) && paragraph.replace(/[^\u0600-\u06ff]/g, "").length > paragraph.length * 0.35;

                return (
                  <p className={isArabicParagraph ? "article-arabic-paragraph" : undefined} dir={isArabicParagraph ? "rtl" : undefined} lang={isArabicParagraph ? "ar" : undefined} key={`${index}-${paragraph.slice(0, 32)}`}>
                    {isArabicParagraph ? paragraph : renderInlineArabic(paragraph)}
                  </p>
                );
              })}
            </div>
          </section>

          <section className="border-b border-line py-10">
            <h2 className="section-title">Sources</h2>
            <div className="mt-5 divide-y divide-line border-y border-line">
              {article.sources.map((source, index) => (
                <div className="grid gap-3 py-5 md:grid-cols-[72px_1fr]" key={source}>
                  <span className="metadata-label">SRC {String(index + 1).padStart(2, "0")}</span>
                  <p className="ui-sans text-sm leading-6 text-muted">{renderInlineArabic(source)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-8 pt-10 md:grid-cols-2">
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

        <aside className="article-sidebar h-fit border-t border-line pt-6 lg:sticky lg:top-24 lg:border-t-0 lg:pt-0">
          <dl className="grid gap-5 text-sm lg:border-l lg:border-line lg:pl-6">
            <div>
              <dt className="metadata-label">Theme</dt>
              <dd className="metadata-value">{theme}</dd>
            </div>
            {article.tags.length ? (
              <div>
                <dt className="metadata-label">Tags</dt>
                <dd className="ui-sans mt-2 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span className="border border-line bg-surface px-2.5 py-1 text-xs text-muted" key={tag}>{tag}</span>
                  ))}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="metadata-label">Verification</dt>
              <dd className="metadata-value"><StatusBadge status={article.status} /></dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
