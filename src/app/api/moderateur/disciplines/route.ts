import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
  const response = await fetch(new URL("/api/moderateur/articles", request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-moderator-key": request.headers.get("x-moderator-key") ?? ""
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
