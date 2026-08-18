import { NextResponse, type NextRequest } from "next/server";
import { createMadrassa, normalizeList } from "@/content/store";
import type { VerificationStatus } from "@/content/data";

const allowedStatuses = new Set<VerificationStatus>(["example", "to_verify", "sourced"]);

export async function POST(request: NextRequest) {
  try {
    const moderatorKey = process.env.MODERATOR_KEY;
    if (moderatorKey && request.headers.get("x-moderator-key") !== moderatorKey) {
      return NextResponse.json({ error: "Acces moderateur refuse." }, { status: 401 });
    }

    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const commune = typeof body.commune === "string" ? body.commune.trim() : "";
    const province = typeof body.province === "string" ? body.province.trim() : "";
    const history = typeof body.history === "string" ? body.history.trim() : "";
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    const status = typeof body.status === "string" && allowedStatuses.has(body.status as VerificationStatus) ? body.status as VerificationStatus : "to_verify";

    if (!name || !commune || !province || !history || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ error: "Champs obligatoires manquants ou coordonnees invalides." }, { status: 400 });
    }

    const madrassa = await createMadrassa({
      name,
      nameAr: typeof body.nameAr === "string" ? body.nameAr : "",
      village: typeof body.village === "string" ? body.village : "",
      commune,
      province,
      lat,
      lng,
      specialties: normalizeList(body.specialties),
      history,
      currentStatus: typeof body.currentStatus === "string" ? body.currentStatus : "",
      contact: typeof body.contact === "string" ? body.contact : "",
      sources: normalizeList(body.sources),
      status
    });

    return NextResponse.json({ madrassa }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Impossible de publier cette madrassa." }, { status: 500 });
  }
}
