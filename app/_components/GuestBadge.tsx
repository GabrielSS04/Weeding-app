import Link from "next/link";
import { getGuest } from "@/lib/session";
import { signOut } from "@/app/_actions/guest";

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export async function GuestBadge({ next }: { next: string }) {
  const guest = await getGuest();
  const href = `/identificar?next=${encodeURIComponent(next)}`;

  if (!guest) {
    return (
      <>
        <Link
          href={href}
          aria-label="Identificar-se"
          className="flex items-center justify-center rounded-md border border-accent/30 p-2 text-muted transition hover:bg-accent-soft/40 sm:hidden"
        >
          <UserIcon />
        </Link>
        <Link
          href={href}
          className="hidden rounded-md border border-accent/30 px-3 py-1.5 font-sans text-xs text-muted transition hover:bg-accent-soft/40 sm:inline-block"
        >
          Identificar-se
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 sm:hidden">
        <Link
          href={href}
          aria-label={`Identificado como ${guest.name}`}
          className="flex items-center justify-center rounded-md border border-accent/40 bg-accent-soft/40 p-2 text-foreground transition hover:bg-accent-soft"
        >
          <UserIcon />
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md border border-accent/30 px-2 py-1 font-sans text-xs text-muted transition hover:bg-accent-soft/40"
          >
            sair
          </button>
        </form>
      </div>

      <div className="hidden items-center gap-2 font-sans text-xs text-muted sm:flex">
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
    </>
  );
}
