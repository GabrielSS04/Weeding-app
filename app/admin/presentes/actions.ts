"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { fetchProduct } from "@/lib/fetch-product";

function parseQuantity(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

async function fillFromOg(
  url: string,
  price: string | null,
  title: string | null,
  image: string | null
): Promise<{ price: string | null; title: string | null; image: string | null }> {
  if (price && title && image) return { price, title, image };
  const og = await fetchProduct(url);
  return {
    price: price ?? og.price,
    title: title ?? og.title,
    image: image ?? og.image,
  };
}

export async function createGift(formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim() || null;
  const image = String(formData.get("image") ?? "").trim() || null;
  const quantity = parseQuantity(formData.get("quantity"));

  if (!url) return;

  const filled = await fillFromOg(url, price, title, image);

  await db.query(
    "INSERT INTO gifts (url, price, title, image, quantity) VALUES ($1, $2, $3, $4, $5)",
    [url, filled.price, filled.title, filled.image, quantity]
  );

  revalidatePath("/admin/presentes");
  revalidatePath("/casamento/presentes");
  revalidatePath("/charraia/presentes");
}

export async function updateGift(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const url = String(formData.get("url") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim() || null;
  const image = String(formData.get("image") ?? "").trim() || null;
  const quantity = parseQuantity(formData.get("quantity"));

  if (!url) return;

  const filled = await fillFromOg(url, price, title, image);

  await db.query(
    "UPDATE gifts SET url = $1, price = $2, title = $3, image = $4, quantity = $5 WHERE id = $6",
    [url, filled.price, filled.title, filled.image, quantity, id]
  );

  revalidatePath("/admin/presentes");
  revalidatePath("/casamento/presentes");
  revalidatePath("/charraia/presentes");
  redirect("/admin/presentes");
}

export async function deleteGift(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.query("DELETE FROM gifts WHERE id = $1", [id]);

  revalidatePath("/admin/presentes");
  revalidatePath("/casamento/presentes");
  revalidatePath("/charraia/presentes");
}

export async function refreshGiftMetadata() {
  const { rows } = await db.query<{
    id: number;
    url: string;
    price: string | null;
    title: string | null;
    image: string | null;
  }>(
    `SELECT id, url, price, title, image
     FROM gifts
     WHERE price IS NULL OR title IS NULL OR image IS NULL`
  );

  await Promise.all(
    rows.map(async (g) => {
      const og = await fetchProduct(g.url);
      const next = {
        price: g.price ?? og.price,
        title: g.title ?? og.title,
        image: g.image ?? og.image,
      };
      if (next.price === g.price && next.title === g.title && next.image === g.image) {
        return;
      }
      await db.query(
        "UPDATE gifts SET price = $1, title = $2, image = $3 WHERE id = $4",
        [next.price, next.title, next.image, g.id]
      );
    })
  );

  revalidatePath("/admin/presentes");
  revalidatePath("/casamento/presentes");
  revalidatePath("/charraia/presentes");
}
