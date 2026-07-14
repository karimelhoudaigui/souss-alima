import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SessionActionForm } from "@/components/actions";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/connexion");
  const sessions = await prisma.session.findMany({
    where: { studentId: session.user.id },
    include: { program: true, teacher: true },
    orderBy: { scheduledAt: "desc" }
  });
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-cedar">Calendrier des passages</h1>
      <div className="grid gap-3">
        {sessions.map((item) => (
          <article key={item.id} className="panel">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-saffron">{item.status}</p>
                <h2 className="font-bold text-cedar">{item.program.title}</h2>
                <p className="text-sm text-stone-600">{item.scheduledAt.toLocaleString("fr-FR")} - {item.durationMin} min</p>
                {item.notes && <p className="mt-2 text-sm">{item.notes}</p>}
              </div>
              {item.status === "PROPOSED" && <SessionActionForm id={item.id} />}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
