import { ArticlesLiveList } from "@/components/articles/articles-live-list";
import { getAllArticles } from "@/content/store";

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return <ArticlesLiveList initialArticles={articles} />;
}
