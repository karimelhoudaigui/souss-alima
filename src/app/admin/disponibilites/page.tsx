import { ProposeSessionForm } from "@/components/actions";
import { prisma } from "@/lib/prisma";

const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export default async function AdminAvailabilitiesPage() {
  const availabilities = await prisma.availability.findMany({ include: { user: true, program: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-cedar">Planification des passages</h1>
      {availabilities.map((item) => (
        <article key={item.id} className="panel">
          <p className="font-semibold text-cedar">{item.user.name} - {item.program?.title ?? "Tous programmes"}</p>
          <p className="text-sm text-stone-600">{item.isRecurring ? days[item.dayOfWeek ?? 0] : item.date?.toLocaleDateString("fr-FR")} de {item.startTime} à {item.endTime}</p>
          {item.programId && <ProposeSessionForm availabilityId={item.id} />}
        </article>
      ))}
    </div>
  );
}
