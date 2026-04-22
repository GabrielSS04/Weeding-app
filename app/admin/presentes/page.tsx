import Link from "next/link";
import { db } from "@/lib/db";
import { createGift, deleteGift, refreshGiftMetadata } from "./actions";

export const dynamic = "force-dynamic";

type Selector = { name: string; email: string; at: string };

type Gift = {
  id: number;
  url: string;
  price: string | null;
  title: string | null;
  image: string | null;
  quantity: number;
  created_at: Date;
  selectors: Selector[];
};

export default async function AdminPresentes() {
  const { rows } = await db.query<Gift>(
    `SELECT g.id, g.url, g.price, g.title, g.image, g.quantity, g.created_at,
       COALESCE(
         json_agg(
           json_build_object('name', s.name, 'email', s.email, 'at', s.created_at)
           ORDER BY s.created_at
         ) FILTER (WHERE s.id IS NOT NULL),
         '[]'::json
       ) AS selectors
     FROM gifts g
     LEFT JOIN gift_selections s ON s.gift_id = g.id
     GROUP BY g.id
     ORDER BY g.created_at DESC`
  );

  const gifts = rows;
  const pendingMetadata = gifts.filter(
    (g) => !g.price || !g.title || !g.image
  ).length;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Gerenciar Presentes</h1>
        {pendingMetadata > 0 && (
          <form action={refreshGiftMetadata}>
            <button
              type="submit"
              className="rounded-md border border-accent/40 bg-accent-soft/40 px-3 py-1.5 font-sans text-xs text-foreground transition hover:bg-accent-soft"
            >
              Atualizar metadados pendentes ({pendingMetadata})
            </button>
          </form>
        )}
      </div>

      <section className="mt-6 rounded-lg border border-accent/20 bg-white p-5 sm:mt-8 sm:p-6">
        <h2 className="font-serif text-2xl text-accent">Adicionar presente</h2>
        <p className="mt-1 font-sans text-sm text-muted">
          Só a URL é obrigatória. Título e imagem são preenchidos automaticamente
          se o site expuser Open Graph — use os campos manuais como fallback.
        </p>
        <form action={createGift} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block font-sans text-sm text-muted">URL do produto *</label>
            <input
              name="url"
              type="url"
              required
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block font-sans text-sm text-muted">Preço (opcional)</label>
            <input
              name="price"
              type="text"
              placeholder="R$ 300"
              className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block font-sans text-sm text-muted">
              Quantidade desejada
            </label>
            <input
              name="quantity"
              type="number"
              min={1}
              defaultValue={1}
              className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-sans text-sm text-muted">Título manual (opcional)</label>
            <input
              name="title"
              type="text"
              placeholder="Jogo de panelas Tramontina"
              className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-sans text-sm text-muted">Imagem manual (opcional)</label>
            <input
              name="image"
              type="url"
              placeholder="https://.../produto.jpg"
              className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-accent py-2 font-serif text-base text-white transition hover:opacity-90"
          >
            Adicionar
          </button>
        </form>
      </section>

      <section className="mt-8 overflow-x-auto rounded-lg border border-accent/20 bg-white sm:mt-10">
        <table className="w-full min-w-[880px] text-left font-sans text-sm">
          <thead className="bg-accent-soft/40 text-muted">
            <tr>
              <th className="px-4 py-3">Imagem</th>
              <th className="px-4 py-3">Título / URL</th>
              <th className="px-4 py-3">Qtd</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Selecionado por</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/10">
            {gifts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Nenhum presente cadastrado.
                </td>
              </tr>
            )}
            {gifts.map((g) => (
              <tr key={g.id} className="align-top">
                <td className="px-4 py-3">
                  {g.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.image}
                      alt=""
                      className="h-14 w-14 rounded object-contain"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded bg-accent-soft/40 text-xs text-muted">
                      —
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-serif text-base text-foreground">
                    {g.title ?? "(sem título — puxa do OG)"}
                  </p>
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-xs text-muted hover:text-accent"
                  >
                    {g.url}
                  </a>
                </td>
                <td className="px-4 py-3 text-foreground">
                  <span className="font-medium">
                    {g.selectors.length}
                  </span>
                  <span className="text-muted">/{g.quantity}</span>
                </td>
                <td className="px-4 py-3 text-accent">{g.price ?? "—"}</td>
                <td className="px-4 py-3">
                  {g.selectors.length === 0 ? (
                    <span className="text-muted">—</span>
                  ) : (
                    <ul className="space-y-1.5">
                      {g.selectors.map((s) => (
                        <li key={s.email} className="leading-tight">
                          <p className="text-foreground">{s.name}</p>
                          <p className="text-xs text-muted">
                            <a
                              href={`mailto:${s.email}`}
                              className="hover:text-accent"
                            >
                              {s.email}
                            </a>
                            <span className="ml-2">
                              {new Date(s.at).toLocaleDateString("pt-BR")}
                            </span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/presentes/${g.id}/edit`}
                      className="rounded-md border border-accent/30 px-3 py-1 text-xs text-foreground transition hover:bg-accent-soft/40"
                    >
                      Editar
                    </Link>
                    <form action={deleteGift}>
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
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
