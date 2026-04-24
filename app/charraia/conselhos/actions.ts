"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getGuest } from "@/lib/session";

const BASE = "/charraia/conselhos";
const MAX_LEN = 2000;

function revalidate() {
  revalidatePath(BASE);
  revalidatePath("/admin/conselhos");
}

export async function createAdvice(formData: FormData) {
  const message = String(formData.get("message") ?? "").trim();
  if (!message) return;

  const guest = await getGuest();
  if (!guest) {
    redirect(`/identificar?next=${encodeURIComponent(BASE)}`);
  }

  await db.query(
    "INSERT INTO advices (name, email, message) VALUES ($1, $2, $3)",
    [guest.name, guest.email, message.slice(0, MAX_LEN)]
  );
  revalidate();
}

export async function updateAdvice(formData: FormData) {
  const id = Number(formData.get("id"));
  const message = String(formData.get("message") ?? "").trim();
  if (!Number.isInteger(id) || !message) return;

  const guest = await getGuest();
  if (!guest) return;

  await db.query(
    "UPDATE advices SET message = $1, updated_at = NOW() WHERE id = $2 AND email = $3",
    [message.slice(0, MAX_LEN), id, guest.email]
  );
  revalidate();
  redirect(BASE);
}

export async function deleteAdvice(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const guest = await getGuest();
  if (!guest) return;

  await db.query(
    "DELETE FROM advices WHERE id = $1 AND email = $2",
    [id, guest.email]
  );
  revalidate();
}
