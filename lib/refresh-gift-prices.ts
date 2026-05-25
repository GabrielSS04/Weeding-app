import "server-only";

import { db } from "@/lib/db";
import { fetchProduct } from "@/lib/fetch-product";

export async function refreshAllGiftPrices(): Promise<{
  total: number;
  updated: number;
  failed: number;
}> {
  const { rows } = await db.query<{
    id: number;
    url: string;
    price: string | null;
  }>(`SELECT id, url, price FROM gifts`);

  let updated = 0;
  let failed = 0;

  await Promise.all(
    rows.map(async (g) => {
      const og = await fetchProduct(g.url, { noCache: true });
      if (!og.price) {
        failed += 1;
        return;
      }
      if (og.price === g.price) return;
      await db.query("UPDATE gifts SET price = $1 WHERE id = $2", [
        og.price,
        g.id,
      ]);
      updated += 1;
    })
  );

  return { total: rows.length, updated, failed };
}
