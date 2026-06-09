"use client";

import { useMemo, useState } from "react";
import {
  confirmKidAdmin,
  declineKidAdmin,
  deleteKid,
  renameKid,
  resetKidStatus,
} from "../actions";

type KidStatus = "pending" | "confirmed" | "declined";

type Kid = {
  id: number;
  name: string;
  status: KidStatus;
  responded_at: string | null;
  created_at: string;
};

type Filter = "todos" | "confirmados" | "pendentes" | "nao_vao";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function StatusBadge({ status }: { status: KidStatus }) {
  if (status === "confirmed") {
    return (
      <span className="inline-block rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
        ✓ Confirmada
      </span>
    );
  }
  if (status === "declined") {
    return (
      <span className="inline-block rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-xs text-rose-700">
        × Não vai
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full border border-accent/30 bg-accent-soft/40 px-2 py-0.5 text-xs text-muted">
      Pendente
    </span>
  );
}

function KidName({
  kid,
  editing,
  onEdit,
  onCancel,
}: {
  kid: Kid;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) {
  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <p className="font-serif text-base text-foreground">{kid.name}</p>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-accent/30 px-2 py-0.5 font-sans text-xs text-muted transition hover:bg-accent-soft/40 hover:text-foreground"
        >
          editar
        </button>
      </div>
    );
  }

  return (
    <form action={renameKid} onSubmit={onCancel} className="flex gap-2">
      <input type="hidden" name="id" value={kid.id} />
      <input
        type="text"
        name="name"
        defaultValue={kid.name}
        required
        autoFocus
        className="min-w-0 flex-1 rounded-md border border-accent/40 bg-white px-2 py-1 font-sans text-sm outline-none focus:border-accent"
      />
      <button
        type="submit"
        className="rounded-md bg-accent px-3 py-1 font-sans text-xs text-white transition hover:opacity-90"
      >
        Salvar
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-accent/30 px-3 py-1 font-sans text-xs text-foreground transition hover:bg-accent-soft/40"
      >
        Cancelar
      </button>
    </form>
  );
}

function KidActions({ kid }: { kid: Kid }) {
  return (
    <div className="flex flex-wrap gap-2">
      {kid.status !== "confirmed" && (
        <form action={confirmKidAdmin}>
          <input type="hidden" name="id" value={kid.id} />
          <button
            type="submit"
            className="rounded-md border border-emerald-400 px-3 py-1 text-xs text-emerald-700 transition hover:bg-emerald-50"
          >
            Marcar confirmada
          </button>
        </form>
      )}
      {kid.status !== "declined" && (
        <form action={declineKidAdmin}>
          <input type="hidden" name="id" value={kid.id} />
          <button
            type="submit"
            className="rounded-md border border-rose-300 px-3 py-1 text-xs text-rose-700 transition hover:bg-rose-50"
          >
            Marcar não vai
          </button>
        </form>
      )}
      {kid.status !== "pending" && (
        <form action={resetKidStatus}>
          <input type="hidden" name="id" value={kid.id} />
          <button
            type="submit"
            className="rounded-md border border-accent/30 px-3 py-1 text-xs text-foreground transition hover:bg-accent-soft/40"
          >
            Resetar
          </button>
        </form>
      )}
      <form action={deleteKid}>
        <input type="hidden" name="id" value={kid.id} />
        <button
          type="submit"
          className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-700 transition hover:bg-red-50"
        >
          Remover
        </button>
      </form>
    </div>
  );
}

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todas" },
  { value: "confirmados", label: "Confirmadas" },
  { value: "pendentes", label: "Pendentes" },
  { value: "nao_vao", label: "Não vão" },
];

export function KidsTable({ kids }: { kids: Kid[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return kids.filter((k) => {
      if (filter === "confirmados" && k.status !== "confirmed") return false;
      if (filter === "pendentes" && k.status !== "pending") return false;
      if (filter === "nao_vao" && k.status !== "declined") return false;
      if (q && !normalize(k.name).includes(q)) return false;
      return true;
    });
  }, [kids, query, filter]);

  const emptyMessage =
    kids.length === 0
      ? "Nenhuma criança cadastrada ainda."
      : "Nenhuma criança encontrada com esses filtros.";

  return (
    <section className="mt-6 rounded-lg border border-accent/20 bg-white sm:mt-10">
      <div className="flex flex-col gap-3 border-b border-accent/10 px-4 py-3 sm:flex-row sm:items-center sm:px-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome..."
          autoComplete="off"
          className="w-full rounded-md border border-accent/30 bg-white px-3 py-2 font-sans text-sm outline-none focus:border-accent sm:flex-1"
        />
        <div className="flex flex-wrap gap-1 font-sans text-xs">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`flex-1 rounded-md border px-3 py-1.5 transition sm:flex-none ${
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

      <ul className="divide-y divide-accent/10 sm:hidden">
        {filtered.length === 0 ? (
          <li className="px-4 py-8 text-center font-sans text-sm text-muted">
            {emptyMessage}
          </li>
        ) : (
          filtered.map((k) => (
            <li key={k.id} className="space-y-2 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <KidName
                  kid={k}
                  editing={editingId === k.id}
                  onEdit={() => setEditingId(k.id)}
                  onCancel={() => setEditingId(null)}
                />
                <StatusBadge status={k.status} />
              </div>
              {k.responded_at && (
                <p className="font-sans text-xs text-muted">
                  {k.status === "confirmed" ? "Confirmou em " : "Recusou em "}
                  {new Date(k.responded_at).toLocaleString("pt-BR")}
                </p>
              )}
              <KidActions kid={k} />
            </li>
          ))
        )}
      </ul>

      <div className="hidden sm:block">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-accent-soft/40 text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Respondeu em</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((k) => (
                <tr key={k.id}>
                  <td className="px-4 py-3">
                    <KidName
                      kid={k}
                      editing={editingId === k.id}
                      onEdit={() => setEditingId(k.id)}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={k.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {k.responded_at
                      ? new Date(k.responded_at).toLocaleString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <KidActions kid={k} />
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
