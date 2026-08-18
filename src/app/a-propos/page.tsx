import Link from "next/link";
import { PageHeader } from "@/components/ui";

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        kicker="A propos"
        title="Documenter le Souss savant avec precision"
        description="Souss Alima rassemble progressivement des informations sur les madaris, les savants, les articles editoriaux et les sources qui permettent de les verifier."
        narrow
      />
      <article className="container-text pb-14">
        <div className="space-y-9 border-t border-line pt-8">
          <section>
            <h2 className="section-title">Pourquoi cette plateforme existe</h2>
            <p className="body-copy mt-4">
              Le patrimoine scientifique du Souss est dense, relie a des lieux, des personnes, des textes et des transmissions. L'objectif est de rendre ces relations consultables sans perdre la rigueur necessaire au sujet.
            </p>
          </section>
          <section>
            <h2 className="section-title">Ce qui est documente</h2>
            <p className="body-copy mt-4">
              La plateforme organise les fiches de madrassas, savants, articles, voyages, glossaire et ressources. Les donnees du prototype restent marquees comme exemples tant qu'elles ne sont pas sourcees.
            </p>
          </section>
          <section>
            <h2 className="section-title">Methode</h2>
            <p className="body-copy mt-4">
              Toute information sensible doit pouvoir etre rattachee a une source. Les absences sont preferees aux inventions : aucune date, filiation, oeuvre ou photographie n'est ajoutee pour combler un vide.
            </p>
          </section>
          <Link className="button-secondary" href="/contribuer">Proposer une source</Link>
        </div>
      </article>
    </div>
  );
}
