import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const programs = await prisma.program.findMany({
    where: { isPublished: true },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" }, include: { documents: true } } } } },
    orderBy: [{ type: "asc" }, { title: "asc" }]
  });
  return NextResponse.json(programs);
}
