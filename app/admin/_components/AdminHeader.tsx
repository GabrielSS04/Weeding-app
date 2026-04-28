"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/admin", label: "Convidados" },
  { href: "/admin/presentes", label: "Presentes" },
  { href: "/admin/conselhos", label: "Conselhos" },
  { href: "/", label: "← Site" },
];

export function AdminHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="relative border-b border-accent/20 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/admin"
          className="font-serif text-lg text-foreground sm:text-xl"
        >
          Admin
        </Link>

        <nav className="hidden gap-6 font-sans text-sm sm:flex">
          {navLinks.map((l) => {
            const active = l.href === pathname;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`transition ${
                  active ? "text-accent" : "text-muted hover:text-accent"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded-md border border-accent/30 p-2 text-muted transition hover:bg-accent-soft/40 sm:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default bg-foreground/20 sm:hidden"
          />
          <div className="absolute left-0 right-0 top-full z-40 border-b border-accent/20 bg-white shadow-md sm:hidden">
            <nav className="mx-auto flex max-w-5xl flex-col px-4 py-2">
              {navLinks.map((l) => {
                const active = l.href === pathname;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-3 font-serif text-lg transition ${
                      active
                        ? "bg-accent-soft/40 text-accent"
                        : "text-foreground hover:bg-accent-soft/40"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
