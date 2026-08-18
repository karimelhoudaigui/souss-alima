"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { themes, type Article } from "@/content/data";
import { mapArticleRow, type ArticleRow } from "@/lib/content-mappers";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function ArticlesLiveList({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState(initialArticles);
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

      if (!ignore && !error && data) setArticles((data as ArticleRow[]).map(mapArticleRow));
      if (!ignore) setLoading(false);
    }

    void loadArticles();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesTheme = activeTheme === "all" || article.theme === activeTheme;
      const haystack = [article.title, article.titleAr, article.summary, article.author, article.theme, ...article.tags, ...article.sources].join(" ").toLowerCase();
      return matchesTheme && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeTheme, articles, query]);

  return (
    <>
      <div className="max-w-2xl">
        <label className="sr-only" htmlFor="article-search">Rechercher un article</label>
        <input className="input min-h-12" id="article-search" onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un article, un theme ou une source" value={query} />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button className="filter-chip" onClick={() => setActiveTheme("all")} type="button">Tous</button>
        {themes.map((theme) => (
          <button className="filter-chip" onClick={() => setActiveTheme(theme.slug)} type="button" key={theme.slug}>{theme.label}</button>
        ))}
      </div>

      <section className="mt-8 pb-12">
        <div className="mb-4 text-sm text-muted">
          {loading ? "Synchronisation avec Supabase..." : `${filteredArticles.length} article${filteredArticles.length > 1 ? "s" : ""}`}
        </div>
        <div className="max-w-5xl divide-y divide-line border-y border-line">
          {filteredArticles.map((article) => {
            const theme = themes.find((item) => item.slug === article.theme)?.label ?? article.theme;

            return (
              <Link className="entity-row grid gap-4 md:grid-cols-[0.35fr_1fr_auto] md:items-start" href={`/articles/lecture?slug=${article.slug}`} key={article.slug}>
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
    </>
  );
}
