import { RegisterForm } from "@/components/forms";
import { prisma } from "@/lib/prisma";

export default async function RegisterPage() {
  const programs = await prisma.program.findMany({ where: { isPublished: true }, orderBy: { title: "asc" } });
  return (
    <div className="space-y-5">
      <h1 className="text-center text-3xl font-bold text-cedar">Demande d'inscription</h1>
      <RegisterForm programs={programs} />
    </div>
  );
}
