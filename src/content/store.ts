import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  articles as staticArticles,
  madrassas as staticMadrassas,
  scholars as staticScholars,
  type Article,
  type Madrassa,
  type Scholar,
  type VerificationStatus
} from "@/content/data";
import { getSupabaseAdminClient, getSupabasePublicClient, hasSupabasePublicConfig } from "@/lib/supabase";

type LegacyArticle = Article & {
  importance?: string;
  referenceTexts?: string[];
  pedagogy?: string;
};

type ContentStore = {
  madrassas: Madrassa[];
  articles: Article[];
  scholars?: Scholar[];
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
  scholars?: string[];
  sources?: string[];
  image?: string;
  imageCredit?: string;
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
  scholarSlugs?: string[];
  madrassaSlugs?: string[];
  image?: string;
  imageCredit?: string;
  status?: VerificationStatus;
};

export type ScholarInput = {
  nameFr: string;
  nameAr?: string;
  nisba?: string;
  period?: string;
  places?: string;
  specialties?: string[];
  madrassas?: string[];
  teachers?: string[];
  students?: string[];
  works?: string[];
  biography: string;
  sources?: string[];
  image?: string;
  imageCredit?: string;
  status?: VerificationStatus;
};

type MadrassaRow = {
  slug: string;
  name: string;
  name_ar: string | null;
  village: string | null;
  commune: string;
  province: string;
  lat: number;
  lng: number;
  specialties: string[];
  history: string;
  current_status: string | null;
  contact: string | null;
  scholars: string[];
  sources: string[];
  image: string | null;
  image_credit: string | null;
  status: VerificationStatus;
  featured: boolean | null;
};

type ArticleRow = {
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

type ScholarRow = {
  slug: string;
  name: string;
  arabic_name: string | null;
  nisba: string | null;
  period: string | null;
  places: string | null;
  specialties: string[];
  madrassa_slugs: string[];
  teachers: string[];
  students: string[];
  works: string[];
  biography: string;
  sources: string[];
  image: string | null;
  image_credit: string | null;
  status: VerificationStatus;
  featured: boolean | null;
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

function parseReadingTime(value: string | undefined) {
  const parsed = Number(String(value ?? "").match(/\d+/)?.[0] ?? 5);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

function mapMadrassa(row: MadrassaRow): Madrassa {
  return {
    slug: row.slug,
    name: row.name,
    nameAr: row.name_ar ?? "",
    village: row.village ?? "Non renseigne",
    commune: row.commune,
    province: row.province,
    lat: row.lat,
    lng: row.lng,
    specialties: row.specialties ?? [],
    history: row.history,
    currentStatus: row.current_status ?? "A verifier",
    contact: row.contact ?? "Non renseigne",
    scholars: row.scholars ?? [],
    sources: row.sources ?? [],
    image: row.image ?? undefined,
    imageCredit: row.image_credit ?? undefined,
    status: row.status,
    featured: row.featured ?? false
  };
}

function mapArticle(row: ArticleRow): Article {
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

function mapScholar(row: ScholarRow): Scholar {
  return {
    slug: row.slug,
    nameFr: row.name,
    nameAr: row.arabic_name ?? "",
    nisba: row.nisba ?? "",
    period: row.period ?? "A verifier",
    places: row.places ?? "A verifier",
    specialties: row.specialties ?? [],
    madrassas: row.madrassa_slugs ?? [],
    teachers: row.teachers ?? [],
    students: row.students ?? [],
    works: row.works ?? [],
    biography: row.biography,
    sources: row.sources ?? [],
    image: row.image ?? undefined,
    imageCredit: row.image_credit ?? undefined,
    status: row.status,
    featured: row.featured ?? false
  };
}

async function getSupabaseMadrassas() {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("madrassas")
    .select("*")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase madrassas read failed", error.message);
    return null;
  }

  return (data as MadrassaRow[]).map(mapMadrassa);
}

async function getSupabaseArticles() {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Supabase articles read failed", error.message);
    return null;
  }

  return (data as ArticleRow[]).map(mapArticle);
}

async function getSupabaseScholars() {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("scholars")
    .select("*")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase scholars read failed", error.message);
    return null;
  }

  return (data as ScholarRow[]).map(mapScholar);
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
      articles,
      scholars: Array.isArray(parsed.scholars) ? parsed.scholars : []
    };
  } catch {
    return { madrassas: [], articles: [], scholars: [] };
  }
}

async function writeStore(store: ContentStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  const tempPath = `${storePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify({ madrassas: store.madrassas, articles: store.articles, scholars: store.scholars ?? [] }, null, 2)}\n`, "utf8");
  await rename(tempPath, storePath);
}

function splitList(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  if (!value) return [];
  return value.split(";").map((item) => item.trim()).filter(Boolean);
}

async function markSupabaseReadAsDynamic() {
  if (process.env.GITHUB_ACTIONS === "true") return;
  const { unstable_noStore: noStore } = await import("next/cache");
  noStore();
}

export async function getAllMadrassas() {
  if (hasSupabasePublicConfig() && process.env.GITHUB_ACTIONS !== "true") {
    await markSupabaseReadAsDynamic();
    const madrassas = await getSupabaseMadrassas();
    if (madrassas) return madrassas;
  }

  const store = await readStore();
  return [...staticMadrassas, ...store.madrassas];
}

export async function getAllArticles() {
  if (hasSupabasePublicConfig() && process.env.GITHUB_ACTIONS !== "true") {
    await markSupabaseReadAsDynamic();
    const articles = await getSupabaseArticles();
    if (articles) return articles;
  }

  const store = await readStore();
  return [...staticArticles, ...store.articles];
}

export async function getAllScholars() {
  if (hasSupabasePublicConfig() && process.env.GITHUB_ACTIONS !== "true") {
    await markSupabaseReadAsDynamic();
    const scholars = await getSupabaseScholars();
    if (scholars) return scholars;
  }

  const store = await readStore();
  return [...staticScholars, ...(store.scholars ?? [])];
}

export async function createMadrassa(input: MadrassaInput) {
  const supabase = getSupabaseAdminClient();
  if (hasSupabasePublicConfig() && !supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manque cote serveur.");
  }

  if (supabase) {
    const existing = await getSupabaseMadrassas();
    const existingSlugs = new Set((existing ?? []).map((madrassa) => madrassa.slug));
    const slug = uniqueSlug(slugify(input.name), existingSlugs);
    const { data, error } = await supabase
      .from("madrassas")
      .insert({
        slug,
        name: input.name.trim(),
        name_ar: input.nameAr?.trim() || null,
        village: input.village?.trim() || null,
        commune: input.commune.trim(),
        province: input.province.trim(),
        lat: input.lat,
        lng: input.lng,
        specialties: input.specialties,
        history: input.history.trim(),
        current_status: input.currentStatus?.trim() || null,
        contact: input.contact?.trim() || null,
        scholars: input.scholars ?? [],
        sources: input.sources ?? [],
        image: input.image?.trim() || null,
        image_credit: input.imageCredit?.trim() || null,
        status: input.status ?? "to_verify",
        featured: false
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapMadrassa(data as MadrassaRow);
  }

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
    scholars: input.scholars ?? [],
    sources: input.sources ?? [],
    image: input.image?.trim() || undefined,
    imageCredit: input.imageCredit?.trim() || undefined,
    status: input.status ?? "to_verify"
  };

  store.madrassas.push(madrassa);
  await writeStore(store);
  return madrassa;
}

export async function createArticle(input: ArticleInput) {
  const supabase = getSupabaseAdminClient();
  if (hasSupabasePublicConfig() && !supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manque cote serveur.");
  }

  if (supabase) {
    const existing = await getSupabaseArticles();
    const existingSlugs = new Set((existing ?? []).map((article) => article.slug));
    const slug = uniqueSlug(slugify(input.title), existingSlugs);
    const { data, error } = await supabase
      .from("articles")
      .insert({
        slug,
        title: input.title.trim(),
        title_ar: input.titleAr?.trim() || null,
        theme: input.theme?.trim() || "recherche-etudes",
        author: input.author?.trim() || "Equipe editoriale",
        published_at: input.publishedAt?.trim() || new Date().toISOString().slice(0, 10),
        reading_time: parseReadingTime(input.readingTime),
        excerpt: input.summary.trim(),
        content: input.body?.trim() || "A completer avec sources.",
        sources: input.sources?.length ? input.sources : ["A completer avec sources."],
        tags: input.tags ?? [],
        scholar_slugs: input.scholarSlugs ?? [],
        madrassa_slugs: input.madrassaSlugs ?? [],
        image: input.image?.trim() || null,
        image_credit: input.imageCredit?.trim() || null,
        status: input.status ?? "to_verify"
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapArticle(data as ArticleRow);
  }

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
    scholarSlugs: input.scholarSlugs ?? [],
    madrassaSlugs: input.madrassaSlugs ?? [],
    image: input.image?.trim() || undefined,
    imageCredit: input.imageCredit?.trim() || undefined,
    status: input.status ?? "to_verify"
  };

  store.articles.push(article);
  await writeStore(store);
  return article;
}

export async function createScholar(input: ScholarInput) {
  const supabase = getSupabaseAdminClient();
  if (hasSupabasePublicConfig() && !supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manque cote serveur.");
  }

  if (supabase) {
    const existing = await getSupabaseScholars();
    const existingSlugs = new Set((existing ?? []).map((scholar) => scholar.slug));
    const slug = uniqueSlug(slugify(input.nameFr), existingSlugs);
    const { data, error } = await supabase
      .from("scholars")
      .insert({
        slug,
        name: input.nameFr.trim(),
        arabic_name: input.nameAr?.trim() || null,
        nisba: input.nisba?.trim() || null,
        period: input.period?.trim() || null,
        places: input.places?.trim() || null,
        specialties: input.specialties ?? [],
        madrassa_slugs: input.madrassas ?? [],
        teachers: input.teachers ?? [],
        students: input.students ?? [],
        works: input.works ?? [],
        biography: input.biography.trim(),
        sources: input.sources ?? [],
        image: input.image?.trim() || null,
        image_credit: input.imageCredit?.trim() || null,
        status: input.status ?? "to_verify",
        featured: false
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return mapScholar(data as ScholarRow);
  }

  const store = await readStore();
  const existingSlugs = new Set([...staticScholars, ...(store.scholars ?? [])].map((scholar) => scholar.slug));
  const slug = uniqueSlug(slugify(input.nameFr), existingSlugs);

  const scholar: Scholar = {
    slug,
    nameFr: input.nameFr.trim(),
    nameAr: input.nameAr?.trim() || "",
    nisba: input.nisba?.trim() || "",
    period: input.period?.trim() || "A verifier",
    places: input.places?.trim() || "A verifier",
    specialties: input.specialties ?? [],
    madrassas: input.madrassas ?? [],
    teachers: input.teachers ?? [],
    students: input.students ?? [],
    works: input.works ?? [],
    biography: input.biography.trim(),
    sources: input.sources ?? [],
    image: input.image?.trim() || undefined,
    imageCredit: input.imageCredit?.trim() || undefined,
    status: input.status ?? "to_verify"
  };

  store.scholars = [...(store.scholars ?? []), scholar];
  await writeStore(store);
  return scholar;
}

export function normalizeList(value: unknown) {
  if (Array.isArray(value)) return splitList(value.filter((item): item is string => typeof item === "string"));
  if (typeof value === "string") return splitList(value);
  return [];
}
