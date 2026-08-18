import Link from "next/link";
import { notFound } from "next/navigation";
import { MetadataItem } from "@/components/ui";
import { StatusBadge } from "@/components/status-badge";
import { madrassas, travels } from "@/content/data";

export const dynamicParams = false;

export function generateStaticParams() {
  const params = travels.map((travel) => ({ slug: travel.slug }));
  return params.length ? params : [{ slug: "_" }];
}

export default async function TravelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const travel = travels.find((item) => item.slug === slug);
  if (!travel) notFound();
  const linkedMadrassas = madrassas.filter((madrassa) => travel.madrassaSlugs.includes(madrassa.slug));

  return (
    <article>
      <header className="container-page py-8 md:py-12">
        <Link className="text-sm font-medium text-muted hover:text-ink" href="/voyages">← Tous les voyages</Link>
        <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-[-0.025em] text-ink md:text-6xl">{travel.title}</h1>
        <p className="page-description">{travel.practicalInfo}</p>
        <div className="mt-5"><StatusBadge status={travel.status} /></div>
      </header>
      <div className="container-page grid gap-10 pb-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="max-w-3xl">
          <section className="border-b border-line pb-9">
            <h2 className="section-title">Itineraire</h2>
            <ol className="mt-4 divide-y divide-line border-y border-line">
              {travel.itinerary.map((step, index) => <li className="grid grid-cols-[44px_1fr] py-3 text-sm text-muted" key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
            </ol>
          </section>
          <section className="border-b border-line py-9">
            <h2 className="section-title">Programme</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {travel.program.map((item) => <li className="py-3 text-sm text-muted" key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="pt-9">
            <h2 className="section-title">Madrassas visitees</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {linkedMadrassas.map((madrassa) => <Link className="relation-link" href={`/madrassas/${madrassa.slug}`} key={madrassa.slug}>{madrassa.name}</Link>)}
            </div>
          </section>
        </main>
        <aside className="h-fit border-t border-line pt-6 lg:sticky lg:top-24 lg:border-t-0 lg:pt-0">
          <dl className="grid gap-6">
            <MetadataItem label="Duree" value={travel.duration} />
            <MetadataItem label="Dates" value={travel.dates} />
            <MetadataItem label="Tarif" value={travel.price} />
          </dl>
        </aside>
      </div>
    </article>
  );
}
