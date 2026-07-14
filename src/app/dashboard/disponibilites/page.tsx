import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AvailabilityForm } from "@/components/forms";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default async function AvailabilityPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/connexion");
  const [programs, availabilities] = await Promise.all([
    prisma.program.findMany({ where: { enrollments: { some: { userId: session.user.id, status: "ACTIVE" } } } }),
    prisma.availability.findMany({ where: { userId: session.user.id }, include: { program: true }, orderBy: { createdAt: "desc" } })
  ]);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-cedar">Mes disponibilités</h1>
      <AvailabilityForm programs={programs} />
      <div className="grid gap-3">
        {availabilities.map((item) => (
          <div key={item.id} className="panel">
            <p className="font-semibold text-cedar">{item.program?.title ?? "Tous programmes"}</p>
            <p className="text-sm text-stone-600">
              {item.isRecurring ? days[item.dayOfWeek ?? 0] : item.date?.toLocaleDateString("fr-FR")} de {item.startTime} à {item.endTime}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
