import { NextResponse, type NextRequest } from "next/server";
import { createArticle, normalizeList } from "@/content/store";
import type { VerificationStatus } from "@/content/data";

const allowedStatuses = new Set<VerificationStatus>(["example", "to_verify", "sourced"]);

export async function POST(request: NextRequest) {
  try {
    const moderatorKey = process.env.MODERATOR_KEY;
    if (moderatorKey && request.headers.get("x-moderator-key") !== moderatorKey) {
      return NextResponse.json({ error: "Acces moderateur refuse." }, { status: 401 });
    }

    const body = await request.json() as Record<string, unknown>;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const summary = typeof body.summary === "string" ? body.summary.trim() : "";
    const bodyText = typeof body.body === "string" ? body.body.trim() : "";
    const status = typeof body.status === "string" && allowedStatuses.has(body.status as VerificationStatus) ? body.status as VerificationStatus : "to_verify";

    if (!title || !summary || !bodyText) {
      return NextResponse.json({ error: "Titre, resume et contenu sont obligatoires." }, { status: 400 });
    }

    const article = await createArticle({
      title,
      titleAr: typeof body.titleAr === "string" ? body.titleAr : "",
      theme: typeof body.theme === "string" ? body.theme : "",
      author: typeof body.author === "string" ? body.author : "",
      publishedAt: typeof body.publishedAt === "string" ? body.publishedAt : "",
      readingTime: typeof body.readingTime === "string" ? body.readingTime : "",
      summary,
      body: bodyText,
      sources: normalizeList(body.sources),
      tags: normalizeList(body.tags),
      scholarSlugs: normalizeList(body.scholarSlugs),
      madrassaSlugs: normalizeList(body.madrassaSlugs),
      image: typeof body.image === "string" ? body.image : "",
      imageCredit: typeof body.imageCredit === "string" ? body.imageCredit : "",
      status
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Impossible de publier cet article." },
      { status: 500 }
    );
  }
}
