import Link from "next/link";
import { db } from "@/lib/db";
import { fetchProduct } from "@/lib/fetch-product";

export const dynamic = "force-dynamic";

type Gift = {
  id: number;
  url: string;
  price: string | null;
  title: string | null;
  image: string | null;
  quantity: number;
};

export default async function Presentes() {
  const { rows } = await db.query<Gift>(
    "SELECT id, url, price, title, image, quantity FROM gifts ORDER BY created_at DESC"
  );

  const products = await Promise.all(
    rows.map(async (g) => {
      const needsFetch = !g.title || !g.image;
      const og = needsFetch ? await fetchProduct(g.url) : null;
      return {
        id: g.id,
        url: g.url,
        price: g.price,
        quantity: g.quantity,
        title: g.title ?? og?.title ?? g.url,
        image: g.image ?? og?.image ?? null,
        site: og?.site ?? new URL(g.url).hostname.replace(/^www\./, ""),
      };
    })
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-8 font-serif text-5xl text-foreground">Lista de Presentes</h1>
      <p className="mt-4 max-w-2xl font-serif text-lg text-muted">
        Sua presença já é o maior presente. Se desejar nos abençoar com algo a
        mais, escolha uma das opções abaixo — o link leva direto ao produto.
      </p>

      {products.length === 0 ? (
        <p className="mt-16 text-center font-serif text-lg text-muted">
          Em breve publicaremos a lista.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((p) => (
            <li
              key={p.id}
              className="overflow-hidden rounded-lg border border-accent/20 bg-white transition hover:border-accent hover:shadow-md"
            >
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative aspect-square w-full bg-accent-soft/40">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.title ?? "Produto"}
                      loading="lazy"
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-serif text-sm text-muted">
                      sem prévia
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-4">
                  <p className="line-clamp-2 font-serif text-base leading-snug text-foreground">
                    {p.title}
                  </p>
                  <p className="font-sans text-xs uppercase tracking-wide text-muted">
                    {p.site}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    {p.price ? (
                      <span className="font-sans text-sm text-accent">{p.price}</span>
                    ) : (
                      <span />
                    )}
                    {p.quantity > 1 && (
                      <span className="rounded-full bg-accent-soft/60 px-2 py-0.5 font-sans text-xs text-muted">
                        {p.quantity}x
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
