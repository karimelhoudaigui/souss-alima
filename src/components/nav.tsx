import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Nav() {
  const session = await getServerSession(authOptions);
  return (
    <header className="border-b border-stone-200 bg-linen/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-bold text-cedar">Institut Souss Alima</Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-stone-700">
          <Link href="/programmes">Programmes</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/contact">Contact</Link>
          {session ? (
            <>
              <Link href={session.user.role === "STUDENT" ? "/dashboard" : "/admin"} className="btn-secondary py-1.5">
                Espace
              </Link>
              <Link href="/api/auth/signout" className="text-stone-500">Sortir</Link>
            </>
          ) : (
            <Link href="/connexion" className="btn-secondary py-1.5">Connexion</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
