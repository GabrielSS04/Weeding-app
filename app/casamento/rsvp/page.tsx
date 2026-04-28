import Link from "next/link";
import { db } from "@/lib/db";
import { formatRsvpDeadline, isRsvpClosed } from "@/lib/events";
import { GuestSearchList } from "./_components/GuestSearchList";

export const dynamic = "force-dynamic";

type GuestRow = {
  id: number;
  name: string;
  confirmed_at: Date | null;
  declined_at: Date | null;
};

export default async function RSVP({
  searchParams,
}: {
  searchParams: Promise<{
    ok?: string;
    already?: string;
    declined?: string;
    already_declined?: string;
    reset?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const closed = isRsvpClosed("casamento");
  const deadlineLabel = formatRsvpDeadline("casamento");

  const { rows } = await db.query<GuestRow>(
    "SELECT id, name, confirmed_at, declined_at FROM guest_list ORDER BY name ASC"
  );

  const guests = rows.map((g) => ({
    id: g.id,
    name: g.name,
    status: (g.confirmed_at
      ? "confirmed"
      : g.declined_at
      ? "declined"
      : "pending") as "confirmed" | "declined" | "pending",
  }));

  const findById = (raw?: string) => {
    if (!raw) return null;
    const id = Number(raw);
    if (!Number.isInteger(id)) return null;
    return rows.find((g) => g.id === id) ?? null;
  };

  const justConfirmed = findById(params.ok);
  const alreadyConfirmed = !justConfirmed ? findById(params.already) : null;
  const justDeclined =
    !justConfirmed && !alreadyConfirmed ? findById(params.declined) : null;
  const alreadyDeclined =
    !justConfirmed && !alreadyConfirmed && !justDeclined
      ? findById(params.already_declined)
      : null;
  const justReset =
    !justConfirmed && !alreadyConfirmed && !justDeclined && !alreadyDeclined
      ? findById(params.reset)
      : null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link
        href="/casamento"
        className="font-sans text-sm text-muted hover:text-accent"
      >
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground sm:mt-8 sm:text-5xl">
        Confirmar Presença
      </h1>
      <p className="mt-3 font-serif text-base text-muted sm:mt-4 sm:text-lg">
        {closed
          ? "O prazo de confirmação foi encerrado."
          : `Confirme até ${deadlineLabel}.`}
      </p>

      {closed && (
        <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 font-sans text-sm text-amber-900 sm:mt-8 sm:p-5">
          O prazo encerrou em <strong>{deadlineLabel}</strong>. Para qualquer
          mudança, fale diretamente com os noivos.
        </div>
      )}

      {justConfirmed && (
        <div
          role="status"
          className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 font-serif text-base text-emerald-900 sm:mt-8 sm:p-5 sm:text-lg"
        >
          🕊️ Obrigado, <strong>{justConfirmed.name}</strong>! Sua presença foi
          confirmada com alegria.
        </div>
      )}
      {alreadyConfirmed && (
        <div className="mt-6 rounded-md border border-accent/40 bg-accent-soft/40 p-4 font-serif text-base text-foreground sm:mt-8 sm:p-5 sm:text-lg">
          <strong>{alreadyConfirmed.name}</strong> já tinha presença
          confirmada. Se foi engano, fale com os noivos.
        </div>
      )}
      {justDeclined && (
        <div
          role="status"
          className="mt-6 rounded-md border border-rose-300 bg-rose-50 p-4 font-serif text-base text-rose-900 sm:mt-8 sm:p-5 sm:text-lg"
        >
          🤍 Que pena que não vai poder vir,{" "}
          <strong>{justDeclined.name}</strong>. Obrigado por avisar!
        </div>
      )}
      {alreadyDeclined && (
        <div className="mt-6 rounded-md border border-accent/40 bg-accent-soft/40 p-4 font-serif text-base text-foreground sm:mt-8 sm:p-5 sm:text-lg">
          <strong>{alreadyDeclined.name}</strong> já tinha respondido que não
          vai poder vir.
        </div>
      )}
      {justReset && (
        <div
          role="status"
          className="mt-6 rounded-md border border-accent/40 bg-accent-soft/40 p-4 font-serif text-base text-foreground sm:mt-8 sm:p-5 sm:text-lg"
        >
          Resposta de <strong>{justReset.name}</strong> removida. Você pode
          confirmar ou recusar quando quiser.
        </div>
      )}
      {params.error && (
        <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 font-sans text-sm text-red-800 sm:mt-8 sm:p-5">
          {params.error === "encerrado"
            ? `O prazo de confirmação encerrou em ${deadlineLabel}.`
            : params.error === "naoencontrado"
            ? "Não conseguimos encontrar esse convidado. Tente novamente."
            : "Algo deu errado. Tente novamente."}
        </div>
      )}

      <GuestSearchList
        guests={guests}
        redirectTo="/casamento/rsvp"
        closed={closed}
      />
    </main>
  );
}
