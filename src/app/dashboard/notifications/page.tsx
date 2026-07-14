import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/connexion");
  const notifications = await prisma.notification.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-cedar">Notifications</h1>
      {notifications.map((item) => (
        <div key={item.id} className="panel">
          <p className="text-sm text-stone-500">{item.type}</p>
          <p>{item.message}</p>
        </div>
      ))}
    </div>
  );
}
