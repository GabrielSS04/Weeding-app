import Image from "next/image";
import Link from "next/link";
import { VenueMap } from "./_components/VenueMap";

const VENUE_NAME = "Espaço de Eventos Remonatto";
const VENUE_ADDRESS =
  "Rua Caraíbas, 500 — Bairro Santa Cruz, Cascavel - PR";
const VENUE_QUERY =
  "Espaço de Eventos Remonatto, Rua Caraíbas 500, Santa Cruz, Cascavel, PR";

const navLinks = [
  { href: "/casamento/nossa-historia", label: "Nossa História" },
  { href: "/casamento/local", label: "Cerimônia & Festa" },
  { href: "/casamento/rsvp", label: "Confirmar Presença" },
  { href: "/casamento/presentes", label: "Lista de Presentes" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <section className="w-full max-w-6xl px-5 pt-10 pb-10 sm:px-6 sm:pt-16 sm:pb-12 md:pt-24">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-accent-soft shadow-md sm:mx-auto sm:max-w-md md:max-w-none">
            <Image
              src="/noivos.png"
              alt="Foto dos noivos"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted sm:text-sm">
              Vamos nos casar
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:mt-4 sm:text-6xl md:text-7xl">
              Gabriel
              <span className="mx-2 text-accent sm:mx-3">&</span>
              Nathalia
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-serif text-lg text-muted sm:mt-6 sm:gap-4 sm:text-xl md:justify-start">
              <span>12 . 12 . 2026</span>
              <span className="h-px w-6 bg-accent sm:w-8" />
              <span>Cascavel</span>
            </div>
            <blockquote className="mt-8 max-w-md border-l-2 border-accent pl-4 font-serif text-lg italic leading-relaxed text-foreground sm:mt-10 sm:pl-5 sm:text-xl">
              &ldquo;Portanto, o que Deus uniu, ninguém separe.&rdquo;
              <footer className="mt-2 font-sans text-sm not-italic tracking-wide text-muted">
                — Marcos 10:9
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <nav className="w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-center rounded-md border border-accent/30 bg-white px-5 py-5 font-serif text-lg text-foreground transition hover:border-accent hover:bg-accent-soft/40 sm:px-6 sm:py-6 sm:text-xl"
            >
              {link.label}
              <span className="ml-2 text-accent transition group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </nav>

      <section className="w-full max-w-6xl px-5 pb-8 sm:px-6 sm:pb-12">
        <div className="mb-4 flex items-baseline justify-between sm:mb-5">
          <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
            Onde será
          </h2>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-muted">
            12 . 12 . 2026
          </span>
        </div>
        <VenueMap
          name={VENUE_NAME}
          address={VENUE_ADDRESS}
          query={VENUE_QUERY}
        />
      </section>

      <section className="w-full bg-accent-soft/40 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
          <p className="font-serif text-xl italic leading-relaxed text-foreground sm:text-2xl md:text-3xl">
            &ldquo;O amor é paciente, o amor é bondoso. Não inveja, não se vangloria,
            não se orgulha. […] O amor jamais acaba.&rdquo;
          </p>
          <p className="mt-4 font-sans text-xs uppercase tracking-[0.3em] text-muted sm:text-sm">
            1 Coríntios 13
          </p>
        </div>
      </section>

      <footer className="w-full py-6 text-center font-sans text-sm text-muted sm:py-8">
        Com gratidão a Deus • 2026
      </footer>
    </main>
  );
}
