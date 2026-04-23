import Link from "next/link";
import { db } from "@/lib/db";
import { getGuest } from "@/lib/session";
import { selectGift, signOut, unselectGift } from "./actions";

export const dynamic = "force-dynamic";

type Gift = {
  id: number;
  url: string;
  price: string | null;
  title: string | null;
  image: string | null;
  quantity: number;
  selected_count: number;
  mine: boolean;
};

export default async function PresentesCharraia() {
  const guest = await getGuest();
  const email = guest?.email ?? "";

  const { rows } = await db.query<Gift>(
    `SELECT g.id, g.url, g.price, g.title, g.image, g.quantity,
       (SELECT COUNT(*)::int FROM gift_selections s WHERE s.gift_id = g.id) AS selected_count,
       EXISTS (SELECT 1 FROM gift_selections s WHERE s.gift_id = g.id AND s.email = $1) AS mine
     FROM gifts g
     ORDER BY g.created_at DESC`,
    [email]
  );

  const products = rows.map((g) => ({
    id: g.id,
    url: g.url,
    price: g.price,
    quantity: g.quantity,
    selectedCount: g.selected_count,
    mine: g.mine,
    title: g.title ?? g.url,
    image: g.image,
    site: new URL(g.url).hostname.replace(/^www\./, ""),
  }));

  const mine = products.filter((p) => p.mine);
  const available = products.filter((p) => !p.mine);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3 sm:mt-8">
        <h1 className="font-serif text-4xl text-foreground sm:text-5xl">
          Lista de Presentes
        </h1>
        {guest ? (
          <div className="flex items-center gap-2 font-sans text-xs text-muted">
            <span>
              Identificado como{" "}
              <strong className="text-foreground">{guest.name}</strong>
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-accent/30 px-2 py-1 text-xs transition hover:bg-accent-soft/40"
              >
                sair
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/identificar?next=%2Fcharraia%2Fpresentes"
            className="rounded-md border border-accent/30 px-3 py-1.5 font-sans text-xs text-muted transition hover:bg-accent-soft/40"
          >
            Identificar-se
          </Link>
        )}
      </div>
      <p className="mt-3 max-w-2xl font-serif text-base text-muted sm:mt-4 sm:text-lg">
        Escolha um presente pra compor nosso arraiá. O botão{" "}
        <em>Selecionar</em> reserva o item, e o link leva direto ao produto.
      </p>

      {products.length === 0 ? (
        <p className="mt-16 text-center font-serif text-lg text-muted">
          Em breve publicaremos a lista.
        </p>
      ) : (
        <>
          {mine.length > 0 && (
            <section className="mt-8 sm:mt-10">
              <div className="flex items-baseline gap-2">
                <h2 className="font-serif text-xl text-foreground sm:text-2xl">
                  Seus presentes
                </h2>
                <span className="font-sans text-xs text-muted">
                  ({mine.length})
                </span>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-4 sm:mt-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
                {mine.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col overflow-hidden rounded-lg border border-accent/40 bg-white transition hover:border-accent hover:shadow-md"
                  >
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="aspect-square w-full bg-accent-soft/40 p-2 sm:p-3">
                        <div className="relative h-full w-full overflow-hidden rounded-md bg-white">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image}
                              alt={p.title ?? "Produto"}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-contain p-3 sm:p-4"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center font-sans text-sm text-muted">
                              sem prévia
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1.5 p-4 sm:p-5">
                        <p className="line-clamp-2 font-sans text-sm leading-snug text-foreground lg:text-base">
                          {p.title}
                        </p>
                        <p className="font-sans text-[11px] uppercase tracking-wide text-muted sm:text-xs">
                          {p.site}
                        </p>
                        {p.price && (
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-sans text-base font-semibold text-accent lg:text-lg">
                              {p.price}
                            </span>
                          </div>
                        )}
                      </div>
                    </a>
                    <div className="mt-auto border-t border-accent/10 p-3 sm:p-4">
                      <form action={unselectGift}>
                        <input type="hidden" name="gift_id" value={p.id} />
                        <button
                          type="submit"
                          className="w-full rounded-md border border-accent/40 bg-accent-soft/40 py-2 font-sans text-sm text-foreground transition hover:bg-accent-soft"
                        >
                          ✓ Você escolheu — cancelar
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {available.length > 0 && (
            <section className="mt-8 sm:mt-10">
              {mine.length > 0 && (
                <h2 className="font-serif text-xl text-foreground sm:text-2xl">
                  Disponíveis
                </h2>
              )}
              <ul
                className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6 ${
                  mine.length > 0 ? "mt-3 sm:mt-4" : ""
                }`}
              >
                {available.map((p) => {
                  const remaining = p.quantity - p.selectedCount;
                  const soldOut = remaining <= 0;
                  return (
                    <li
                      key={p.id}
                      className={`flex flex-col overflow-hidden rounded-lg border bg-white transition ${
                        soldOut
                          ? "border-accent/10 opacity-60"
                          : "border-accent/20 hover:border-accent hover:shadow-md"
                      }`}
                    >
                      <div className="block">
                        <div className="aspect-square w-full bg-accent-soft/40 p-2 sm:p-3">
                          <div className="relative h-full w-full overflow-hidden rounded-md bg-white">
                            {p.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.image}
                                alt={p.title ?? "Produto"}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-contain p-3 sm:p-4"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center font-sans text-sm text-muted">
                                sem prévia
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1.5 p-4 sm:p-5">
                          <p className="line-clamp-2 font-sans text-sm leading-snug text-foreground lg:text-base">
                            {p.title}
                          </p>
                          <p className="font-sans text-[11px] uppercase tracking-wide text-muted sm:text-xs">
                            {p.site}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            {p.price ? (
                              <span className="font-sans text-base font-semibold text-accent lg:text-lg">
                                {p.price}
                              </span>
                            ) : (
                              <span />
                            )}
                            {p.quantity > 1 && (
                              <span className="rounded-full bg-accent-soft/60 px-2 py-0.5 font-sans text-xs text-muted">
                                {remaining > 0
                                  ? `${remaining} de ${p.quantity}`
                                  : "indisponível"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto border-t border-accent/10 p-3 sm:p-4">
                        {soldOut ? (
                          <button
                            type="button"
                            disabled
                            className="w-full cursor-not-allowed rounded-md border border-accent/20 bg-accent-soft/20 py-2 font-sans text-sm text-muted"
                          >
                            Indisponível
                          </button>
                        ) : (
                          <form action={selectGift}>
                            <input type="hidden" name="gift_id" value={p.id} />
                            <button
                              type="submit"
                              className="w-full rounded-md bg-accent py-2 font-sans text-sm font-medium text-white transition hover:opacity-90"
                            >
                              Selecionar
                            </button>
                          </form>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
