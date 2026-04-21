import Link from "next/link";

export default function Local() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-8 font-serif text-5xl text-foreground">Cerimônia & Festa</h1>

      <section className="mt-10 rounded-lg border border-accent/20 bg-white p-8">
        <h2 className="font-serif text-2xl text-accent">Cerimônia</h2>
        <p className="mt-3 font-serif text-lg text-foreground">
          Igreja exemplo • 12 de dezembro de 2026 • 16h
        </p>
        <p className="mt-1 font-sans text-sm text-muted">
          Rua das Flores, 123 — São Paulo, SP
        </p>
      </section>

      <section className="mt-6 rounded-lg border border-accent/20 bg-white p-8">
        <h2 className="font-serif text-2xl text-accent">Recepção</h2>
        <p className="mt-3 font-serif text-lg text-foreground">
          Espaço exemplo • a partir das 19h
        </p>
        <p className="mt-1 font-sans text-sm text-muted">
          Avenida Principal, 456 — São Paulo, SP
        </p>
      </section>
    </main>
  );
}
