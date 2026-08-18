"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleDetail } from "@/components/articles/article-detail";
import type { Article } from "@/content/data";
import { mapArticleRow, type ArticleRow } from "@/lib/content-mappers";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function ArticleLiveReader() {
  const slug = useSearchParams().get("slug");
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      if (!slug) {
        setError("Article introuvable : slug manquant.");
        setLoading(false);
        return;
      }

      const { data, error: requestError } = await supabaseBrowser
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (ignore) return;
      if (requestError) setError(requestError.message);
      else if (!data) setError("Article introuvable.");
      else setArticle(mapArticleRow(data as ArticleRow));
      setLoading(false);
    }

    void loadArticle();
    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return <div className="container-page py-16 text-sm text-muted">Chargement de l'article...</div>;
  }

  if (error || !article) {
    return (
      <div className="container-text py-16">
        <p className="page-kicker">Article</p>
        <h1 className="page-title">Article non disponible</h1>
        <p className="page-description">{error || "Impossible de charger cet article."}</p>
        <Link className="button-primary mt-6 inline-flex" href="/articles">Retour aux articles</Link>
      </div>
    );
  }

  return <ArticleDetail article={article} />;
}
