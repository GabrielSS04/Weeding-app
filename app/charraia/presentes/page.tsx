import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { getGuest } from "@/lib/session";
import { GiftList } from "./_components/GiftList";

export const dynamic = "force-dynamic";

type Gift = {
  id: number;
  url: string;
  price: string | null;
  title: string | null;
  image: string | null;
  quantity: number;
  selected_count: number;
  mine: boolean;
};

export default async function PresentesCharraia() {
  const guest = await getGuest();
  const email = guest?.email ?? "";

  const { rows } = await db.query<Gift>(
    `SELECT g.id, g.url, g.price, g.title, g.image, g.quantity,
       (SELECT COUNT(*)::int FROM gift_selections s WHERE s.gift_id = g.id) AS selected_count,
       EXISTS (SELECT 1 FROM gift_selections s WHERE s.gift_id = g.id AND s.email = $1) AS mine
     FROM gifts g
     ORDER BY COALESCE(g.title, g.url) ASC`,
    [email]
  );

  const products = rows.map((g) => ({
    id: g.id,
    url: g.url,
    price: g.price,
    quantity: g.quantity,
    selectedCount: g.selected_count,
    mine: g.mine,
    title: g.title ?? g.url,
    image: g.image,
    site: new URL(g.url).hostname.replace(/^www\./, ""),
  }));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>

      <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="flex-1">
          <h1 className="font-serif text-4xl text-foreground sm:text-5xl">
            Lista de Presentes
          </h1>
          <p className="mt-3 max-w-2xl font-serif text-base text-muted sm:mt-4 sm:text-lg">
            Sua presença já é o que mais importa. Os itens abaixo são apenas
            sugestões &mdash; se preferir presentear com outra coisa, ou não
            presentear, fique totalmente à vontade. O botão <em>Selecionar</em>{" "}
            reserva o item, e o link leva direto ao produto.
          </p>
        </div>

        <div className="flex w-full max-w-[10rem] flex-col items-center sm:w-40 sm:shrink-0">
          <div className="w-full overflow-hidden rounded-lg bg-accent-soft p-2 shadow-md">
            <Image
              src="/WhatsApp%20Image%202026-05-29%20at%2021.04.06.jpeg"
              alt="QR Code do Pix"
              width={512}
              height={512}
              className="h-auto w-full rounded"
            />
          </div>
          <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.25em] text-muted">
            Pix · CPF
          </p>
          <p className="font-serif text-sm text-foreground">105.125.109-54</p>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center font-serif text-lg text-muted">
          Em breve publicaremos a lista.
        </p>
      ) : (
        <GiftList products={products} />
      )}
    </main>
  );
}
