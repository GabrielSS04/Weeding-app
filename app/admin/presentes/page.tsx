import { db } from "@/lib/db";
import {
  createGift,
  refreshGiftMetadata,
  refreshGiftPrices,
} from "./actions";
import { GiftList } from "./_components/GiftList";

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
        <div className="flex flex-wrap gap-2">
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
          {gifts.length > 0 && (
            <form action={refreshGiftPrices}>
              <button
                type="submit"
                className="rounded-md border border-accent/40 bg-accent-soft/40 px-3 py-1.5 font-sans text-xs text-foreground transition hover:bg-accent-soft"
              >
                Atualizar preços ({gifts.length})
              </button>
            </form>
          )}
        </div>
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

      <GiftList gifts={gifts} />
    </main>
  );
}
