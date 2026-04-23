import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/charraia/nossa-historia", label: "Nossa História" },
  { href: "/charraia/presentes", label: "Lista de Presentes" },
];

export default function Charraia() {
  return (
    <main data-theme="junino" className="flex flex-1 flex-col items-center bg-background">
      <div className="bandeirinhas w-full" aria-hidden />

      <section className="w-full max-w-6xl px-5 pt-10 pb-10 sm:px-6 sm:pt-16 sm:pb-12 md:pt-20">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-accent-soft shadow-md sm:mx-auto sm:max-w-md md:max-w-none">
            <Image
              src="/noivos-charraia.png"
              alt="Foto dos noivos na temática junina"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted sm:text-sm">
              Chá de Panelas + Arraiá
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-tight text-foreground sm:mt-4 sm:text-7xl md:text-8xl">
              Charraia
            </h1>
            <p className="mt-2 font-serif text-xl italic text-accent sm:text-2xl">
              Gabriel & Nathalia
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 font-serif text-lg text-muted sm:mt-6 sm:gap-4 sm:text-xl md:justify-start">
              <span>18 . 07 . 2026</span>
              <span className="h-px w-6 bg-accent sm:w-8" />
              <span>Cascavel</span>
            </div>
            <p className="mt-6 max-w-md font-serif text-base leading-relaxed text-foreground sm:mt-8 sm:text-lg">
              Fogueira, quadrilha, comidinhas típicas e, claro, presentes pra
              começar a montar nossa Casinha. Venha celebrar com a gente &mdash;
              de xadrez, chapéu de palha e muita alegria.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-accent-soft/60 py-10 sm:py-12">
        <div className="mx-auto grid max-w-3xl gap-5 px-5 sm:grid-cols-2 sm:gap-6 sm:px-6">
          <div className="rounded-lg border border-accent/30 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-lg text-accent sm:text-xl">Quando</h2>
            <p className="mt-2 font-serif text-base text-foreground sm:text-lg">
              Sábado, 18 de julho de 2026
            </p>
            <p className="mt-1 font-sans text-sm text-muted">
              A partir das 18h
            </p>
          </div>
          <div className="rounded-lg border border-accent/30 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-lg text-accent sm:text-xl">Onde</h2>
            <p className="mt-2 font-serif text-base text-foreground sm:text-lg">
              Centro Comunitário do Bairro Sol Nascente
            </p>
            <p className="mt-1 font-sans text-sm text-muted">
              Cascavel — PR
            </p>
          </div>
        </div>
      </section>

      <nav className="w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-center rounded-md border border-accent/40 bg-white px-5 py-5 font-serif text-lg text-foreground transition hover:border-accent hover:bg-accent-soft/40 sm:px-6 sm:py-6 sm:text-xl"
            >
              {link.label}
              <span className="ml-2 text-accent transition group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </nav>

      <footer className="w-full py-6 text-center font-sans text-sm text-muted sm:py-8">
        Arraiá dos noivos • Cai, cai balão &bull; 2026
      </footer>

      <div className="bandeirinhas w-full rotate-180" aria-hidden />
    </main>
  );
}
