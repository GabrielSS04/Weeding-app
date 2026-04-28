"use client";

import { useMemo, useState } from "react";
import {
  confirmGuestAdmin,
  deleteGuest,
  unconfirmGuest,
} from "../actions";

type Guest = {
  id: number;
  name: string;
  confirmed_at: string | null;
  created_at: string;
};

type Filter = "todos" | "confirmados" | "pendentes";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function GuestTable({ guests }: { guests: Guest[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return guests.filter((g) => {
      if (filter === "confirmados" && !g.confirmed_at) return false;
      if (filter === "pendentes" && g.confirmed_at) return false;
      if (q && !normalize(g.name).includes(q)) return false;
      return true;
    });
  }, [guests, query, filter]);

  return (
    <section className="mt-8 rounded-lg border border-accent/20 bg-white sm:mt-10">
      <div className="flex flex-wrap items-center gap-3 border-b border-accent/10 px-4 py-3 sm:px-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome..."
          autoComplete="off"
          className="min-w-[200px] flex-1 rounded-md border border-accent/30 bg-white px-3 py-2 font-sans text-sm outline-none focus:border-accent"
        />
        <div className="flex gap-1 font-sans text-xs">
          {(
            [
              { value: "todos", label: "Todos" },
              { value: "confirmados", label: "Confirmados" },
              { value: "pendentes", label: "Pendentes" },
            ] as { value: Filter; label: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-md border px-3 py-1.5 transition ${
                filter === opt.value
                  ? "border-accent bg-accent text-white"
                  : "border-accent/30 text-foreground hover:bg-accent-soft/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left font-sans text-sm">
          <thead className="bg-accent-soft/40 text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Confirmado em</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/10">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted"
                >
                  {guests.length === 0
                    ? "Nenhum convidado cadastrado ainda."
                    : "Nenhum convidado encontrado com esses filtros."}
                </td>
              </tr>
            ) : (
              filtered.map((g) => (
                <tr key={g.id}>
                  <td className="px-4 py-3 font-serif text-base text-foreground">
                    {g.name}
                  </td>
                  <td className="px-4 py-3">
                    {g.confirmed_at ? (
                      <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                        ✓ Confirmado
                      </span>
                    ) : (
                      <span className="rounded-full border border-accent/30 bg-accent-soft/40 px-2 py-0.5 text-xs text-muted">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {g.confirmed_at
                      ? new Date(g.confirmed_at).toLocaleString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {g.confirmed_at ? (
                        <form action={unconfirmGuest}>
                          <input type="hidden" name="id" value={g.id} />
                          <button
                            type="submit"
                            className="rounded-md border border-accent/30 px-3 py-1 text-xs text-foreground transition hover:bg-accent-soft/40"
                          >
                            Desfazer
                          </button>
                        </form>
                      ) : (
                        <form action={confirmGuestAdmin}>
                          <input type="hidden" name="id" value={g.id} />
                          <button
                            type="submit"
                            className="rounded-md border border-emerald-400 px-3 py-1 text-xs text-emerald-700 transition hover:bg-emerald-50"
                          >
                            Marcar confirmado
                          </button>
                        </form>
                      )}
                      <form
                        action={deleteGuest}
                        onSubmit={(e) => {
                          if (
                            !confirm(
                              `Remover "${g.name}" da lista? Essa ação não pode ser desfeita.`
                            )
                          ) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={g.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-700 transition hover:bg-red-50"
                        >
                          Remover
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
