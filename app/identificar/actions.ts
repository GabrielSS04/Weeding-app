"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { setGuest } from "@/lib/session";

const DEFAULT_NEXT = "/charraia/presentes";

function safeNext(value: string | null): string {
  if (!value) return DEFAULT_NEXT;
  if (!value.startsWith("/") || value.startsWith("//")) return DEFAULT_NEXT;
  return value;
}

export async function identify(formData: FormData) {
  const typedName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(String(formData.get("next") ?? DEFAULT_NEXT));
  const giftId = Number(formData.get("gift_id"));

  if (!typedName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(`/identificar?error=1&next=${encodeURIComponent(next)}${Number.isInteger(giftId) ? `&gift_id=${giftId}` : ""}`);
  }

  const { rows: existing } = await db.query<{ name: string }>(
    `SELECT name FROM (
       SELECT name, created_at FROM gift_selections WHERE email = $1
       UNION ALL
       SELECT name, created_at FROM advices WHERE email = $1
     ) s
     ORDER BY created_at DESC
     LIMIT 1`,
    [email]
  );
  const name = existing[0]?.name ?? typedName;

  await setGuest({ name, email });

  if (Number.isInteger(giftId)) {
    const { rows: g } = await db.query<{ quantity: number }>(
      "SELECT quantity FROM gifts WHERE id = $1",
      [giftId]
    );
    if (g[0]) {
      const { rows: c } = await db.query<{ count: number }>(
        "SELECT COUNT(*)::int AS count FROM gift_selections WHERE gift_id = $1",
        [giftId]
      );
      if (c[0].count < g[0].quantity) {
        await db.query(
          "INSERT INTO gift_selections (gift_id, name, email) VALUES ($1, $2, $3) ON CONFLICT (gift_id, email) DO NOTHING",
          [giftId, name, email]
        );
        revalidatePath("/casamento/presentes");
        revalidatePath("/charraia/presentes");
      }
    }
  }

  redirect(next);
}
