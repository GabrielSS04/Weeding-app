"use client";

import { useMemo, useState } from "react";
import { confirmGuest, declineGuest, resetGuest } from "../actions";

type GuestStatus = "pending" | "confirmed" | "declined";

type Guest = {
  id: number;
  name: string;
  status: GuestStatus;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function StatusBadge({ status }: { status: GuestStatus }) {
  if (status === "confirmed") {
    return (
      <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-sans text-xs text-emerald-700">
        ✓ Confirmado
      </span>
    );
  }
  if (status === "declined") {
    return (
      <span className="rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 font-sans text-xs text-rose-700">
        × Não vai
      </span>
    );
  }
  return <span className="font-sans text-xs text-muted">pendente</span>;
}

export function GuestSearchList({
  guests,
  redirectTo,
  closed,
}: {
  guests: Guest[];
  redirectTo: "/casamento/rsvp" | "/charraia/rsvp";
  closed: boolean;
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
                    <StatusBadge status={g.status} />
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
                    {closed ? (
                      <ClosedPanel guest={g} />
                    ) : (
                      <OpenPanel
                        guest={g}
                        redirectTo={redirectTo}
                        onCancel={() => setOpenId(null)}
                      />
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

function ClosedPanel({ guest }: { guest: Guest }) {
  if (guest.status === "confirmed") {
    return (
      <p className="font-serif text-base text-foreground">
        <strong>{guest.name}</strong> está confirmado(a).
      </p>
    );
  }
  if (guest.status === "declined") {
    return (
      <p className="font-serif text-base text-foreground">
        <strong>{guest.name}</strong> respondeu que não vai poder vir.
      </p>
    );
  }
  return (
    <p className="font-serif text-base text-foreground">
      Prazo de confirmação encerrado. Fale com os noivos se precisar ajustar.
    </p>
  );
}

function OpenPanel({
  guest,
  redirectTo,
  onCancel,
}: {
  guest: Guest;
  redirectTo: "/casamento/rsvp" | "/charraia/rsvp";
  onCancel: () => void;
}) {
  if (guest.status === "confirmed") {
    return (
      <>
        <p className="font-serif text-base text-foreground">
          <strong>{guest.name}</strong>, você já confirmou. Mudou de ideia?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <DeclineButton id={guest.id} redirectTo={redirectTo} />
          <ResetButton id={guest.id} redirectTo={redirectTo} label="Cancelar confirmação" />
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-2 font-sans text-sm text-muted transition hover:text-foreground"
          >
            Fechar
          </button>
        </div>
      </>
    );
  }

  if (guest.status === "declined") {
    return (
      <>
        <p className="font-serif text-base text-foreground">
          <strong>{guest.name}</strong>, você marcou que não vai. Mudou de
          ideia?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ConfirmButton
            id={guest.id}
            redirectTo={redirectTo}
            label="Quero confirmar"
          />
          <ResetButton id={guest.id} redirectTo={redirectTo} label="Remover resposta" />
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-2 font-sans text-sm text-muted transition hover:text-foreground"
          >
            Fechar
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="font-serif text-base text-foreground">
        Você é <strong>{guest.name}</strong>?
      </p>
      <p className="mt-1 font-sans text-sm text-muted">
        Confirme apenas se este é o seu nome.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <ConfirmButton
          id={guest.id}
          redirectTo={redirectTo}
          label="Sim, vou comparecer"
        />
        <DeclineButton id={guest.id} redirectTo={redirectTo} />
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-2 font-sans text-sm text-muted transition hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    </>
  );
}

function ConfirmButton({
  id,
  redirectTo,
  label,
}: {
  id: number;
  redirectTo: string;
  label: string;
}) {
  return (
    <form action={confirmGuest}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="next" value={redirectTo} />
      <button
        type="submit"
        className="rounded-md bg-accent px-5 py-2 font-serif text-base text-white transition hover:opacity-90"
      >
        {label}
      </button>
    </form>
  );
}

function DeclineButton({
  id,
  redirectTo,
}: {
  id: number;
  redirectTo: string;
}) {
  return (
    <form action={declineGuest}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="next" value={redirectTo} />
      <button
        type="submit"
        className="rounded-md border border-rose-300 px-4 py-2 font-sans text-sm text-rose-700 transition hover:bg-rose-50"
      >
        Não vou poder comparecer
      </button>
    </form>
  );
}

function ResetButton({
  id,
  redirectTo,
  label,
}: {
  id: number;
  redirectTo: string;
  label: string;
}) {
  return (
    <form action={resetGuest}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="next" value={redirectTo} />
      <button
        type="submit"
        className="rounded-md border border-accent/30 px-4 py-2 font-sans text-sm text-foreground transition hover:bg-accent-soft/40"
      >
        {label}
      </button>
    </form>
  );
}
