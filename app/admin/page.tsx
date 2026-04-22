import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Rsvp = {
  id: number;
  name: string;
  email: string;
  guests: number;
  message: string | null;
  created_at: Date;
};

export default async function Admin() {
  const { rows } = await db.query<Rsvp>(
    "SELECT id, name, email, guests, message, created_at FROM rsvps ORDER BY created_at DESC"
  );

  const totalConfirmados = rows.length;
  const totalPessoas = rows.reduce((sum, r) => sum + 1 + r.guests, 0);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
          Painel Administrativo
        </h1>
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-muted">
          Restrito
        </span>
      </header>

      <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <p className="font-sans text-sm text-muted">Confirmações</p>
          <p className="mt-1 font-serif text-3xl text-accent sm:text-4xl">{totalConfirmados}</p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <p className="font-sans text-sm text-muted">Total de pessoas</p>
          <p className="mt-1 font-serif text-3xl text-accent sm:text-4xl">{totalPessoas}</p>
        </div>
      </section>

      <section className="mt-8 overflow-x-auto rounded-lg border border-accent/20 bg-white sm:mt-10">
        <table className="w-full min-w-[640px] text-left font-sans text-sm">
          <thead className="bg-accent-soft/40 text-muted">
            <tr>
              <th className="px-4 py-3">Quando</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Acompanhantes</th>
              <th className="px-4 py-3">Mensagem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/10">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Nenhuma confirmação ainda.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-muted">
                  {new Date(r.created_at).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-foreground">{r.name}</td>
                <td className="px-4 py-3 text-muted">{r.email}</td>
                <td className="px-4 py-3 text-foreground">{r.guests}</td>
                <td className="px-4 py-3 text-muted">{r.message ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
