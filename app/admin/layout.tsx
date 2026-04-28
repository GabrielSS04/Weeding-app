import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-accent/20 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-serif text-xl text-foreground">
            Admin
          </Link>
          <nav className="flex gap-6 font-sans text-sm">
            <Link
              href="/admin"
              className="text-muted transition hover:text-accent"
            >
              Convidados
            </Link>
            <Link
              href="/admin/presentes"
              className="text-muted transition hover:text-accent"
            >
              Presentes
            </Link>
            <Link
              href="/admin/conselhos"
              className="text-muted transition hover:text-accent"
            >
              Conselhos
            </Link>
            <Link
              href="/"
              className="text-muted transition hover:text-accent"
            >
              ← Site
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
