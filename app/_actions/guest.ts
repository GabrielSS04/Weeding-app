"use server";

import { revalidatePath } from "next/cache";
import { clearGuest } from "@/lib/session";

export async function signOut() {
  await clearGuest();
  revalidatePath("/", "layout");
}
