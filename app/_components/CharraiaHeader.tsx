import Link from "next/link";
import { GuestBadge } from "@/app/_components/GuestBadge";
import { MobileMenu } from "@/app/_components/MobileMenu";

const navLinks = [
  { href: "/charraia/nossa-historia", label: "Nossa História" },
  { href: "/charraia/presentes", label: "Presentes" },
  { href: "/charraia/conselhos", label: "Conselhos" },
];

export function CharraiaHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-background">
      <div className="mx-auto flex max-w-6xl items-center px-5 py-3 sm:gap-x-6 sm:px-6 sm:py-4">
        <div className="flex flex-1 items-center justify-start sm:flex-none">
          <MobileMenu links={navLinks} />
        </div>

        <Link
          href="/"
          className="font-script text-3xl leading-none text-accent transition hover:opacity-80 sm:text-4xl"
        >
          Charraia
        </Link>

        <nav className="hidden items-center gap-x-5 font-sans text-sm sm:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted transition hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end sm:ml-auto sm:flex-none">
          <GuestBadge next="/" />
        </div>
      </div>
      <div className="bandeirinhas w-full" aria-hidden />
    </header>
  );
}
