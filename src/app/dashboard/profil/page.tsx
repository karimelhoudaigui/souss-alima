import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/connexion");
  return (
    <div className="panel mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-cedar">Profil</h1>
      <p className="mt-3">{session.user.name}</p>
      <p className="text-sm text-stone-600">{session.user.email}</p>
      <p className="mt-4 text-sm text-stone-600">Pour toute suppression de compte, contactez l'administration via la page Contact.</p>
    </div>
  );
}
