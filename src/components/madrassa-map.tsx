"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import { MapPin, School, X } from "lucide-react";
import type { VerificationStatus } from "@/content/data";

export type MadrassaMapItem = {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
  specialties?: string[];
  status?: VerificationStatus;
  description?: string;
  image?: string;
};

type MadrassaMapProps = {
  madrassas: MadrassaMapItem[];
  className?: string;
};

const statusStyles: Record<VerificationStatus, string> = {
  sourced: "border-emerald-200 text-emerald-700",
  to_verify: "border-amber-200 text-amber-700",
  example: "border-neutral-200 text-neutral-700"
};

const statusLabels: Record<VerificationStatus, string> = {
  sourced: "Source verifiee",
  to_verify: "A confirmer",
  example: "Exemple a remplacer"
};

const lightMapStyle: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: ["https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO"
    }
  },
  layers: [
    {
      id: "carto-light",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

export function MadrassaMap({ madrassas, className = "" }: MadrassaMapProps) {
  const [selected, setSelected] = useState<MadrassaMapItem | null>(null);
  const [loaded, setLoaded] = useState(false);

  const validMapPoints = useMemo(
    () => madrassas.filter((school) => Number.isFinite(school.latitude) && Number.isFinite(school.longitude)),
    [madrassas]
  );

  const center = useMemo(() => {
    if (!validMapPoints.length) {
      return { latitude: 29.7, longitude: -9.7 };
    }

    return {
      latitude: validMapPoints.reduce((sum, school) => sum + school.latitude, 0) / validMapPoints.length,
      longitude: validMapPoints.reduce((sum, school) => sum + school.longitude, 0) / validMapPoints.length
    };
  }, [validMapPoints]);

  return (
    <div className={`relative w-full overflow-hidden rounded-[18px] border border-line bg-[#eef0ee] ${className}`}>
      <Map
        initialViewState={{
          longitude: center.longitude,
          latitude: center.latitude,
          zoom: 7.75
        }}
        mapStyle={lightMapStyle}
        onLoad={(event) => {
          event.target.resize();
          if (validMapPoints.length > 1) {
            const longitudes = validMapPoints.map((school) => school.longitude);
            const latitudes = validMapPoints.map((school) => school.latitude);

            event.target.fitBounds(
              [
                [Math.min(...longitudes), Math.min(...latitudes)],
                [Math.max(...longitudes), Math.max(...latitudes)]
              ],
              { duration: 0, maxZoom: 9, padding: { bottom: 72, left: 72, right: 72, top: 72 } }
            );
          }
          setLoaded(true);
        }}
        style={{ width: "100%", height: "100%", minHeight: 520 }}
        attributionControl={{ compact: true }}
        cooperativeGestures={false}
      >
        <NavigationControl position="top-right" />

        {validMapPoints.map((madrassa) => {
          const colorClass = madrassa.status ? statusStyles[madrassa.status] : "border-neutral-200 text-neutral-700";

          return (
            <Marker key={madrassa.id} longitude={madrassa.longitude} latitude={madrassa.latitude} anchor="bottom">
              <button
                aria-label={`Voir ${madrassa.name}`}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-[0_2px_10px_rgba(0,0,0,0.16)] transition duration-150 hover:scale-110 hover:shadow-[0_4px_14px_rgba(0,0,0,0.22)] focus:outline-none focus:ring-4 focus:ring-brand/20 ${colorClass}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(madrassa);
                }}
                type="button"
              >
                <School size={18} strokeWidth={2} />
                <span className="absolute -bottom-[5px] h-3 w-3 rotate-45 border-b border-r border-neutral-200 bg-white" />
              </button>
            </Marker>
          );
        })}

        {selected ? (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            anchor="bottom"
            offset={52}
            closeButton={false}
            closeOnClick={false}
            maxWidth="320px"
            className="madrassa-popup"
          >
            <div className="relative min-w-[250px]">
              <button
                aria-label="Fermer"
                className="absolute right-0 top-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200"
                onClick={() => setSelected(null)}
                type="button"
              >
                <X size={15} />
              </button>

              {selected.image ? (
                <Image
                  alt={selected.name}
                  className="mb-3 h-32 w-full rounded-[14px] object-cover"
                  height={128}
                  src={selected.image}
                  unoptimized
                  width={288}
                />
              ) : null}

              <div className="pr-8">
                {selected.nameAr ? (
                  <div className="mb-1 text-right text-[15px] font-semibold leading-6 text-neutral-900" dir="rtl" lang="ar">
                    {selected.nameAr}
                  </div>
                ) : null}

                <h3 className="text-[15px] font-semibold leading-tight text-neutral-950">{selected.name}</h3>

                {selected.city || selected.province ? (
                  <div className="mt-2 flex items-start gap-1.5 text-[13px] text-neutral-500">
                    <MapPin className="mt-[1px] shrink-0" size={14} />
                    <span>{[selected.city, selected.province].filter(Boolean).join(" · ")}</span>
                  </div>
                ) : null}

                {selected.description ? <p className="mt-3 line-clamp-3 text-[13px] leading-5 text-neutral-600">{selected.description}</p> : null}

                {selected.specialties?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selected.specialties.slice(0, 4).map((specialty) => (
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-600" key={specialty}>
                        {specialty}
                      </span>
                    ))}
                  </div>
                ) : null}

                {selected.status ? (
                  <div className="mt-3">
                    <MapStatusBadge status={selected.status} />
                  </div>
                ) : null}

                <Link className="mt-4 flex w-full items-center justify-center rounded-[12px] bg-neutral-950 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-neutral-800" href={`/madrassas/${selected.slug}`}>
                  Voir la madrassa
                </Link>
              </div>
            </div>
          </Popup>
        ) : null}
      </Map>

      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-[12px] border border-white/60 bg-white/90 px-3 py-2 text-sm font-medium text-neutral-900 shadow-sm backdrop-blur-md">
        {madrassas.length} madrassas
      </div>

      {!loaded ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#eef0ee] text-sm text-muted">
          Chargement de la carte...
        </div>
      ) : null}
    </div>
  );
}

function MapStatusBadge({ status }: { status: VerificationStatus }) {
  const styles: Record<VerificationStatus, string> = {
    sourced: "border-emerald-100 bg-emerald-50 text-emerald-700",
    to_verify: "border-amber-100 bg-amber-50 text-amber-700",
    example: "border-neutral-200 bg-neutral-100 text-neutral-600"
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${styles[status]}`}>{statusLabels[status]}</span>;
}
