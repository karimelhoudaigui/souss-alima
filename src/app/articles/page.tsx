import { ArticlesLiveList } from "@/components/articles/articles-live-list";
import { PageHeader } from "@/components/ui";
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
        <ArticlesLiveList initialArticles={articles} />
      </PageHeader>
    </div>
  );
}
