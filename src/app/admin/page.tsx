import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [students, upcoming, pending] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT", enrollments: { some: { status: "ACTIVE" } } } }),
    prisma.session.count({ where: { scheduledAt: { gte: new Date(), lte: new Date(Date.now() + 7 * 86400000) } } }),
    prisma.enrollment.count({ where: { status: "PENDING" } })
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-cedar">Back-office</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel"><p className="text-3xl font-bold">{students}</p><p>Élèves actifs</p></div>
        <div className="panel"><p className="text-3xl font-bold">{upcoming}</p><p>Passages à 7 jours</p></div>
        <div className="panel"><p className="text-3xl font-bold">{pending}</p><p>Inscriptions en attente</p></div>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        <Link className="panel" href="/admin/inscriptions">Inscriptions</Link>
        <Link className="panel" href="/admin/disponibilites">Planification</Link>
        <Link className="panel" href="/admin/calendrier">Calendrier</Link>
        <Link className="panel" href="/admin/utilisateurs">Utilisateurs</Link>
        <Link className="panel" href="/admin/programmes">Programmes</Link>
      </div>
    </div>
  );
}
