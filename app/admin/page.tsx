import { db } from "@/lib/db";
import { addGuest, addGuestsBulk } from "./actions";
import { GuestTable } from "./_components/GuestTable";

export const dynamic = "force-dynamic";

type GuestRow = {
  id: number;
  name: string;
  confirmed_at: Date | null;
  declined_at: Date | null;
  created_at: Date;
};

export default async function Admin() {
  const { rows } = await db.query<GuestRow>(
    "SELECT id, name, confirmed_at, declined_at, created_at FROM guest_list ORDER BY name ASC"
  );

  const total = rows.length;
  const confirmados = rows.filter((r) => r.confirmed_at !== null).length;
  const naoVao = rows.filter(
    (r) => r.declined_at !== null && r.confirmed_at === null
  ).length;
  const pendentes = total - confirmados - naoVao;

  const guests = rows.map((r) => {
    const status: "confirmed" | "declined" | "pending" = r.confirmed_at
      ? "confirmed"
      : r.declined_at
      ? "declined"
      : "pending";
    const responded_at = r.confirmed_at ?? r.declined_at;
    return {
      id: r.id,
      name: r.name,
      status,
      responded_at: responded_at ? responded_at.toISOString() : null,
      created_at: r.created_at.toISOString(),
    };
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
          Lista de Convidados
        </h1>
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-muted">
          Restrito
        </span>
      </header>

      <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <p className="font-sans text-sm text-muted">Convidados</p>
          <p className="mt-1 font-serif text-3xl text-accent sm:text-4xl">
            {total}
          </p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <p className="font-sans text-sm text-muted">Confirmados</p>
          <p className="mt-1 font-serif text-3xl text-emerald-600 sm:text-4xl">
            {confirmados}
          </p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <p className="font-sans text-sm text-muted">Não vão</p>
          <p className="mt-1 font-serif text-3xl text-rose-600 sm:text-4xl">
            {naoVao}
          </p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <p className="font-sans text-sm text-muted">Pendentes</p>
          <p className="mt-1 font-serif text-3xl text-foreground sm:text-4xl">
            {pendentes}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-2">
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-accent">
            Adicionar convidado
          </h2>
          <p className="mt-1 font-sans text-sm text-muted">
            Inclua um nome de cada vez.
          </p>
          <form action={addGuest} className="mt-4 flex gap-2">
            <input
              name="name"
              type="text"
              required
              placeholder="Nome completo"
              className="flex-1 rounded-md border border-accent/30 bg-white px-3 py-2 font-sans text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 font-serif text-sm text-white transition hover:opacity-90"
            >
              Adicionar
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-accent">
            Adicionar em lote
          </h2>
          <p className="mt-1 font-sans text-sm text-muted">
            Cole vários nomes — um por linha.
          </p>
          <form action={addGuestsBulk} className="mt-4 space-y-3">
            <textarea
              name="names"
              rows={4}
              required
              placeholder={"Maria Silva\nJoão Santos\nAna Costa"}
              className="w-full rounded-md border border-accent/30 bg-white px-3 py-2 font-sans text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 font-serif text-sm text-white transition hover:opacity-90"
            >
              Adicionar todos
            </button>
          </form>
        </div>
      </section>

      <GuestTable guests={guests} />
    </main>
  );
}
