import { EnrollmentStatusForm } from "@/components/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({ include: { user: true, program: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-cedar">Inscriptions</h1>
      {enrollments.map((item) => (
        <div key={item.id} className="panel flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{item.user.name}</p>
            <p className="text-sm text-stone-600">{item.program.title} - {item.status}</p>
          </div>
          <EnrollmentStatusForm id={item.id} status={item.status} />
        </div>
      ))}
    </div>
  );
}
