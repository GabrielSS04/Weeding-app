"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

function revalidate() {
  revalidatePath("/admin");
  revalidatePath("/casamento/rsvp");
  revalidatePath("/charraia/rsvp");
}

export async function addGuest(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await db.query("INSERT INTO guest_list (name) VALUES ($1)", [name]);
  revalidate();
}

export async function addGuestsBulk(formData: FormData) {
  const raw = String(formData.get("names") ?? "");
  const names = raw
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (names.length === 0) return;

  const placeholders = names.map((_, i) => `($${i + 1})`).join(",");
  await db.query(
    `INSERT INTO guest_list (name) VALUES ${placeholders}`,
    names
  );
  revalidate();
}

export async function deleteGuest(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.query("DELETE FROM guest_list WHERE id = $1", [id]);
  revalidate();
}

export async function confirmGuestAdmin(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.query(
    "UPDATE guest_list SET confirmed_at = NOW(), declined_at = NULL WHERE id = $1",
    [id]
  );
  revalidate();
}

export async function declineGuestAdmin(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.query(
    "UPDATE guest_list SET declined_at = NOW(), confirmed_at = NULL WHERE id = $1",
    [id]
  );
  revalidate();
}

export async function resetGuestStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await db.query(
    "UPDATE guest_list SET confirmed_at = NULL, declined_at = NULL WHERE id = $1",
    [id]
  );
  revalidate();
}
