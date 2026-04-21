import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { updateGift } from "../../actions";

type Gift = {
  id: number;
  url: string;
  price: string | null;
  title: string | null;
  image: string | null;
  quantity: number;
};

export default async function EditGift({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { rows } = await db.query<Gift>(
    "SELECT id, url, price, title, image, quantity FROM gifts WHERE id = $1",
    [Number(id)]
  );
  const gift = rows[0];
  if (!gift) notFound();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
      <Link
        href="/admin/presentes"
        className="font-sans text-sm text-muted hover:text-accent"
      >
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground">Editar Presente</h1>

      <form
        action={updateGift}
        className="mt-8 grid gap-4 rounded-lg border border-accent/20 bg-white p-6 sm:grid-cols-2"
      >
        <input type="hidden" name="id" value={gift.id} />
        <div className="sm:col-span-2">
          <label className="block font-sans text-sm text-muted">URL do produto *</label>
          <input
            name="url"
            type="url"
            required
            defaultValue={gift.url}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block font-sans text-sm text-muted">Preço</label>
          <input
            name="price"
            type="text"
            defaultValue={gift.price ?? ""}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block font-sans text-sm text-muted">Quantidade desejada</label>
          <input
            name="quantity"
            type="number"
            min={1}
            defaultValue={gift.quantity}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-sm text-muted">Título</label>
          <input
            name="title"
            type="text"
            defaultValue={gift.title ?? ""}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-sans text-sm text-muted">Imagem (URL)</label>
          <input
            name="image"
            type="url"
            defaultValue={gift.image ?? ""}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-2 font-sans text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-md bg-accent py-2 font-serif text-base text-white transition hover:opacity-90"
          >
            Salvar
          </button>
          <Link
            href="/admin/presentes"
            className="flex-1 rounded-md border border-accent/30 py-2 text-center font-serif text-base text-foreground transition hover:bg-accent-soft/40"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
