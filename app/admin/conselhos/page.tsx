import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Advice = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: Date;
  updated_at: Date;
};

export default async function AdminConselhos() {
  const { rows } = await db.query<Advice>(
    `SELECT id, name, email, message, created_at, updated_at
     FROM advices
     ORDER BY created_at DESC`
  );

  const totalConselhos = rows.length;
  const totalPessoas = new Set(rows.map((r) => r.email)).size;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
          Conselhos para o Casal
        </h1>
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-muted">
          Restrito
        </span>
      </header>

      <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <p className="font-sans text-sm text-muted">Conselhos</p>
          <p className="mt-1 font-serif text-3xl text-accent sm:text-4xl">
            {totalConselhos}
          </p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6">
          <p className="font-sans text-sm text-muted">Pessoas</p>
          <p className="mt-1 font-serif text-3xl text-accent sm:text-4xl">
            {totalPessoas}
          </p>
        </div>
      </section>

      <section className="mt-8 space-y-4 sm:mt-10">
        {rows.length === 0 ? (
          <p className="rounded-lg border border-accent/20 bg-white px-4 py-8 text-center font-sans text-sm text-muted">
            Nenhum conselho ainda.
          </p>
        ) : (
          rows.map((a) => {
            const edited =
              new Date(a.updated_at).getTime() -
                new Date(a.created_at).getTime() >
              1000;
            return (
              <article
                key={a.id}
                className="rounded-lg border border-accent/20 bg-white p-5 sm:p-6"
              >
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-serif text-lg text-foreground">
                      {a.name}
                    </p>
                    <a
                      href={`mailto:${a.email}`}
                      className="font-sans text-xs text-muted hover:text-accent"
                    >
                      {a.email}
                    </a>
                  </div>
                  <p className="font-sans text-xs text-muted">
                    {new Date(a.created_at).toLocaleString("pt-BR")}
                    {edited && " • editado"}
                  </p>
                </header>
                <p className="mt-3 whitespace-pre-wrap font-serif text-base text-foreground sm:text-lg">
                  {a.message}
                </p>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
