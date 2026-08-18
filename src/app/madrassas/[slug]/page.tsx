import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { MetadataItem } from "@/components/ui";
import { getAllMadrassas, getAllScholars } from "@/content/store";

export const dynamicParams = false;

export async function generateStaticParams() {
  const madrassas = await getAllMadrassas();
  return madrassas.map((madrassa) => ({ slug: madrassa.slug }));
}

export default async function MadrassaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const madrassas = await getAllMadrassas();
  const madrassa = madrassas.find((item) => item.slug === slug);
  if (!madrassa) notFound();
  const scholars = await getAllScholars();
  const linkedScholars = scholars.filter((scholar) => madrassa.scholars.includes(scholar.slug));
  const sources = madrassa.sources?.length ? madrassa.sources : [];

  return (
    <article>
      <header className="container-page py-8 md:py-12">
        <Link className="text-sm font-medium text-muted hover:text-ink" href="/madrassas">← Toutes les madrassas</Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="arabic-title" dir="rtl" lang="ar">{madrassa.nameAr}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.025em] text-ink md:text-6xl">{madrassa.name}</h1>
            <p className="mt-4 text-base text-muted">{madrassa.commune} · Province de {madrassa.province}</p>
            <div className="mt-5">
              <StatusBadge status={madrassa.status} />
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-5 border-t border-line pt-5 lg:border-t-0 lg:pt-0">
            <MetadataItem label="Localisation" value={`${madrassa.village}, ${madrassa.commune}`} />
            <MetadataItem label="Statut" value={madrassa.currentStatus} />
            <MetadataItem label="Contact" value={madrassa.contact} />
            <MetadataItem label="Coordonnees" value={`${madrassa.lat}, ${madrassa.lng}`} />
          </dl>
        </div>
      </header>

      <div className="container-page">
        {madrassa.image ? (
          <figure className="overflow-hidden rounded-[18px] border border-line bg-subtle">
            <Image alt="" className="h-[280px] w-full object-cover md:h-[420px]" height={840} priority sizes="(max-width: 768px) 100vw, 1200px" src={madrassa.image} unoptimized width={2400} />
            {madrassa.imageCredit ? <figcaption className="border-t border-line px-4 py-3 text-xs text-muted">{madrassa.imageCredit}</figcaption> : null}
          </figure>
        ) : (
          <div className="h-[280px] rounded-[18px] border border-line bg-subtle md:h-[420px]">
            <div className="flex h-full items-center justify-center text-sm text-muted">Image a renseigner lorsqu'une source fiable est disponible</div>
          </div>
        )}
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <main className="max-w-3xl">
          <section className="border-b border-line pb-9">
            <h2 className="section-title">Presentation</h2>
            <p className="body-copy mt-4">{madrassa.history}</p>
          </section>

          <section className="border-b border-line py-9">
            <h2 className="section-title">Enseignement</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {madrassa.specialties.map((specialty) => (
                <span className="filter-chip" key={specialty}>{specialty}</span>
              ))}
            </div>
          </section>

          <section className="border-b border-line py-9">
            <h2 className="section-title">Personnes liees</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {linkedScholars.length ? linkedScholars.map((scholar) => (
                <Link className="relation-link" href={`/savants/${scholar.slug}`} key={scholar.slug}>{scholar.nameFr}</Link>
              )) : <p className="body-copy">A renseigner apres verification.</p>}
            </div>
          </section>

          <section className="pt-9">
            <h2 className="section-title">Sources</h2>
            <div className="mt-5 divide-y divide-line border-y border-line">
              {sources.length ? sources.map((source, index) => (
                <div className="grid gap-3 py-4 md:grid-cols-[44px_1fr]" key={source}>
                  <span className="text-sm text-faint">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-6 text-muted">{source}</p>
                </div>
              )) : (
                <div className="grid gap-3 py-4 md:grid-cols-[44px_1fr]">
                  <span className="text-sm text-faint">01</span>
                  <div>
                    <p className="text-sm font-medium text-ink">Source non renseignee</p>
                    <p className="mt-1 text-sm leading-6 text-muted">Cette fiche doit etre completee avec des references avant validation editoriale.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="h-fit border-t border-line pt-6 lg:sticky lg:top-24 lg:border-t-0 lg:pt-0">
          <dl className="grid gap-6">
            <MetadataItem label="Province" value={madrassa.province} />
            <MetadataItem label="Commune" value={madrassa.commune} />
            <MetadataItem label="Village" value={madrassa.village} />
            <MetadataItem label="Verification" value={<StatusBadge status={madrassa.status} />} />
          </dl>
        </aside>
      </div>
    </article>
  );
}
