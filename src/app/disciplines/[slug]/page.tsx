import { redirect } from "next/navigation";
import { getAllArticles } from "@/content/store";

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  const params = articles.map((article) => ({ slug: article.slug }));
  return params.length ? params : [{ slug: "_" }];
}

export default async function DisciplineRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/articles/${slug}`);
}
