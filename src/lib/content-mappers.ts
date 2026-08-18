import type { Article, VerificationStatus } from "@/content/data";

export type ArticleRow = {
  slug: string;
  title: string;
  title_ar?: string | null;
  excerpt: string;
  theme: string;
  author: string;
  published_at: string;
  reading_time: number;
  content: string;
  sources: string[];
  tags: string[];
  scholar_slugs: string[];
  madrassa_slugs: string[];
  image: string | null;
  image_credit: string | null;
  status: VerificationStatus;
};

export function mapArticleRow(row: ArticleRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    titleAr: row.title_ar ?? "",
    theme: row.theme,
    author: row.author,
    publishedAt: row.published_at,
    readingTime: `${row.reading_time} min`,
    summary: row.excerpt,
    body: row.content,
    sources: row.sources ?? [],
    tags: row.tags ?? [],
    scholarSlugs: row.scholar_slugs ?? [],
    madrassaSlugs: row.madrassa_slugs ?? [],
    image: row.image ?? undefined,
    imageCredit: row.image_credit ?? undefined,
    status: row.status
  };
}
