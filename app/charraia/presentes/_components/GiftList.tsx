"use client";

import { useMemo, useState } from "react";
import { selectGift, unselectGift } from "../actions";

type Product = {
  id: number;
  url: string;
  price: string | null;
  quantity: number;
  selectedCount: number;
  mine: boolean;
  title: string;
  image: string | null;
  site: string;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function GiftList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const { mine, available, totalMatches } = useMemo(() => {
    const q = normalize(query.trim());
    const filtered = q
      ? products.filter(
          (p) => normalize(p.title).includes(q) || normalize(p.site).includes(q)
        )
      : products;
    return {
      mine: filtered.filter((p) => p.mine),
      available: filtered.filter((p) => !p.mine),
      totalMatches: filtered.length,
    };
  }, [products, query]);

  return (
    <>
      <div className="mt-8 rounded-lg border border-accent/30 bg-accent-soft/40 p-4 sm:mt-10 sm:p-5">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted">
          Endereço para entrega
        </p>
        <p className="mt-1 font-sans text-base font-bold leading-snug text-foreground sm:text-lg">
          Rua Manoel Antonio de Oliveira, nº 2209 — CEP 85803-700
        </p>
      </div>

      <div className="mt-6 sm:mt-8">
        <label className="block font-sans text-sm text-muted">
          Filtrar presentes
        </label>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título ou site..."
          autoComplete="off"
          className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
        />
      </div>

      {totalMatches === 0 ? (
        <p className="mt-10 text-center font-serif text-lg text-muted">
          Nenhum presente encontrado.
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
                    <div className="mt-auto flex flex-col gap-2 border-t border-accent/10 p-3 sm:p-4">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full rounded-md bg-accent py-2 text-center font-sans text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Comprar
                      </a>
                      <form action={unselectGift}>
                        <input type="hidden" name="gift_id" value={p.id} />
                        <button
                          type="submit"
                          className="w-full rounded-md border border-accent/40 bg-accent-soft/40 py-2 font-sans text-sm text-foreground transition hover:bg-accent-soft"
                        >
                          Cancelar
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
                                  : "comprado"}
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
                            Comprado
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
    </>
  );
}
