import Link from "next/link";
import { db } from "@/lib/db";
import { GuestSearchList } from "@/app/casamento/rsvp/_components/GuestSearchList";

export const dynamic = "force-dynamic";

type GuestRow = {
  id: number;
  name: string;
  confirmed_at: Date | null;
};

export default async function CharraiaRSVP({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; already?: string; error?: string }>;
}) {
  const { ok, already, error } = await searchParams;

  const { rows } = await db.query<GuestRow>(
    "SELECT id, name, confirmed_at FROM guest_list ORDER BY name ASC"
  );

  const guests = rows.map((g) => ({
    id: g.id,
    name: g.name,
    confirmed: g.confirmed_at !== null,
  }));

  const okId = ok ? Number(ok) : null;
  const alreadyId = already ? Number(already) : null;
  const justConfirmed =
    okId !== null ? rows.find((g) => g.id === okId) ?? null : null;
  const alreadyConfirmed =
    alreadyId !== null ? rows.find((g) => g.id === alreadyId) ?? null : null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-10 sm:px-6 sm:py-12">
      <Link href="/" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground sm:mt-8 sm:text-5xl">
        Confirmar Presença
      </h1>
      <p className="mt-3 font-serif text-base text-muted sm:mt-4 sm:text-lg">
        Procure seu nome na lista e confirme presença no nosso arraiá. 🌽🔥
      </p>

      {justConfirmed && (
        <div
          role="status"
          className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 font-serif text-base text-emerald-900 sm:mt-8 sm:p-5 sm:text-lg"
        >
          🎉 Show, <strong>{justConfirmed.name}</strong>! Tá confirmadíssimo
          no arraiá. Te esperamos lá!
        </div>
      )}
      {alreadyConfirmed && !justConfirmed && (
        <div className="mt-6 rounded-md border border-accent/40 bg-accent-soft/40 p-4 font-serif text-base text-foreground sm:mt-8 sm:p-5 sm:text-lg">
          <strong>{alreadyConfirmed.name}</strong> já tinha confirmado.
          Se foi engano, fale com os noivos.
        </div>
      )}
      {error && !justConfirmed && (
        <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 font-sans text-sm text-red-800 sm:mt-8 sm:p-5">
          {error === "naoencontrado"
            ? "Não conseguimos encontrar esse convidado. Tente novamente."
            : "Algo deu errado. Tente novamente."}
        </div>
      )}

      <GuestSearchList guests={guests} redirectTo="/charraia/rsvp" />
    </main>
  );
}
