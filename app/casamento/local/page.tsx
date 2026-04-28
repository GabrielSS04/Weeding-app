import Link from "next/link";
import { VenueMap } from "../_components/VenueMap";

const VENUE_NAME = "Espaço de Eventos Remonatto";
const VENUE_ADDRESS =
  "Rua Caraíbas, 500 — Bairro Santa Cruz, Cascavel - PR";
const VENUE_QUERY =
  "Espaço de Eventos Remonatto, Rua Caraíbas 500, Santa Cruz, Cascavel, PR";

export default function Local() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/casamento"
        className="font-sans text-sm text-muted hover:text-accent"
      >
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground sm:mt-8 sm:text-5xl">
        Cerimônia & Festa
      </h1>
      <p className="mt-3 font-serif text-base text-muted sm:mt-4 sm:text-lg">
        Toda a celebração acontecerá no mesmo local.
      </p>

      <section className="mt-8 rounded-lg border border-accent/20 bg-white p-6 sm:mt-10 sm:p-8">
        <h2 className="font-serif text-xl text-accent sm:text-2xl">
          {VENUE_NAME}
        </h2>
        <p className="mt-3 font-serif text-base text-foreground sm:text-lg">
          12 de dezembro de 2026
        </p>
        <p className="mt-1 font-sans text-sm text-muted">{VENUE_ADDRESS}</p>
      </section>

      <div className="mt-6 sm:mt-8">
        <VenueMap
          name={VENUE_NAME}
          address={VENUE_ADDRESS}
          query={VENUE_QUERY}
        />
      </div>
    </main>
  );
}
