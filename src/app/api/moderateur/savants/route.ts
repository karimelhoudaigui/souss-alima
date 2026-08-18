import { NextResponse, type NextRequest } from "next/server";
import type { VerificationStatus } from "@/content/data";
import { createScholar, normalizeList } from "@/content/store";

const allowedStatuses = new Set<VerificationStatus>(["example", "to_verify", "sourced"]);

export async function POST(request: NextRequest) {
  try {
    const moderatorKey = process.env.MODERATOR_KEY;
    if (moderatorKey && request.headers.get("x-moderator-key") !== moderatorKey) {
      return NextResponse.json({ error: "Acces moderateur refuse." }, { status: 401 });
    }

    const body = await request.json() as Record<string, unknown>;
    const nameFr = typeof body.nameFr === "string" ? body.nameFr.trim() : "";
    const biography = typeof body.biography === "string" ? body.biography.trim() : "";
    const status = typeof body.status === "string" && allowedStatuses.has(body.status as VerificationStatus) ? body.status as VerificationStatus : "to_verify";

    if (!nameFr || !biography) {
      return NextResponse.json({ error: "Nom et biographie sont obligatoires." }, { status: 400 });
    }

    const scholar = await createScholar({
      nameFr,
      nameAr: typeof body.nameAr === "string" ? body.nameAr : "",
      nisba: typeof body.nisba === "string" ? body.nisba : "",
      period: typeof body.period === "string" ? body.period : "",
      places: typeof body.places === "string" ? body.places : "",
      specialties: normalizeList(body.specialties),
      madrassas: normalizeList(body.madrassas),
      teachers: normalizeList(body.teachers),
      students: normalizeList(body.students),
      works: normalizeList(body.works),
      biography,
      sources: normalizeList(body.sources),
      image: typeof body.image === "string" ? body.image : "",
      imageCredit: typeof body.imageCredit === "string" ? body.imageCredit : "",
      status
    });

    return NextResponse.json({ scholar }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Impossible de publier ce savant." },
      { status: 500 }
    );
  }
}
