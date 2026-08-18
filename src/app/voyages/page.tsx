import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { travels } from "@/content/data";

export default function TravelsPage() {
  return (
    <div>
      <PageHeader
        kicker="Immersions"
        title="Voyages"
        description="Des parcours culturels documentes, a confirmer avec les lieux, contacts et autorisations avant publication."
      />
      <section className="container-page pb-12">
        <div className="max-w-5xl divide-y divide-line border-y border-line">
          {travels.map((travel) => (
            <Link className="entity-row grid gap-4 md:grid-cols-[1fr_240px]" href={`/voyages/${travel.slug}`} key={travel.slug}>
              <div>
                <StatusBadge status={travel.status} />
                <h2 className="mt-3 text-lg font-medium text-ink">{travel.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{travel.practicalInfo}</p>
              </div>
              <dl className="grid gap-3 text-sm md:text-right">
                <div><dt className="text-faint">Duree</dt><dd className="text-ink">{travel.duration}</dd></div>
                <div><dt className="text-faint">Dates</dt><dd className="text-ink">{travel.dates}</dd></div>
                <div><dt className="text-faint">Tarif</dt><dd className="text-ink">{travel.price}</dd></div>
              </dl>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
