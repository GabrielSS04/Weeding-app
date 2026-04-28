"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { eventByRsvpPath, isRsvpClosed } from "@/lib/events";

const ALLOWED_NEXT = new Set(["/casamento/rsvp", "/charraia/rsvp"]);

function safeNext(value: FormDataEntryValue | null): string {
  const raw = String(value ?? "");
  return ALLOWED_NEXT.has(raw) ? raw : "/casamento/rsvp";
}

function revalidate() {
  revalidatePath("/casamento/rsvp");
  revalidatePath("/charraia/rsvp");
  revalidatePath("/admin");
}

function guardDeadline(next: string): void {
  const event = eventByRsvpPath(next);
  if (event && isRsvpClosed(event)) {
    redirect(`${next}?error=encerrado`);
  }
}

export async function confirmGuest(formData: FormData) {
  const next = safeNext(formData.get("next"));
  guardDeadline(next);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    redirect(`${next}?error=invalido`);
  }

  const { rows } = await db.query<{
    id: number;
    confirmed_at: Date | null;
  }>(
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
    "UPDATE guest_list SET confirmed_at = NOW(), declined_at = NULL WHERE id = $1",
    [id]
  );

  revalidate();
  redirect(`${next}?ok=${id}`);
}

export async function declineGuest(formData: FormData) {
  const next = safeNext(formData.get("next"));
  guardDeadline(next);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    redirect(`${next}?error=invalido`);
  }

  const { rows } = await db.query<{
    id: number;
    declined_at: Date | null;
  }>(
    "SELECT id, declined_at FROM guest_list WHERE id = $1",
    [id]
  );

  if (rows.length === 0) {
    redirect(`${next}?error=naoencontrado`);
  }

  if (rows[0].declined_at) {
    redirect(`${next}?already_declined=${id}`);
  }

  await db.query(
    "UPDATE guest_list SET declined_at = NOW(), confirmed_at = NULL WHERE id = $1",
    [id]
  );

  revalidate();
  redirect(`${next}?declined=${id}`);
}

export async function resetGuest(formData: FormData) {
  const next = safeNext(formData.get("next"));
  guardDeadline(next);

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) {
    redirect(`${next}?error=invalido`);
  }

  await db.query(
    "UPDATE guest_list SET confirmed_at = NULL, declined_at = NULL WHERE id = $1",
    [id]
  );

  revalidate();
  redirect(`${next}?reset=${id}`);
}
