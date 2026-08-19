"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { themes, type Article } from "@/content/data";
import { mapArticleRow, type ArticleRow } from "@/lib/content-mappers";
import { supabaseBrowser } from "@/lib/supabase-browser";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function articleKey(article: Article) {
  return normalize(article.title.trim()).replace(/[^a-z0-9]+/g, "-") || article.slug;
}

function articleTime(article: Article) {
  const parsed = Date.parse(article.publishedAt);
  return Number.isFinite(parsed) ? parsed : 0;
}

function dedupeArticles(articles: Article[]) {
  const seen = new Set<string>();

  return [...articles]
    .sort((a, b) => articleTime(b) - articleTime(a))
    .filter((article) => {
      const key = articleKey(article);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function articleHaystack(article: Article) {
  return normalize(
    [
      article.title,
      article.titleAr,
      article.summary,
      article.author,
      article.theme,
      article.body,
      ...article.tags,
      ...article.sources,
      ...article.scholarSlugs,
      ...article.madrassaSlugs
    ].join(" ")
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function ArticlesLiveList({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(() => dedupeArticles(initialArticles));
  const [query, setQuery] = useState("");
  const [activeTheme, setActiveTheme] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      const { data, error } = await supabaseBrowser
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (!ignore && !error && data) {
        setArticles(dedupeArticles([...initialArticles, ...(data as ArticleRow[]).map(mapArticleRow)]));
      }
      if (!ignore) setLoading(false);
    }

    void loadArticles();
    return () => {
      ignore = true;
    };
  }, [initialArticles]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return articles.filter((article) => {
      const matchesTheme = activeTheme === "all" || article.theme === activeTheme;
      const matchesQuery = !normalizedQuery || articleHaystack(article).includes(normalizedQuery);
      return matchesTheme && matchesQuery;
    });
  }, [activeTheme, articles, query]);

  const featured = filteredArticles[0];
  const remaining = featured ? filteredArticles.slice(1) : [];
  const hasActiveFilters = query || activeTheme !== "all";

  return (
    <div className="container-page py-8 md:py-12">
      <div className="grid gap-6 border-b border-line pb-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <p className="page-kicker">Revue editoriale</p>
          <h1 className="mt-3 text-4xl font-medium text-ink md:text-6xl">Articles</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg md:leading-8">
            Etudes, notes et dossiers relies aux madrassas, aux savants, aux sources et aux textes du Maroc savant.
          </p>
        </div>
        <div className="border-l border-line pl-5">
          <p className="metadata-label">Corpus</p>
          <p className="mt-1 text-3xl font-medium text-ink">{filteredArticles.length}</p>
          <p className="ui-sans mt-2 text-xs text-muted">{loading ? "Synchronisation Supabase..." : "Articles publics disponibles"}</p>
        </div>
      </div>

      <div className="grid gap-4 border-b border-line py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <form className="max-w-3xl" role="search">
          <label className="sr-only" htmlFor="article-search">Rechercher un article</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input
              className="input min-h-12 pl-12"
              id="article-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Titre, theme, auteur, source, savant, madrassa..."
              value={query}
            />
          </div>
        </form>
        {hasActiveFilters ? (
          <button className="button-secondary justify-self-start" onClick={() => { setQuery(""); setActiveTheme("all"); }} type="button">
            <X className="mr-2 h-4 w-4" aria-hidden="true" />
            Reinitialiser
          </button>
        ) : null}
      </div>

      <div className="flex gap-5 overflow-x-auto border-b border-line py-4">
        <button className={`filter-chip shrink-0 ${activeTheme === "all" ? "border-brand text-ink" : ""}`} onClick={() => setActiveTheme("all")} type="button">
          Tous les themes
        </button>
        {themes.map((theme) => (
          <button
            className={`filter-chip shrink-0 ${activeTheme === theme.slug ? "border-brand text-ink" : ""}`}
            onClick={() => setActiveTheme(theme.slug)}
            type="button"
            key={theme.slug}
          >
            {theme.label}
          </button>
        ))}
      </div>

      {featured ? (
        <section className="grid gap-8 border-b border-line py-8 lg:grid-cols-[0.42fr_1fr]">
          <ArticleMeta article={featured} />
          <Link className="group block" href={`/articles/${featured.slug}`}>
            {featured.titleAr ? <p className="text-right text-3xl leading-[1.45] text-ink md:text-4xl" dir="rtl" lang="ar">{featured.titleAr}</p> : null}
            <h2 className="mt-3 max-w-4xl text-3xl font-medium leading-tight text-ink md:text-5xl">{featured.title}</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted md:text-lg md:leading-9">{featured.summary}</p>
            <span className="ui-sans mt-6 inline-flex border-b border-brand text-sm font-medium text-brand transition group-hover:text-brand-hover">
              Lire l'article
            </span>
          </Link>
        </section>
      ) : (
        <div className="py-10 text-sm leading-6 text-muted">Aucun article ne correspond a cette recherche.</div>
      )}

      {remaining.length ? (
        <section className="py-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="page-kicker">Chronologie</p>
              <h2 className="section-title mt-2">Toutes les publications</h2>
            </div>
            <p className="ui-sans text-sm text-muted">{remaining.length} autre{remaining.length > 1 ? "s" : ""}</p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {remaining.map((article) => (
              <Link className="entity-row grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-start" href={`/articles/${article.slug}`} key={article.slug}>
                <ArticleMeta article={article} />
                <div>
                  {article.titleAr ? <p className="text-right text-xl leading-8 text-ink" dir="rtl" lang="ar">{article.titleAr}</p> : null}
                  <h2 className="mt-1 text-xl font-medium leading-7 text-ink">{article.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{article.summary}</p>
                </div>
                <StatusBadge status={article.status} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ArticleMeta({ article }: { article: Article }) {
  const theme = themes.find((item) => item.slug === article.theme)?.label ?? article.theme;

  return (
    <div className="ui-sans text-sm text-muted">
      <p className="metadata-label">{theme}</p>
      <p className="mt-2">{formatDate(article.publishedAt)}</p>
      <p className="mt-1">{article.readingTime}</p>
      <p className="mt-3 text-xs text-faint">{article.author}</p>
    </div>
  );
}
