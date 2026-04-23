import Link from "next/link";
import { submitRsvp } from "./actions";

export default async function RSVP({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-12 sm:px-6 sm:py-16">
      <Link href="/casamento" className="font-sans text-sm text-muted hover:text-accent">
        ← Voltar
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground sm:mt-8 sm:text-5xl">
        Confirmar Presença
      </h1>
      <p className="mt-3 font-serif text-base text-muted sm:mt-4 sm:text-lg">
        Por favor, confirme até 30 de novembro de 2026.
      </p>

      {ok && (
        <div className="mt-6 rounded-md border border-accent/40 bg-accent-soft/40 p-4 font-serif text-base text-foreground sm:mt-8 sm:p-5 sm:text-lg">
          Obrigado! Sua confirmação foi registrada. 🕊️
        </div>
      )}
      {error && (
        <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 font-sans text-sm text-red-800 sm:mt-8 sm:p-5">
          Preencha nome e e-mail antes de enviar.
        </div>
      )}

      <form action={submitRsvp} className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
        <div>
          <label className="block font-sans text-sm text-muted">Nome completo</label>
          <input
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block font-sans text-sm text-muted">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block font-sans text-sm text-muted">
            Quantas pessoas virão com você?
          </label>
          <input
            name="guests"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block font-sans text-sm text-muted">
            Mensagem (opcional)
          </label>
          <textarea
            name="message"
            rows={3}
            className="mt-1 w-full rounded-md border border-accent/30 bg-white px-4 py-3 font-sans text-foreground outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-accent py-3 font-serif text-lg text-white transition hover:opacity-90"
        >
          Confirmar
        </button>
      </form>
    </main>
  );
}
