import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/connexion");
  const [enrollments, nextSession, notifications] = await Promise.all([
    prisma.enrollment.findMany({ where: { userId: session.user.id }, include: { program: true, memorizationLog: { orderBy: { createdAt: "desc" }, take: 1 } } }),
    prisma.session.findFirst({ where: { studentId: session.user.id, scheduledAt: { gte: new Date() }, status: { in: ["PROPOSED", "CONFIRMED"] } }, include: { program: true }, orderBy: { scheduledAt: "asc" } }),
    prisma.notification.findMany({ where: { userId: session.user.id }, take: 5, orderBy: { createdAt: "desc" } })
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-cedar">Tableau de bord</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/disponibilites" className="panel">Déclarer une disponibilité</Link>
        <Link href="/dashboard/calendrier" className="panel">Voir mes passages</Link>
        <Link href="/dashboard/notifications" className="panel">Notifications</Link>
      </div>
      {nextSession && (
        <section className="panel">
          <h2 className="font-semibold text-cedar">Prochain passage</h2>
          <p className="mt-2 text-sm">{nextSession.program.title} - {nextSession.scheduledAt.toLocaleString("fr-FR")} - {nextSession.status}</p>
        </section>
      )}
      <section className="grid gap-4 md:grid-cols-2">
        {enrollments.map((enrollment) => (
          <Link className="panel block" key={enrollment.id} href={`/dashboard/programmes/${enrollment.program.slug}`}>
            <p className="text-xs font-semibold uppercase text-saffron">{enrollment.status}</p>
            <h2 className="mt-1 font-bold text-cedar">{enrollment.program.title}</h2>
            {enrollment.memorizationLog[0] && <p className="mt-2 text-sm text-stone-600">Dernier point : {enrollment.memorizationLog[0].surah}, page {enrollment.memorizationLog[0].page}</p>}
          </Link>
        ))}
      </section>
      <section className="panel">
        <h2 className="font-semibold text-cedar">Dernières notifications</h2>
        <ul className="mt-3 space-y-2 text-sm text-stone-700">
          {notifications.map((item) => <li key={item.id}>{item.message}</li>)}
        </ul>
      </section>
    </div>
  );
}
