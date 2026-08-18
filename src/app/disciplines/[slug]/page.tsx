import { redirect } from "next/navigation";
import { getAllArticles } from "@/content/store";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function DisciplineRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/articles/${slug}`);
}
