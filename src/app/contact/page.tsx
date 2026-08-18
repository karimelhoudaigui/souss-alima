import { PageHeader } from "@/components/ui";

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        kicker="Contact"
        title="Ecrire a Souss Alima"
        description="Pour une source, une visite, un partenariat de recherche ou une correction editoriale."
        narrow
      />
      <section className="container-text pb-14">
        <form className="grid gap-5 border-t border-line pt-6">
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
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="subject">Sujet</label>
            <input className="input mt-2" id="subject" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink" htmlFor="message">Message</label>
            <textarea className="input mt-2 min-h-36" id="message" />
          </div>
          <button className="button-primary w-fit" type="button">Envoyer</button>
        </form>
      </section>
    </div>
  );
}
