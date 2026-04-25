import Link from "next/link";
import { db } from "@/lib/db";
import { getGuest } from "@/lib/session";
import { GuestBadge } from "@/app/_components/GuestBadge";
import { createAdvice, deleteAdvice, updateAdvice } from "./actions";

export const dynamic = "force-dynamic";

type Advice = {
  id: number;
  message: string;
  created_at: Date;
  updated_at: Date;
};

export default async function ConselhosCharraia({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editId = edit ? Number(edit) : null;

  const guest = await getGuest();

  const mine: Advice[] = guest
    ? (
        await db.query<Advice>(
          `SELECT id, message, created_at, updated_at
           FROM advices
           WHERE email = $1
           ORDER BY created_at DESC`,
          [guest.email]
        )
      ).rows
    : [];

  const editing = editId ? mine.find((a) => a.id === editId) ?? null : null;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3 sm:mt-8">
        <h1 className="font-serif text-4xl text-foreground sm:text-5xl">
          Conselhos para o Casal
        </h1>
        <GuestBadge next="/charraia/conselhos" />
      </div>

      <p className="mt-3 max-w-2xl font-serif text-base text-muted sm:mt-4 sm:text-lg">
        Deixe uma dica, conselho ou mensagem carinhosa para o futuro do
        Gabriel e da Nathalia. Você pode editar ou apagar depois &mdash; e só
        o casal lê as mensagens.
      </p>

      {!guest ? (
        <div className="mt-8 rounded-lg border border-accent/30 bg-accent-soft/40 p-6 text-center">
          <p className="font-serif text-lg text-foreground">
            Para deixar um conselho, se identifique primeiro.
          </p>
          <Link
            href={`/identificar?next=${encodeURIComponent("/charraia/conselhos")}`}
            className="mt-4 inline-block rounded-md bg-accent px-5 py-2 font-serif text-base text-white transition hover:opacity-90"
          >
            Identificar-se
          </Link>
        </div>
      ) : editing ? (
        <section className="mt-8 rounded-lg border border-accent/30 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl text-accent sm:text-2xl">
            Editar conselho
          </h2>
          <form action={updateAdvice} className="mt-4 space-y-4">
            <input type="hidden" name="id" value={editing.id} />
            <textarea
              name="message"
              required
              maxLength={2000}
              rows={5}
              defaultValue={editing.message}
              className="w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-md bg-accent px-5 py-2 font-serif text-base text-white transition hover:opacity-90"
              >
                Salvar
              </button>
              <Link
                href="/charraia/conselhos"
                className="rounded-md border border-accent/30 px-5 py-2 font-serif text-base text-muted transition hover:bg-accent-soft/40"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </section>
      ) : (
        <section className="mt-8 rounded-lg border border-accent/30 bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl text-accent sm:text-2xl">
            Deixe seu conselho
          </h2>
          <form action={createAdvice} className="mt-4 space-y-4">
            <textarea
              name="message"
              required
              maxLength={2000}
              rows={5}
              placeholder="Ex.: conversem sempre, mesmo sobre o que parece pequeno…"
              className="w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-5 py-2 font-serif text-base text-white transition hover:opacity-90"
            >
              Enviar conselho
            </button>
          </form>
        </section>
      )}

      {guest && mine.length > 0 && (
        <section className="mt-10 sm:mt-12">
          <h2 className="font-serif text-xl text-foreground sm:text-2xl">
            Seus conselhos
          </h2>
          <ul className="mt-4 space-y-4">
            {mine.map((a) => {
              const edited =
                new Date(a.updated_at).getTime() -
                  new Date(a.created_at).getTime() >
                1000;
              return (
                <li
                  key={a.id}
                  className="rounded-lg border border-accent/20 bg-white p-4 sm:p-5"
                >
                  <p className="whitespace-pre-wrap font-serif text-base text-foreground sm:text-lg">
                    {a.message}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-sans text-xs text-muted">
                      {new Date(a.created_at).toLocaleDateString("pt-BR")}
                      {edited && " • editado"}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/charraia/conselhos?edit=${a.id}`}
                        className="rounded-md border border-accent/30 px-3 py-1 font-sans text-xs text-foreground transition hover:bg-accent-soft/40"
                      >
                        Editar
                      </Link>
                      <form action={deleteAdvice}>
                        <input type="hidden" name="id" value={a.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-red-300 px-3 py-1 font-sans text-xs text-red-700 transition hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
