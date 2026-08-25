"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import { MapPin, School, X } from "lucide-react";
import type { VerificationStatus } from "@/content/data";
import { publicAsset } from "@/lib/assets";

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
  sourced: "border-brand text-brand",
  to_verify: "border-brand-line text-muted",
  example: "border-line text-muted"
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
  const [supportsWebGl, setSupportsWebGl] = useState<boolean | null>(null);

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

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    setSupportsWebGl(Boolean(context));
  }, []);

  if (supportsWebGl === null) {
    return (
      <div className={`flex items-center justify-center overflow-hidden border border-line bg-subtle text-sm text-muted ${className}`}>
        Verification de la carte...
      </div>
    );
  }

  if (supportsWebGl === false) {
    return (
      <div className={`min-w-0 overflow-hidden border border-line bg-surface ${className}`}>
        <div className="border-b border-line p-4">
          <p className="metadata-label">Carte indisponible</p>
          <p className="mt-2 break-words text-sm leading-6 text-muted">
            Le navigateur ne fournit pas WebGL pour afficher la carte interactive. Les notices restent accessibles par l'index.
          </p>
        </div>
        <div className="divide-y divide-line">
          {madrassas.slice(0, 6).map((madrassa) => (
            <Link className="grid min-w-0 gap-1 p-4 transition hover:bg-subtle/55" href={`/madrassas/${madrassa.slug}`} key={madrassa.slug}>
              {madrassa.nameAr ? <span className="break-words text-right text-lg text-ink" dir="rtl" lang="ar">{madrassa.nameAr}</span> : null}
              <span className="break-words text-sm font-medium text-ink">{madrassa.name}</span>
              <span className="ui-sans break-words text-xs text-muted">{[madrassa.city, madrassa.province].filter(Boolean).join(" · ")}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden border border-line bg-subtle ${className}`}>
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
        style={{ width: "100%", height: "100%" }}
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
                className={`group relative flex h-7 w-7 items-center justify-center rounded-full border bg-surface shadow-[0_1px_6px_rgba(0,0,0,0.14)] transition duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand/20 ${colorClass}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(madrassa);
                }}
                type="button"
              >
                <School size={14} strokeWidth={2} />
                <span className="absolute -bottom-[3px] h-2 w-2 rotate-45 border-b border-r border-line bg-surface" />
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
            maxWidth="250px"
            className="madrassa-popup"
          >
            <div className="relative min-w-[208px] max-w-[226px]">
              <button
                aria-label="Fermer"
                className="absolute right-0 top-0 z-20 flex h-6 w-6 items-center justify-center border border-line bg-surface text-muted transition hover:bg-subtle"
                onClick={() => setSelected(null)}
                type="button"
              >
                <X size={13} />
              </button>

              {selected.image ? (
                <Image
                  alt={selected.name}
                  className="mb-2.5 h-20 w-full object-cover"
                  height={80}
                  src={publicAsset(selected.image) ?? ""}
                  unoptimized
                  width={226}
                />
              ) : null}

              <div className="pr-7">
                {selected.nameAr ? (
                  <div className="mb-1 text-right text-[14px] font-medium leading-5 text-ink" dir="rtl" lang="ar">
                    {selected.nameAr}
                  </div>
                ) : null}

                <h3 className="text-[14px] font-medium leading-tight text-ink">{selected.name}</h3>

                {selected.city || selected.province ? (
                  <div className="ui-sans mt-1.5 flex items-start gap-1.5 text-[12px] text-muted">
                    <MapPin className="mt-[1px] shrink-0" size={13} />
                    <span>{[selected.city, selected.province].filter(Boolean).join(" · ")}</span>
                  </div>
                ) : null}

                {selected.specialties?.length ? (
                  <div className="ui-sans mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[10.5px] text-faint">
                    {selected.specialties.slice(0, 3).map((specialty) => (
                      <span key={specialty}>{specialty}</span>
                    ))}
                  </div>
                ) : null}

                {selected.status ? (
                  <div className="mt-2.5">
                    <MapStatusBadge status={selected.status} />
                  </div>
                ) : null}

                <Link className="ui-sans mt-3 flex min-h-8 w-full items-center justify-center bg-brand px-3 py-1.5 text-xs font-medium text-white transition duration-150 hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/25 focus:ring-offset-2" href={`/madrassas/${selected.slug}`}>
                  Voir la notice
                </Link>
              </div>
            </div>
          </Popup>
        ) : null}
      </Map>

      <div className="ui-sans pointer-events-none absolute left-4 top-4 z-10 border border-line bg-surface px-3 py-2 text-sm font-medium text-ink shadow-sm">
        {madrassas.length} madrassas
      </div>

      {!loaded ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-subtle text-sm text-muted">
          Chargement de la carte...
        </div>
      ) : null}
    </div>
  );
}

function MapStatusBadge({ status }: { status: VerificationStatus }) {
  const styles: Record<VerificationStatus, string> = {
    sourced: "border-brand-line text-brand",
    to_verify: "border-brand-line text-muted",
    example: "border-line text-muted"
  };

  return <span className={`ui-sans inline-flex border-b text-[11px] font-medium ${styles[status]}`}>{statusLabels[status]}</span>;
}
