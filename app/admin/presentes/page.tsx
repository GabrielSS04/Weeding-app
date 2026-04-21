import Link from "next/link";
import { db } from "@/lib/db";
import { createGift, deleteGift } from "./actions";

export const dynamic = "force-dynamic";

type Gift = {
  id: number;
  url: string;
  price: string | null;
  title: string | null;
  image: string | null;
  quantity: number;
  created_at: Date;
};

export default async function AdminPresentes() {
  const { rows } = await db.query<Gift>(
    "SELECT id, url, price, title, image, quantity, created_at FROM gifts ORDER BY created_at DESC"
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12">
      <h1 className="font-serif text-4xl text-foreground">Gerenciar Presentes</h1>

      <section className="mt-8 rounded-lg border border-accent/20 bg-white p-6">
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

      <section className="mt-10 overflow-hidden rounded-lg border border-accent/20 bg-white">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-accent-soft/40 text-muted">
            <tr>
              <th className="px-4 py-3">Imagem</th>
              <th className="px-4 py-3">Título / URL</th>
              <th className="px-4 py-3">Qtd</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/10">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Nenhum presente cadastrado.
                </td>
              </tr>
            )}
            {rows.map((g) => (
              <tr key={g.id}>
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
                <td className="px-4 py-3 text-foreground">{g.quantity}</td>
                <td className="px-4 py-3 text-accent">{g.price ?? "—"}</td>
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
