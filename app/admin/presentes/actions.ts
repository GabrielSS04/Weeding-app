"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

function parseQuantity(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export async function createGift(formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || null;
  const title = String(formData.get("title") ?? "").trim() || null;
  const image = String(formData.get("image") ?? "").trim() || null;
  const quantity = parseQuantity(formData.get("quantity"));

  if (!url) return;

  await db.query(
    "INSERT INTO gifts (url, price, title, image, quantity) VALUES ($1, $2, $3, $4, $5)",
    [url, price, title, image, quantity]
  );

  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
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

  await db.query(
    "UPDATE gifts SET url = $1, price = $2, title = $3, image = $4, quantity = $5 WHERE id = $6",
    [url, price, title, image, quantity, id]
  );

  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
  redirect("/admin/presentes");
}

export async function deleteGift(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.query("DELETE FROM gifts WHERE id = $1", [id]);

  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
}
