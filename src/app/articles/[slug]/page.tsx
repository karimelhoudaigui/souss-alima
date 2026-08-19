import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/articles/article-detail";
import { getAllArticles, getAllMadrassas, getAllScholars } from "@/content/store";

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const params = articles.map((article) => ({ slug: article.slug }));
  return params.length ? params : [{ slug: "_" }];
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getAllArticles();
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  const [scholars, madrassas] = await Promise.all([getAllScholars(), getAllMadrassas()]);
  return <ArticleDetail article={article} madrassas={madrassas} scholars={scholars} />;
}
