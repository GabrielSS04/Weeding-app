import Link from "next/link";
import { GuestBadge } from "@/app/_components/GuestBadge";

export function CharraiaHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-x-4 px-5 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="font-script text-3xl leading-none text-accent transition hover:opacity-80 sm:text-4xl"
        >
          Charraia
        </Link>

        <GuestBadge next="/" />
      </div>
      <div className="bandeirinhas w-full" aria-hidden />
    </header>
  );
}
