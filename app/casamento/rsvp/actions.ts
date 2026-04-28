"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const ALLOWED_NEXT = new Set(["/casamento/rsvp", "/charraia/rsvp"]);

function safeNext(value: FormDataEntryValue | null): string {
  const raw = String(value ?? "");
  return ALLOWED_NEXT.has(raw) ? raw : "/casamento/rsvp";
}

export async function confirmGuest(formData: FormData) {
  const next = safeNext(formData.get("next"));
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    redirect(`${next}?error=invalido`);
  }

  const { rows } = await db.query<{ id: number; confirmed_at: Date | null }>(
    "SELECT id, confirmed_at FROM guest_list WHERE id = $1",
    [id]
  );

  if (rows.length === 0) {
    redirect(`${next}?error=naoencontrado`);
  }

  if (rows[0].confirmed_at) {
    redirect(`${next}?already=${id}`);
  }

  await db.query(
    "UPDATE guest_list SET confirmed_at = NOW() WHERE id = $1",
    [id]
  );

  revalidatePath("/casamento/rsvp");
  revalidatePath("/charraia/rsvp");
  revalidatePath("/admin");
  redirect(`${next}?ok=${id}`);
}
