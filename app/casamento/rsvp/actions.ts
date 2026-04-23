"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function submitRsvp(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const guests = Number(formData.get("guests") ?? 0);
  const message = String(formData.get("message") ?? "").trim() || null;

  if (!name || !email) {
    redirect("/casamento/rsvp?error=campos");
  }

  await db.query(
    "INSERT INTO rsvps (name, email, guests, message) VALUES ($1, $2, $3, $4)",
    [name, email, Number.isFinite(guests) ? guests : 0, message]
  );

  redirect("/casamento/rsvp?ok=1");
}
