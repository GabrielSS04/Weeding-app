import "server-only";
import { cookies } from "next/headers";

const COOKIE = "wedding_guest";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type Guest = { name: string; email: string };

function encode(g: Guest): string {
  return Buffer.from(JSON.stringify(g), "utf8").toString("base64url");
}

function decode(raw: string): Guest | null {
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const v = JSON.parse(json);
    if (typeof v?.name === "string" && typeof v?.email === "string") {
      return { name: v.name, email: v.email };
    }
  } catch {}
  return null;
}

export async function getGuest(): Promise<Guest | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  return raw ? decode(raw) : null;
}

export async function setGuest(g: Guest): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, encode(g), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearGuest(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
