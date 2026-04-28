"use client";

import { useState } from "react";

type Props = {
  name: string;
  address: string;
  query: string;
};

function isMobileDevice(): boolean {
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile/i.test(ua)) {
    return true;
  }
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(pointer: coarse)").matches;
  }
  return false;
}

export function VenueMap({ name, address, query }: Props) {
  const [chooserOpen, setChooserOpen] = useState(false);

  const encoded = encodeURIComponent(query);
  const embedUrl = `https://maps.google.com/maps?q=${encoded}&output=embed&z=16`;
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  const appleUrl = `https://maps.apple.com/?q=${encoded}`;
  const wazeUrl = `https://waze.com/ul?q=${encoded}&navigate=yes`;

  const handleOpen = () => {
    if (isMobileDevice()) {
      setChooserOpen(true);
    } else {
      window.open(googleUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-accent/20 bg-white shadow-sm">
        <div className="relative aspect-[16/10] w-full bg-accent-soft/40">
          <iframe
            src={embedUrl}
            title={`Mapa — ${name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div>
            <p className="font-serif text-lg text-foreground sm:text-xl">
              {name}
            </p>
            <p className="font-sans text-sm text-muted">{address}</p>
          </div>
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-md bg-accent px-4 py-2 font-serif text-sm text-white transition hover:opacity-90"
          >
            Como chegar →
          </button>
        </div>
      </div>

      {chooserOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Escolha o app de mapas"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setChooserOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg"
          >
            <p className="font-serif text-lg text-foreground">
              Abrir local em qual app?
            </p>
            <p className="mt-1 font-sans text-sm text-muted">{name}</p>
            <div className="mt-4 grid gap-2">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-accent/30 px-4 py-3 text-center font-serif text-base text-foreground transition hover:bg-accent-soft/40"
              >
                Google Maps
              </a>
              <a
                href={appleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-accent/30 px-4 py-3 text-center font-serif text-base text-foreground transition hover:bg-accent-soft/40"
              >
                Apple Maps
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-accent/30 px-4 py-3 text-center font-serif text-base text-foreground transition hover:bg-accent-soft/40"
              >
                Waze
              </a>
            </div>
            <button
              type="button"
              onClick={() => setChooserOpen(false)}
              className="mt-3 w-full rounded-md px-4 py-2 font-sans text-sm text-muted transition hover:text-accent"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
