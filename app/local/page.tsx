import Link from "next/link";

export default function Local() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground sm:mt-8 sm:text-5xl">
        Cerimônia & Festa
      </h1>

      <section className="mt-8 rounded-lg border border-accent/20 bg-white p-6 sm:mt-10 sm:p-8">
        <h2 className="font-serif text-xl text-accent sm:text-2xl">Cerimônia</h2>
        <p className="mt-3 font-serif text-base text-foreground sm:text-lg">
          Igreja exemplo • 12 de dezembro de 2026 • 16h
        </p>
        <p className="mt-1 font-sans text-sm text-muted">
          Rua das Flores, 123 — São Paulo, SP
        </p>
      </section>

      <section className="mt-5 rounded-lg border border-accent/20 bg-white p-6 sm:mt-6 sm:p-8">
        <h2 className="font-serif text-xl text-accent sm:text-2xl">Recepção</h2>
        <p className="mt-3 font-serif text-base text-foreground sm:text-lg">
          Espaço exemplo • a partir das 19h
        </p>
        <p className="mt-1 font-sans text-sm text-muted">
          Avenida Principal, 456 — São Paulo, SP
        </p>
      </section>
    </main>
  );
}
