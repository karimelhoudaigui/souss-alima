import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { articles as staticArticles, madrassas as staticMadrassas, type Article, type Madrassa, type VerificationStatus } from "@/content/data";

type LegacyArticle = Article & {
  importance?: string;
  referenceTexts?: string[];
  pedagogy?: string;
};

type ContentStore = {
  madrassas: Madrassa[];
  articles: Article[];
  disciplines?: LegacyArticle[];
};

export type MadrassaInput = {
  name: string;
  nameAr?: string;
  village?: string;
  commune: string;
  province: string;
  lat: number;
  lng: number;
  specialties: string[];
  history: string;
  currentStatus?: string;
  contact?: string;
  sources?: string[];
  status?: VerificationStatus;
};

export type ArticleInput = {
  title: string;
  titleAr?: string;
  theme?: string;
  author?: string;
  publishedAt?: string;
  readingTime?: string;
  summary: string;
  body?: string;
  sources?: string[];
  tags?: string[];
  status?: VerificationStatus;
};

const storePath = path.join(process.cwd(), "data", "content-store.json");

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function uniqueSlug(base: string, existingSlugs: Set<string>) {
  let slug = base || "contenu";
  let index = 2;

  while (existingSlugs.has(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }

  return slug;
}

function migrateLegacyArticle(item: LegacyArticle): Article {
  const legacyBody = [item.importance, item.pedagogy].filter(Boolean).join("\n\n");

  return {
    slug: item.slug,
    title: item.title,
    titleAr: item.titleAr ?? "",
    theme: item.theme ?? "recherche-etudes",
    author: item.author ?? "Equipe editoriale",
    publishedAt: item.publishedAt ?? "2026-08-18",
    readingTime: item.readingTime ?? "5 min",
    summary: item.summary,
    body: item.body ?? (legacyBody || "A completer avec sources."),
    sources: item.sources ?? item.referenceTexts ?? ["A completer avec sources."],
    tags: item.tags ?? [],
    scholarSlugs: item.scholarSlugs ?? [],
    madrassaSlugs: item.madrassaSlugs ?? [],
    status: item.status ?? "to_verify"
  };
}

async function readStore(): Promise<ContentStore> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<ContentStore>;
    const articles = Array.isArray(parsed.articles)
      ? parsed.articles.map(migrateLegacyArticle)
      : Array.isArray(parsed.disciplines)
        ? parsed.disciplines.map(migrateLegacyArticle)
        : [];

    return {
      madrassas: Array.isArray(parsed.madrassas) ? parsed.madrassas : [],
      articles
    };
  } catch {
    return { madrassas: [], articles: [] };
  }
}

async function writeStore(store: ContentStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  const tempPath = `${storePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify({ madrassas: store.madrassas, articles: store.articles }, null, 2)}\n`, "utf8");
  await rename(tempPath, storePath);
}

function splitList(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  if (!value) return [];
  return value.split(";").map((item) => item.trim()).filter(Boolean);
}

export async function getAllMadrassas() {
  const store = await readStore();
  return [...staticMadrassas, ...store.madrassas];
}

export async function getAllArticles() {
  const store = await readStore();
  return [...staticArticles, ...store.articles];
}

export async function createMadrassa(input: MadrassaInput) {
  const store = await readStore();
  const existingSlugs = new Set([...staticMadrassas, ...store.madrassas].map((madrassa) => madrassa.slug));
  const slug = uniqueSlug(slugify(input.name), existingSlugs);

  const madrassa: Madrassa = {
    slug,
    name: input.name.trim(),
    nameAr: input.nameAr?.trim() || "",
    village: input.village?.trim() || "Non renseigne",
    commune: input.commune.trim(),
    province: input.province.trim(),
    lat: input.lat,
    lng: input.lng,
    specialties: input.specialties,
    history: input.history.trim(),
    currentStatus: input.currentStatus?.trim() || "A verifier",
    contact: input.contact?.trim() || "Non renseigne",
    scholars: [],
    sources: input.sources ?? [],
    image: undefined,
    imageCredit: undefined,
    status: input.status ?? "to_verify"
  };

  store.madrassas.push(madrassa);
  await writeStore(store);
  return madrassa;
}

export async function createArticle(input: ArticleInput) {
  const store = await readStore();
  const existingSlugs = new Set([...staticArticles, ...store.articles].map((article) => article.slug));
  const slug = uniqueSlug(slugify(input.title), existingSlugs);

  const article: Article = {
    slug,
    title: input.title.trim(),
    titleAr: input.titleAr?.trim() || "",
    theme: input.theme?.trim() || "recherche-etudes",
    author: input.author?.trim() || "Equipe editoriale",
    publishedAt: input.publishedAt?.trim() || new Date().toISOString().slice(0, 10),
    readingTime: input.readingTime?.trim() || "5 min",
    summary: input.summary.trim(),
    body: input.body?.trim() || "A completer avec sources.",
    sources: input.sources?.length ? input.sources : ["A completer avec sources."],
    tags: input.tags ?? [],
    scholarSlugs: [],
    madrassaSlugs: [],
    status: input.status ?? "to_verify"
  };

  store.articles.push(article);
  await writeStore(store);
  return article;
}

export function normalizeList(value: unknown) {
  if (Array.isArray(value)) return splitList(value.filter((item): item is string => typeof item === "string"));
  if (typeof value === "string") return splitList(value);
  return [];
}
