import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateAvailabilityWindow } from "@/lib/scheduling";
import { availabilitySchema } from "@/lib/validators";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const where = session.user.role === "STUDENT" ? { userId: session.user.id } : {};
  const availabilities = await prisma.availability.findMany({
    where,
    include: { user: true, program: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(availabilities);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = availabilitySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  if (!validateAvailabilityWindow(parsed.data.startTime, parsed.data.endTime)) {
    return NextResponse.json({ error: "Le créneau horaire est invalide." }, { status: 400 });
  }
  const availability = await prisma.availability.create({
    data: {
      userId: session.user.id,
      programId: parsed.data.programId,
      dayOfWeek: parsed.data.dayOfWeek,
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      isRecurring: parsed.data.isRecurring
    }
  });
  return NextResponse.json(availability, { status: 201 });
}
