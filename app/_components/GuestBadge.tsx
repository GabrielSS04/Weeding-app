import Link from "next/link";
import { getGuest } from "@/lib/session";
import { signOut } from "@/app/_actions/guest";

export async function GuestBadge({ next }: { next: string }) {
  const guest = await getGuest();

  if (!guest) {
    return (
      <Link
        href={`/identificar?next=${encodeURIComponent(next)}`}
        className="rounded-md border border-accent/30 px-3 py-1.5 font-sans text-xs text-muted transition hover:bg-accent-soft/40"
      >
        Identificar-se
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 font-sans text-xs text-muted">
      <span>
        Identificado como{" "}
        <strong className="text-foreground">{guest.name}</strong>
      </span>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md border border-accent/30 px-2 py-1 text-xs transition hover:bg-accent-soft/40"
        >
          sair
        </button>
      </form>
    </div>
  );
}
