"use client";

import { useMemo, useState } from "react";
import { confirmGuest } from "../actions";

type Guest = {
  id: number;
  name: string;
  confirmed: boolean;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function GuestSearchList({
  guests,
  redirectTo,
}: {
  guests: Guest[];
  redirectTo: "/casamento/rsvp" | "/charraia/rsvp";
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return guests;
    return guests.filter((g) => normalize(g.name).includes(q));
  }, [guests, query]);

  if (guests.length === 0) {
    return (
      <p className="mt-8 rounded-md border border-accent/30 bg-accent-soft/30 p-5 font-serif text-base text-muted">
        A lista de convidados ainda não foi publicada. Em breve você poderá
        confirmar sua presença por aqui.
      </p>
    );
  }

  const toggle = (id: number) =>
    setOpenId((current) => (current === id ? null : id));

  return (
    <div className="mt-8 sm:mt-10">
      <label className="block font-sans text-sm text-muted">
        Procure seu nome na lista
      </label>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite seu nome..."
        autoComplete="off"
        className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
      />

      <ul className="mt-4 max-h-[480px] divide-y divide-accent/10 overflow-y-auto rounded-md border border-accent/20 bg-white">
        {filtered.length === 0 ? (
          <li className="px-4 py-6 text-center font-sans text-sm text-muted">
            Nenhum nome encontrado. Confira a grafia ou fale com os noivos.
          </li>
        ) : (
          filtered.map((g) => {
            const isOpen = g.id === openId;
            return (
              <li key={g.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`guest-panel-${g.id}`}
                  onClick={() => toggle(g.id)}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-serif text-base transition ${
                    isOpen
                      ? "bg-accent-soft/60 text-foreground"
                      : "text-foreground hover:bg-accent-soft/30"
                  }`}
                >
                  <span>{g.name}</span>
                  <span className="flex items-center gap-2">
                    {g.confirmed ? (
                      <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-sans text-xs text-emerald-700">
                        ✓ Confirmado
                      </span>
                    ) : (
                      <span className="font-sans text-xs text-muted">
                        pendente
                      </span>
                    )}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-muted transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`guest-panel-${g.id}`}
                    className="border-t border-accent/10 bg-accent-soft/20 px-4 py-4 sm:px-5"
                  >
                    {g.confirmed ? (
                      <>
                        <p className="font-serif text-base text-foreground">
                          <strong>{g.name}</strong> já confirmou presença.
                        </p>
                        <p className="mt-1 font-sans text-sm text-muted">
                          Se foi engano, fale com os noivos para corrigir.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-serif text-base text-foreground">
                          Confirmar presença em nome de{" "}
                          <strong>{g.name}</strong>?
                        </p>
                        <p className="mt-1 font-sans text-sm text-muted">
                          Confirme apenas se este é o seu nome.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <form action={confirmGuest}>
                            <input type="hidden" name="id" value={g.id} />
                            <input
                              type="hidden"
                              name="next"
                              value={redirectTo}
                            />
                            <button
                              type="submit"
                              className="rounded-md bg-accent px-5 py-2 font-serif text-base text-white transition hover:opacity-90"
                            >
                              Sim, sou eu — confirmar
                            </button>
                          </form>
                          <button
                            type="button"
                            onClick={() => setOpenId(null)}
                            className="rounded-md border border-accent/30 px-4 py-2 font-sans text-sm text-foreground transition hover:bg-accent-soft/40"
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
