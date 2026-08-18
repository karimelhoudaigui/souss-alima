import { PageHeader } from "@/components/ui";

export default function ContributePage() {
  return (
    <div>
      <PageHeader
        kicker="Contribution"
        title="Contribuer avec une source"
        description="Vous connaissez une madrassa, disposez d'une reference ou constatez une erreur : envoyez une contribution courte et verifiable."
        narrow
      />
      <section className="container-text pb-14">
        <form className="grid gap-5 border-t border-line pt-6">
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="type">Type de contribution</label>
            <select className="input mt-2" id="type" defaultValue="">
              <option value="">Selectionner</option>
              <option>Savant</option>
              <option>Madrassa</option>
              <option>Article</option>
              <option>Source bibliographique</option>
              <option>Correction</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="entity">Entite concernee</label>
            <input className="input mt-2" id="entity" placeholder="Nom de la fiche ou du lieu" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="message">Message</label>
            <textarea className="input mt-2 min-h-32" id="message" placeholder="Information proposee, correction, contexte" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="source">Source URL ou reference</label>
            <input className="input mt-2" id="source" placeholder="Lien, ouvrage, article, archive" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="name">Nom</label>
              <input className="input mt-2" id="name" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="email">Email</label>
              <input className="input mt-2" id="email" type="email" />
            </div>
          </div>
          <button className="button-primary w-fit" type="button">Soumettre</button>
        </form>
      </section>
    </div>
  );
}
