import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-cedar">Utilisateurs</h1>
      <div className="grid gap-3">
        {users.map((user) => (
          <div className="panel" key={user.id}>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-stone-600">{user.email} - {user.role} - {user.isActive ? "actif" : "désactivé"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
