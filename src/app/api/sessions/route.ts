import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { canMutateSession } from "@/lib/rbac";
import { isScheduledInsideAvailability } from "@/lib/scheduling";
import { sessionCreateSchema, sessionUpdateSchema } from "@/lib/validators";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const where = session.user.role === "STUDENT" ? { studentId: session.user.id } : {};
  const sessions = await prisma.session.findMany({
    where,
    include: { student: true, teacher: true, program: true },
    orderBy: { scheduledAt: "asc" }
  });
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = sessionCreateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const availability = await prisma.availability.findUnique({
    where: { id: parsed.data.availabilityId },
    include: { user: true, program: true }
  });
  if (!availability || !availability.programId) return NextResponse.json({ error: "Disponibilité introuvable ou sans programme." }, { status: 404 });
  if (!isScheduledInsideAvailability(availability, parsed.data.scheduledAt, parsed.data.durationMin)) {
    return NextResponse.json({ error: "Le passage doit être dans la disponibilité déclarée." }, { status: 400 });
  }
  const proposed = await prisma.session.create({
    data: {
      studentId: availability.userId,
      teacherId: parsed.data.teacherId ?? session.user.id,
      programId: availability.programId,
      scheduledAt: new Date(parsed.data.scheduledAt),
      durationMin: parsed.data.durationMin,
      status: "PROPOSED"
    },
    include: { program: true, student: true }
  });
  await notifyUser({
    userId: proposed.studentId,
    type: "SESSION_PROPOSED",
    message: `Un passage ${proposed.program.title} vous a été proposé.`,
    link: "/dashboard/calendrier",
    email: {
      to: proposed.student.email,
      subject: "Passage proposé",
      text: `Un passage ${proposed.program.title} vous a été proposé. Connectez-vous pour confirmer ou décliner.`
    }
  });
  return NextResponse.json(proposed, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const id = z.string().parse(body.id);
  const parsed = sessionUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await prisma.session.findUnique({ where: { id }, include: { student: true, program: true } });
  if (!existing || !canMutateSession(session.user.role, session.user.id, existing.studentId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (session.user.role === "STUDENT" && !["CONFIRMED", "CANCELLED"].includes(parsed.data.status)) {
    return NextResponse.json({ error: "Un élève peut seulement confirmer ou décliner." }, { status: 403 });
  }

  const updated = await prisma.session.update({
    where: { id },
    data: { status: parsed.data.status, notes: parsed.data.notes },
    include: { student: true, program: true }
  });

  if (parsed.data.status === "DONE") {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_programId: { userId: updated.studentId, programId: updated.programId } }
    });
    if (enrollment && parsed.data.surah) {
      await prisma.memorizationLog.create({
        data: {
          enrollmentId: enrollment.id,
          surah: parsed.data.surah,
          ayahFrom: parsed.data.ayahFrom,
          ayahTo: parsed.data.ayahTo,
          juz: parsed.data.juz,
          page: parsed.data.page,
          note: parsed.data.notes
        }
      });
    }
  }

  await notifyUser({
    userId: updated.studentId,
    type: parsed.data.status === "CONFIRMED" ? "SESSION_CONFIRMED" : "SYSTEM",
    message: `Votre passage ${updated.program.title} est maintenant ${updated.status}.`,
    link: "/dashboard/calendrier"
  });
  return NextResponse.json(updated);
}
