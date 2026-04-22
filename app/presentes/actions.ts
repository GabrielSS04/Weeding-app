"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearGuest, getGuest } from "@/lib/session";

export async function selectGift(formData: FormData) {
  const giftId = Number(formData.get("gift_id"));
  if (!Number.isInteger(giftId)) return;

  const guest = await getGuest();
  if (!guest) {
    redirect(
      `/identificar?next=${encodeURIComponent("/presentes")}&gift_id=${giftId}`
    );
  }

  const { rows: g } = await db.query<{ quantity: number }>(
    "SELECT quantity FROM gifts WHERE id = $1",
    [giftId]
  );
  if (!g[0]) return;

  const { rows: c } = await db.query<{ count: number }>(
    "SELECT COUNT(*)::int AS count FROM gift_selections WHERE gift_id = $1",
    [giftId]
  );
  if (c[0].count >= g[0].quantity) {
    revalidatePath("/presentes");
    return;
  }

  await db.query(
    "INSERT INTO gift_selections (gift_id, name, email) VALUES ($1, $2, $3) ON CONFLICT (gift_id, email) DO NOTHING",
    [giftId, guest.name, guest.email]
  );
  revalidatePath("/presentes");
}

export async function unselectGift(formData: FormData) {
  const giftId = Number(formData.get("gift_id"));
  if (!Number.isInteger(giftId)) return;

  const guest = await getGuest();
  if (!guest) return;

  await db.query(
    "DELETE FROM gift_selections WHERE gift_id = $1 AND email = $2",
    [giftId, guest.email]
  );
  revalidatePath("/presentes");
}

export async function signOut() {
  await clearGuest();
  revalidatePath("/presentes");
}
