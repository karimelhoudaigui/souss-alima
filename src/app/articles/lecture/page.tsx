import { Suspense } from "react";
import { ArticleLiveReader } from "@/components/articles/article-live-reader";

export default function ArticleReaderPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-sm text-muted">Chargement de l'article...</div>}>
      <ArticleLiveReader />
    </Suspense>
  );
}
