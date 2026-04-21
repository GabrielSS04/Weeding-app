import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/nossa-historia", label: "Nossa História" },
  { href: "/local", label: "Cerimônia & Festa" },
  { href: "/rsvp", label: "Confirmar Presença" },
  { href: "/presentes", label: "Lista de Presentes" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <section className="w-full max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-accent-soft shadow-md">
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
            <p className="font-sans text-sm uppercase tracking-[0.3em] text-muted">
              Vamos nos casar
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-foreground sm:text-6xl md:text-7xl">
              Gabriel
              <span className="mx-3 text-accent">&</span>
              Nathalia
            </h1>
            <div className="mt-6 flex items-center gap-4 font-serif text-xl text-muted">
              <span>12 . 12 . 2026</span>
              <span className="h-px w-8 bg-accent" />
              <span>Cascavel</span>
            </div>
            <blockquote className="mt-10 max-w-md border-l-2 border-accent pl-5 font-serif text-xl italic leading-relaxed text-foreground">
              &ldquo;Portanto, o que Deus uniu, ninguém separe.&rdquo;
              <footer className="mt-2 font-sans text-sm not-italic tracking-wide text-muted">
                — Marcos 10:9
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <nav className="w-full max-w-6xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-center rounded-md border border-accent/30 bg-white px-6 py-6 font-serif text-xl text-foreground transition hover:border-accent hover:bg-accent-soft/40"
            >
              {link.label}
              <span className="ml-2 text-accent transition group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </nav>

      <section className="w-full bg-accent-soft/40 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-serif text-2xl italic leading-relaxed text-foreground sm:text-3xl">
            &ldquo;O amor é paciente, o amor é bondoso. Não inveja, não se vangloria,
            não se orgulha. […] O amor jamais acaba.&rdquo;
          </p>
          <p className="mt-4 font-sans text-sm uppercase tracking-[0.3em] text-muted">
            1 Coríntios 13
          </p>
        </div>
      </section>

      <footer className="w-full py-8 text-center font-sans text-sm text-muted">
        Com gratidão a Deus • 2026
      </footer>
    </main>
  );
}
